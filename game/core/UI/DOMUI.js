export class DOMUI {
    constructor(ui, {
        content = {},
        actions = null
    } = {}) {
        this.content = content;
        this.actions = actions;

        ui.subscribe(
            state => this.render(state)
        );
    }

    render(state) {
        this.renderContent(
            state.content
        );

        this.renderActions(
            state.actions
        );
    }

    renderContent(content) {
        for (const [key, selector]
            of Object.entries(this.content)) {

            const element =
                document.querySelector(selector);

            if (!element) {
                continue;
            }

            element.textContent =
                content[key] ?? '';
        }
    }

    renderActions(actions) {
        if (!this.actions) {
            return;
        }

        const element =
            document.querySelector(this.actions);

        if (!element) {
            return;
        }

        element.innerHTML = '';

        for (const action of actions) {
            const button =
                document.createElement('button');

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