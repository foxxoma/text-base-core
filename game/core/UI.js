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
        this.emit();
    }

    subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error(
                'UI listener must be a function.'
            );
        }

        this.listeners.add(listener);

        return this;
    }

    unsubscribe(listener) {
        this.listeners.delete(listener);

        return this;
    }

    emit() {
        for (const listener of this.listeners) {
            listener(this);
        }
    }
}