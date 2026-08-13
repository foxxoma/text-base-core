class UI {
    content = {};
    actions = [];

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
}