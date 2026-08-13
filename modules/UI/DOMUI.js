class DOMUI {
    constructor(ui, root = document) {
        this.ui = ui;
        this.root = root;
    }

    render(key) {
        const element = this.root.querySelector(
            `[data-ui="${key}"]`
        );

        if (!element) {
            return this;
        }

        element.innerHTML = this.ui.get(key) ?? '';

        return this;
    }

    renderAll() {
        for (const key of Object.keys(this.ui.content)) {
            this.render(key);
        }

        return this;
    }

    set(key, value) {
        this.ui.set(key, value);

        return this.render(key);
    }

    clear(key) {
        this.ui.clear(key);

        return this.render(key);
    }

    clearAll() {
        this.ui.clearAll();

        return this.renderAll();
    }
}