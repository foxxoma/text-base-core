export class UI {
    content = {};
    actions = [];

    listeners = new Set();

    set(key, value) {
        this.content[key] = value;

        return this;
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