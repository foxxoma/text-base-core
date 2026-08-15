export class UI {
    content = {};
    actions = [];

    listeners = new Set();

    set(key, value, data = {}) {
        if (data) {
            value =  value.replace(
                /\{(\w+)\}/g,
                (match, key) => {
                    if (!(key in data)) {
                        throw new Error(
                            `Variable {${key}} is not defined.`
                        );
                    }

                    return data[key];
                }
            );
        }

        this.content[key] = value;

        return this;
    }

    render(data = {}, selector = null) {
        const templateIndex = this.getIndex(selector);
        const template = this.variants[templateIndex];

        return template.replace(
            /\{(\w+)\}/g,
            (match, key) => {
                if (!(key in data)) {
                    throw new Error(
                        `Variable {${key}} is not defined.`
                    );
                }

                const value = data[key];

                if (typeof value === 'function') {
                    return value(templateIndex);
                }

                return value;
            }
        );
    }

    get(key) {
        return this.content[key];
    }

    addAction(action) {
        this.actions.push(action);

        return this;
    }

    getActions() {
        return [...this.actions];
    }

    clear() {
        this.content = {};
        this.actions = [];

        return this;
    }

    apply() {
        const state = {
            content: this.content,
            actions: this.actions
        };

        for (const listener of this.listeners) {
            listener(state);
        }

        return this;
    }

    subscribe(listener) {
        this.listeners.add(listener);

        return this;
    }

    unsubscribe(listener) {
        this.listeners.delete(listener);

        return this;
    }
}