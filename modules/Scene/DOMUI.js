class DOMUI {
    constructor(ui, {
        content = {},
        actions = null
    } = {}) {
        this.ui = ui;

        this.content = content;
        this.actions = actions;
    }

    render() {
        this.renderContent();
        this.renderActions();
    }

    renderContent() {
        for (const [key, selector] of Object.entries(
            this.content
        )) {
            const element = document.querySelector(selector);

            if (!element) {
                continue;
            }

            element.textContent =
                this.ui.get(key) ?? '';
        }
    }

    renderActions() {
        if (!this.actions) {
            return;
        }

        const element = document.querySelector(
            this.actions
        );

        if (!element) {
            return;
        }

        element.innerHTML = '';

        for (const action of this.ui.getActions()) {
            const button = document.createElement('button');

            button.textContent =
                typeof action.text === 'function'
                    ? action.text()
                    : action.text;

            button.addEventListener(
                'click',
                action.action
            );

            element.appendChild(button);
        }
    }
}