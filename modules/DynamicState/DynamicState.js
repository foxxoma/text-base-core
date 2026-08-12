class DynamicState {
    name = '';
    steps = {};
    index = 0;

    constructor(name, steps, index = 0) {
        this.name = name;
        this.steps = steps;
        this.index = index;
    }

    setIndex(newIndex) {
        this.index = newIndex;

        return this;
    }

    progress(amount) {
        this.index += amount;

        return this;
    }

    regress(amount) {
        this.index -= amount;

        return this;
    }

    getIndex() {
        return this.index;
    }

    render() {
        for (const [range, state] of Object.entries(this.steps)) {
            const [fromValue, toValue] = range.split(':');

            const from = fromValue === ''
                ? -Infinity
                : Number(fromValue);

            const to = toValue === ''
                ? Infinity
                : Number(toValue);

            if (
                this.index >= from &&
                this.index <= to
            ) {
                return state;
            }
        }

        return 'Unknown';
    }
}


class DynamicStateRegistry {
    states = {};

    registerState(name, steps, index = 0) {
        if (this.states[name]) {
            throw new Error(
                `State with name ${name} already exists.`
            );
        }

        this.states[name] = new DynamicState(
            name,
            steps,
            index
        );

        return this.states[name];
    }

    getState(name) {
        if (!this.states[name]) {
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
        if (!this.states[name]) {
            throw new Error(
                `State with name ${name} does not exist.`
            );
        }

        delete this.states[name];
    }

    clear() {
        this.states = {};
    }

    toJSON() {
        const json = {};

        for (const [name, state] of Object.entries(this.states)) {
            json[name] = {
                steps: state.steps,
                index: state.index
            };
        }

        return json;
    }

    fromJSON(json) {
        this.states = {};

        for (const [name, data] of Object.entries(json)) {
            this.states[name] = new DynamicState(
                name,
                data.steps,
                data.index
            );
        }
    }
}