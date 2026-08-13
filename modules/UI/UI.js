class UI {
    content = {};

    constructor(content = {}) {
        this.content = {
            ...content
        };
    }

    set(key, value) {
        this.content[key] = value;

        return this;
    }

    setMany(content) {
        Object.assign(
            this.content,
            content
        );

        return this;
    }

    get(key) {
        return this.content[key];
    }

    clear(key) {
        this.content[key] = '';

        return this;
    }

    clearAll() {
        this.content = {};

        return this;
    }
}