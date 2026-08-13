class DynamicState {
    name = '';
    steps = {};

    index = 0;
    minIndex = null;
    maxIndex = null;

    effects = {};

    constructor(
        name,
        steps = {},
        index = 0,
        minIndex = null,
        maxIndex = null,
        effects = {}
    ) {
        this.name = name;
        this.steps = steps;

        this.minIndex = minIndex;
        this.maxIndex = maxIndex;

        this.effects = {
            ...effects
        };

        this.setIndex(index);
    }

    // ─────────────────────────────
    // Index
    // ─────────────────────────────

    setIndex(value) {
        this.index = this.clamp(value);

        return this;
    }

    getIndex(selector = null) {
        if (selector) {
            return this.clamp(
                selector(
                    this.index,
                    this.effects
                )
            );
        }

        const effects = Object.values(
            this.effects
        );

        const modifier = effects.reduce(
            (total, value) => total + value,
            0
        );

        return this.clamp(
            this.index + modifier
        );
    }

    progress(amount) {
        return this.setIndex(
            this.index + amount
        );
    }

    regress(amount) {
        return this.setIndex(
            this.index - amount
        );
    }

    // ─────────────────────────────
    // Effects
    // ─────────────────────────────

    setEffect(name, value = 0) {
        if (
            !name ||
            typeof name !== 'string'
        ) {
            throw new Error(
                'Effect name must be a non-empty string.'
            );
        }

        if (typeof value !== 'number') {
            throw new Error(
                `Effect "${name}" value must be a number.`
            );
        }

        this.effects[name] = value;

        return this;
    }

    getEffect(name) {
        return this.effects[name] ?? null;
    }

    hasEffect(name) {
        return Object.hasOwn(
            this.effects,
            name
        );
    }

    removeEffect(name) {
        delete this.effects[name];

        return this;
    }

    clearEffects() {
        this.effects = {};

        return this;
    }

    getEffects() {
        return {
            ...this.effects
        };
    }

    // ─────────────────────────────
    // Render
    // ─────────────────────────────

    render() {
        const index = this.getIndex();

        for (const [range, state] of Object.entries(this.steps)) {
            const [fromValue, toValue] = range.split(':');

            const from = fromValue === ''
                ? -Infinity
                : Number(fromValue);

            const to = toValue === ''
                ? Infinity
                : Number(toValue);

            if (
                index >= from &&
                index <= to
            ) {
                return state;
            }
        }

        return 'Unknown';
    }

    // ─────────────────────────────
    // Clamp
    // ─────────────────────────────

    clamp(value) {
        if (
            this.minIndex !== null &&
            value < this.minIndex
        ) {
            return this.minIndex;
        }

        if (
            this.maxIndex !== null &&
            value > this.maxIndex
        ) {
            return this.maxIndex;
        }

        return value;
    }

    // ─────────────────────────────
    // JSON
    // ─────────────────────────────

    toJSON() {
        return {
            name: this.name,
            steps: this.steps,
            index: this.index,
            minIndex: this.minIndex,
            maxIndex: this.maxIndex,
            effects: this.effects
        };
    }

    static fromJSON(data) {
        return new DynamicState(
            data.name,
            data.steps,
            data.index,
            data.minIndex,
            data.maxIndex,
            data.effects
        );
    }
}