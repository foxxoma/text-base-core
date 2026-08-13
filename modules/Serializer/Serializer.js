class Serializer {
    static types = new Map();

    static TYPE_KEY = '__serializer';

    // ─────────────────────────────────────────────
    // Registration
    // ─────────────────────────────────────────────

    static register(name, Class, factory = null) {
        if (!name || typeof name !== 'string') {
            throw new Error(
                'Serializer type name must be a non-empty string.'
            );
        }

        if (typeof Class !== 'function') {
            throw new Error(
                `Serializer class for type "${name}" must be a constructor.`
            );
        }

        if (this.types.has(name)) {
            throw new Error(
                `Serializer type "${name}" already registered.`
            );
        }

        this.types.set(name, {
            Class,
            factory
        });
    }

    static unregister(name) {
        this.types.delete(name);
    }

    static hasType(name) {
        return this.types.has(name);
    }

    static getType(Class) {
        for (const [name, registration] of this.types) {
            if (registration.Class === Class) {
                return name;
            }
        }

        return null;
    }

    // ─────────────────────────────────────────────
    // Serialize
    // ─────────────────────────────────────────────

    static encode(value) {
        return this.encodeValue(value, new WeakSet());
    }

    static encodeValue(value, seen) {
        // primitive values
        if (value === undefined) {
            return {
                [this.TYPE_KEY]: {
                    type: 'undefined'
                }
            };
        }

        if (value === null) {
            return null;
        }

        if (typeof value === 'number') {
            if (Number.isNaN(value)) {
                return {
                    [this.TYPE_KEY]: {
                        type: 'number',
                        value: 'NaN'
                    }
                };
            }

            if (value === Infinity) {
                return {
                    [this.TYPE_KEY]: {
                        type: 'number',
                        value: 'Infinity'
                    }
                };
            }

            if (value === -Infinity) {
                return {
                    [this.TYPE_KEY]: {
                        type: 'number',
                        value: '-Infinity'
                    }
                };
            }

            return value;
        }

        if (typeof value === 'bigint') {
            return {
                [this.TYPE_KEY]: {
                    type: 'bigint',
                    value: value.toString()
                }
            };
        }

        if (
            typeof value === 'string' ||
            typeof value === 'boolean'
        ) {
            return value;
        }

        if (typeof value === 'function') {
            throw new Error(
                'Functions cannot be serialized.'
            );
        }

        // ─────────────────────────────
        // Objects
        // ─────────────────────────────

        if (seen.has(value)) {
            throw new Error(
                'Cannot serialize circular reference.'
            );
        }

        seen.add(value);

        try {
            if (value instanceof Date) {
                return {
                    [this.TYPE_KEY]: {
                        type: 'Date',
                        value: value.toISOString()
                    }
                };
            }

            if (value instanceof Set) {
                return {
                    [this.TYPE_KEY]: {
                        type: 'Set',
                        value: [...value].map(item =>
                            this.encodeValue(item, seen)
                        )
                    }
                };
            }

            if (value instanceof Map) {
                return {
                    [this.TYPE_KEY]: {
                        type: 'Map',
                        value: [...value.entries()].map(
                            ([key, item]) => [
                                this.encodeValue(key, seen),
                                this.encodeValue(item, seen)
                            ]
                        )
                    }
                };
            }

            if (Array.isArray(value)) {
                return value.map(item =>
                    this.encodeValue(item, seen)
                );
            }

            if (typeof value === 'object') {
                const type = this.getType(value.constructor);

                if (type) {
                    const data =
                        typeof value.toJSON === 'function'
                            ? value.toJSON()
                            : value;

                    return {
                        [this.TYPE_KEY]: {
                            type,
                            value: this.encodeValue(data, seen)
                        }
                    };
                }

                const result = {};

                for (const [key, item] of Object.entries(value)) {
                    result[key] = this.encodeValue(
                        item,
                        seen
                    );
                }

                return result;
            }

            throw new Error(
                `Cannot serialize value of type ${typeof value}.`
            );

        } finally {
            seen.delete(value);
        }
    }

    static serialize(value) {
        return this.encode(value);
    }

    static stringify(value, space = 2) {
        return JSON.stringify(
            this.encode(value),
            null,
            space
        );
    }

    // ─────────────────────────────────────────────
    // Deserialize
    // ─────────────────────────────────────────────

    static decode(value) {
        if (
            value === null ||
            typeof value !== 'object'
        ) {
            return value;
        }

        if (Array.isArray(value)) {
            return value.map(item =>
                this.decode(item)
            );
        }

        const marker = value[this.TYPE_KEY];

        if (!marker || typeof marker !== 'object') {
            const result = {};

            for (const [key, item] of Object.entries(value)) {
                result[key] = this.decode(item);
            }

            return result;
        }

        switch (marker.type) {
            case 'undefined':
                return undefined;

            case 'number':
                return this.decodeNumber(marker.value);

            case 'bigint':
                return BigInt(marker.value);

            case 'Date':
                return new Date(marker.value);

            case 'Set':
                return new Set(
                    marker.value.map(item =>
                        this.decode(item)
                    )
                );

            case 'Map':
                return new Map(
                    marker.value.map(([key, item]) => [
                        this.decode(key),
                        this.decode(item)
                    ])
                );

            default:
                return this.decodeClass(
                    marker.type,
                    marker.value
                );
        }
    }

    static decodeNumber(value) {
        switch (value) {
            case 'NaN':
                return NaN;

            case 'Infinity':
                return Infinity;

            case '-Infinity':
                return -Infinity;

            default:
                throw new Error(
                    `Unknown serialized number "${value}".`
                );
        }
    }

    static deserialize(value) {
        return this.decode(value);
    }

    static parse(json) {
        return this.decode(
            JSON.parse(json)
        );
    }

    // ─────────────────────────────────────────────
    // Classes
    // ─────────────────────────────────────────────

    static decodeClass(type, data) {
        const registration = this.types.get(type);

        if (!registration) {
            throw new Error(
                `Serializer type "${type}" is not registered.`
            );
        }

        const decodedData = this.decode(data);

        // Factory has the highest priority.
        if (registration.factory) {
            return registration.factory(decodedData);
        }

        const { Class } = registration;

        // Static fromJSON
        if (typeof Class.fromJSON === 'function') {
            return Class.fromJSON(decodedData);
        }

        // Instance fromJSON
        const instance = Object.create(
            Class.prototype
        );

        if (typeof instance.fromJSON === 'function') {
            instance.fromJSON(decodedData);

            return instance;
        }

        // Default restoration
        Object.assign(
            instance,
            decodedData
        );

        return instance;
    }

    // ─────────────────────────────────────────────
    // Save / Load
    // ─────────────────────────────────────────────

    static save(value, space = 2) {
        return this.stringify(
            value,
            space
        );
    }

    static load(json) {
        return this.parse(json);
    }
}