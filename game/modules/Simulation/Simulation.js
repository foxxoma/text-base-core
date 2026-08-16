export class Simulation {
    events = new Map();
    groups = new Map();
    instances = new Set();

    constructor() {
        this.events = new Map();
        this.groups = new Map();
        this.instances = new Set();
    }

    // ─────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────

    event(key, weight, groups = []) {
        if (
            typeof key !== 'string' ||
            key.length === 0
        ) {
            throw new Error(
                'Simulation event key must be a non-empty string.'
            );
        }

        if (this.events.has(key)) {
            throw new Error(
                `Simulation event "${key}" already exists.`
            );
        }

        if (typeof weight !== 'function') {
            throw new TypeError(
                `Weight for event "${key}" must be a function.`
            );
        }

        if (!Array.isArray(groups)) {
            throw new TypeError(
                `Groups for event "${key}" must be an array.`
            );
        }

        const uniqueGroups = [
            ...new Set(groups)
        ];

        for (const group of uniqueGroups) {
            if (
                typeof group !== 'string' ||
                group.length === 0
            ) {
                throw new Error(
                    `Invalid group "${group}" for event "${key}".`
                );
            }

            if (!this.groups.has(group)) {
                this.groups.set(
                    group,
                    new Set()
                );
            }

            this.groups
                .get(group)
                .add(key);
        }

        this.events.set(key, {
            key,
            weight,
            groups: uniqueGroups
        });

        return this;
    }

    removeEvent(key) {
        const event = this.events.get(key);

        if (!event) {
            return this;
        }

        for (const group of event.groups) {
            const keys =
                this.groups.get(group);

            if (!keys) {
                continue;
            }

            keys.delete(key);

            if (keys.size === 0) {
                this.groups.delete(group);
            }
        }

        this.events.delete(key);

        this.invalidateEvent(key);

        return this;
    }

    hasEvent(key) {
        return this.events.has(key);
    }

    getEvent(key) {
        return this.events.get(key) ?? null;
    }

    getEvents() {
        return [
            ...this.events.values()
        ];
    }

    getGroup(group) {
        return this.groups.has(group)
            ? [
                ...this.groups.get(group)
            ]
            : [];
    }

    // ─────────────────────────────────────────────
    // Instances
    // ─────────────────────────────────────────────

    create(entity) {
        const instance =
            new SimulationInstance(
                this,
                entity
            );

        this.instances.add(instance);

        return instance;
    }

    destroy(instance) {
        this.instances.delete(instance);

        return this;
    }

    // ─────────────────────────────────────────────
    // Invalidation
    // ─────────────────────────────────────────────

    invalidateEvent(key) {
        for (const instance of this.instances) {
            instance.invalidateEvent(key);
        }

        return this;
    }

    invalidateGroup(group) {
        const keys =
            this.groups.get(group);

        if (!keys) {
            return this;
        }

        for (const instance of this.instances) {
            instance.invalidateKeys(keys);
        }

        return this;
    }

    invalidateGroups(groups) {
        if (!Array.isArray(groups)) {
            groups = [groups];
        }

        const keys = new Set();

        for (const group of groups) {
            const groupKeys =
                this.groups.get(group);

            if (!groupKeys) {
                continue;
            }

            for (const key of groupKeys) {
                keys.add(key);
            }
        }

        for (const instance of this.instances) {
            instance.invalidateKeys(keys);
        }

        return this;
    }
}


// ═══════════════════════════════════════════════
// Simulation instance
// ═══════════════════════════════════════════════

export class SimulationInstance {
    constructor(simulation, entity) {
        this.simulation = simulation;
        this.entity = entity;

        /*
         * Calculated weights.
         *
         * key -> weight
         */
        this.weights = new Map();

        /*
         * Only keys that need recalculation.
         */
        this.dirtyKeys = new Set();

        /*
         * First calculation.
         */
        for (
            const key
            of simulation.events.keys()
        ) {
            this.dirtyKeys.add(key);
        }
    }

    // ─────────────────────────────────────────────
    // Invalidation
    // ─────────────────────────────────────────────

    invalidateEvent(key) {
        if (
            !this.simulation.hasEvent(key)
        ) {
            return this;
        }

        this.dirtyKeys.add(key);

        return this;
    }

    invalidateKeys(keys) {
        for (const key of keys) {
            this.invalidateEvent(key);
        }

        return this;
    }

    invalidateGroup(group) {
        const keys =
            this.simulation.getGroup(group);

        this.invalidateKeys(keys);

        return this;
    }

    invalidateGroups(groups) {
        if (!Array.isArray(groups)) {
            groups = [groups];
        }

        for (const group of groups) {
            this.invalidateGroup(group);
        }

        return this;
    }

    invalidateAll() {
        for (
            const key
            of this.simulation.events.keys()
        ) {
            this.dirtyKeys.add(key);
        }

        return this;
    }

    // ─────────────────────────────────────────────
    // Refresh
    // ─────────────────────────────────────────────

    refresh() {
        this.refreshKeys(
            this.dirtyKeys
        );

        return this;
    }

    refreshEvent(key) {
        const event =
            this.simulation.getEvent(key);

        if (!event) {
            return this;
        }

        this.calculate(event);

        this.dirtyKeys.delete(key);

        return this;
    }

    refreshKeys(keys) {
        for (const key of keys) {
            this.refreshEvent(key);
        }

        return this;
    }

    calculate(event) {
        let weight;

        try {
            weight =
                event.weight(
                    this.entity
                );
        } catch (error) {
            throw new Error(
                `Failed to calculate weight for event "${event.key}".`,
                {
                    cause: error
                }
            );
        }

        if (
            !Number.isFinite(weight) ||
            weight <= 0
        ) {
            this.weights.delete(
                event.key
            );

            return;
        }

        this.weights.set(
            event.key,
            weight
        );
    }

    // ─────────────────────────────────────────────
    // Selection
    // ─────────────────────────────────────────────

    next(groups = null) {
        /*
         * First update all dirty weights.
         */
        this.refresh();

        /*
         * No group restriction:
         * all calculated events are available.
         */
        if (groups === null) {
            return this.choose(
                this.weights
            );
        }

        if (!Array.isArray(groups)) {
            groups = [groups];
        }

        /*
         * Build a temporary set of allowed keys.
         */
        const allowedKeys =
            new Set();

        for (const group of groups) {
            const keys =
                this.simulation.getGroup(group);

            for (const key of keys) {
                allowedKeys.add(key);
            }
        }

        /*
         * Filter calculated weights.
         */
        const available =
            new Map();

        for (
            const [key, weight]
            of this.weights
        ) {
            if (
                allowedKeys.has(key)
            ) {
                available.set(
                    key,
                    weight
                );
            }
        }

        return this.choose(
            available
        );
    }

    choose(weights) {
        if (weights.size === 0) {
            return null;
        }

        let total = 0;

        for (const weight of weights.values()) {
            total += weight;
        }

        if (
            !Number.isFinite(total) ||
            total <= 0
        ) {
            return null;
        }

        let random =
            Math.random() * total;

        for (
            const [key, weight]
            of weights
        ) {
            random -= weight;

            if (random < 0) {
                return key;
            }
        }

        return null;
    }

    // ─────────────────────────────────────────────
    // Information
    // ─────────────────────────────────────────────

    getWeight(key) {
        this.refreshEvent(key);

        return this.weights.get(key) ?? 0;
    }

    getAvailableEvents(groups = null) {
        this.refresh();

        if (groups === null) {
            return [
                ...this.weights.entries()
            ].map(
                ([key, weight]) => ({
                    key,
                    weight
                })
            );
        }

        if (!Array.isArray(groups)) {
            groups = [groups];
        }

        const allowedKeys =
            new Set();

        for (const group of groups) {
            for (
                const key
                of this.simulation.getGroup(group)
            ) {
                allowedKeys.add(key);
            }
        }

        return [
            ...this.weights.entries()
        ]
            .filter(
                ([key]) =>
                    allowedKeys.has(key)
            )
            .map(
                ([key, weight]) => ({
                    key,
                    weight
                })
            );
    }
}