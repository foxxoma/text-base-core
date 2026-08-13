class Declension {
    name = '';
    types = [];
    variants = {};

    constructor(name, types, variants = {}) {
        this.name = name;
        this.types = types;
        this.variants = variants;
    }

    addVariants(type, variants) {
        this.validateType(type);

        if (!this.variants[type]) {
            this.variants[type] = [];
        }

        this.variants[type] = [
            ...new Set([
                ...this.variants[type],
                ...variants
            ])
        ];
    }

    getVariants(type) {
        this.validateType(type);

        return this.variants[type] || [];
    }

    render(type, selector = null) {
        const variants = this.getVariants(type);

        if (variants.length === 0) {
            throw new Error(
                `No variants available for type ${type}.`
            );
        }

        const index = selector
            ? selector(variants)
            : Math.floor(
                Math.random() * variants.length
            );

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= variants.length
        ) {
            throw new Error(
                `Invalid variant index: ${index}.`
            );
        }

        return variants[index];
    }

    removeVariant(type, variant) {
        this.validateType(type);

        const variants = this.variants[type];

        if (!variants?.includes(variant)) {
            throw new Error(
                `Variant ${variant} not found for type ${type}.`
            );
        }

        this.variants[type] = variants.filter(
            item => item !== variant
        );
    }

    removeAllVariants(type) {
        this.validateType(type);

        this.variants[type] = [];
    }

    clear() {
        this.variants = {};
    }

    validateType(type) {
        if (!this.types.includes(type)) {
            throw new Error(
                `Declension type ${type} is not valid.`
            );
        }
    }

    toJSON() {
        return {
            name: this.name,
            types: this.types,
            variants: this.variants
        };
    }

    static fromJSON(data) {
        return new Declension(
            data.name,
            data.types,
            data.variants
        );
    }
}