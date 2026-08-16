export class DynamicState {
    steps = {};

    index = 0;
    minIndex = null;
    maxIndex = null;

    effects = {};

    listeners = new Set();

    constructor(
        steps = {},
        index = 0,
        minIndex = null,
        maxIndex = null,
        effects = {}
    ) {
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
        const nextIndex =
            this.clamp(value);

        if (nextIndex === this.index) {
            return this;
        }

        const previous =
            this.index;

        this.index = nextIndex;

        this.emit({
            type: 'index',
            previous,
            value: this.index,
            state: this
        });

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

        const previous =
            this.effects[name];

        if (previous === value) {
            return this;
        }

        this.effects[name] = value;

        this.emit({
            type: 'effect',
            name,
            previous,
            value,
            state: this
        });

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
        if (!this.hasEffect(name)) {
            return this;
        }

        const previous =
            this.effects[name];

        delete this.effects[name];

        this.emit({
            type: 'effect',
            name,
            previous,
            value: undefined,
            state: this
        });

        return this;
    }

    clearEffects() {
        if (
            Object.keys(this.effects).length === 0
        ) {
            return this;
        }

        const previous = {
            ...this.effects
        };

        this.effects = {};

        this.emit({
            type: 'effects',
            previous,
            value: {},
            state: this
        });

        return this;
    }

    getEffects() {
        return {
            ...this.effects
        };
    }

    // ─────────────────────────────
    // Events
    // ─────────────────────────────

    onChange(listener) {
        if (typeof listener !== 'function') {
            throw new TypeError(
                'Change listener must be a function.'
            );
        }

        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    emit(change) {
        for (const listener of this.listeners) {
            listener(change);
        }
    }

    // ─────────────────────────────
    // Render
    // ─────────────────────────────

    render() {
        const index = this.getIndex();

        for (
            const [range, state]
            of Object.entries(this.steps)
        ) {
            const [
                fromValue,
                toValue
            ] = range.split(':');

            const from =
                fromValue === ''
                    ? -Infinity
                    : Number(fromValue);

            const to =
                toValue === ''
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
            steps: this.steps,
            index: this.index,
            minIndex: this.minIndex,
            maxIndex: this.maxIndex,
            effects: this.effects
        };
    }

    static fromJSON(data) {
        return new DynamicState(
            data.steps,
            data.index,
            data.minIndex,
            data.maxIndex,
            data.effects
        );
    }
}