class DynamicState {
    name = '';
    steps = {};

    index = 0;
    minIndex = null;
    maxIndex = null;
    debuff = null;

    constructor(
        name,
        steps = {},
        index = 0,
        minIndex = null,
        maxIndex = null,
        debuff = null
    ) {
        this.name = name;
        this.steps = steps;

        this.minIndex = minIndex;
        this.maxIndex = maxIndex;
        this.debuff = debuff;

        this.setIndex(index);
    }

    setIndex(value) {
        this.index = this.clamp(value);

        return this;
    }

    getIndex() {
        let index = this.index;

        if (this.debuff !== null) {
            index -= this.debuff;
        }

        return this.clamp(index);
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

    setDebuff(value) {
        this.debuff = value;

        return this;
    }

    unsetDebuff() {
        this.debuff = null;

        return this;
    }

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

    toJSON() {
        return {
            name: this.name,
            steps: this.steps,
            index: this.index,
            minIndex: this.minIndex,
            maxIndex: this.maxIndex,
            debuff: this.debuff
        };
    }

    static fromJSON(data) {
        return new DynamicState(
            data.name,
            data.steps,
            data.index,
            data.minIndex,
            data.maxIndex,
            data.debuff
        );
    }
}


class DynamicStateRegistry {
    states = {};

    registerState(
        name,
        steps = {},
        index = 0,
        minIndex = null,
        maxIndex = null,
        debuff = null
    ) {
        if (Object.hasOwn(this.states, name)) {
            throw new Error(
                `State with name ${name} already exists.`
            );
        }

        this.states[name] = new DynamicState(
            name,
            steps,
            index,
            minIndex,
            maxIndex,
            debuff
        );

        return this.states[name];
    }

    getState(name) {
        if (!Object.hasOwn(this.states, name)) {
            throw new Error(
                `State with name ${name} does not exist.`
            );
        }

        return this.states[name];
    }

    render(name) {
        return this.getState(name).render();
    }

    removeState(name) {
        if (!Object.hasOwn(this.states, name)) {
            throw new Error(
                `State with name ${name} does not exist.`
            );
        }

        delete this.states[name];

        return this;
    }

    clear() {
        this.states = {};

        return this;
    }

    toJSON() {
        return {
            states: this.states
        };
    }

    static fromJSON(data) {
        const registry = new DynamicStateRegistry();

        registry.states = data.states;

        return registry;
    }
}