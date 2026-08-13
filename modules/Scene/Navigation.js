class Navigation {
    stack = [];

    constructor({
        ui = null,
        context = {},
        onChange = null
    } = {}) {
        this.ui = ui;
        this.context = context;
        this.onChange = onChange;
    }

    call(scene, data = {}) {
        this.validateScene(scene);

        const current = this.getScene();

        if (current === scene) {
            this.stack[this.stack.length - 1] = {
                scene,
                data: { ...data }
            };
        } else {
            this.stack.push({
                scene,
                data: { ...data }
            });
        }

        return this.run();
    }

    goto(scene, data = {}) {
        this.validateScene(scene);

        this.stack = [{
            scene,
            data: { ...data }
        }];

        return this.run();
    }

    return() {
        if (this.stack.length <= 1) {
            return this;
        }

        this.stack.pop();

        return this.run();
    }

    run() {
        const scene = this.getScene();

        if (!scene) {
            return this;
        }

        if (this.ui) {
            this.ui.clear();
        }

        scene.run(
            this.getData(),
            this.getContext()
        );

        this.onChange?.(scene, this.getData());

        return this;
    }

    getScene() {
        return this.stack.at(-1)?.scene ?? null;
    }

    getData() {
        const data = {};

        for (const frame of this.stack) {
            Object.assign(data, frame.data);
        }

        return data;
    }

    getContext() {
        return {
            ...this.context,
            navigation: this,
            ui: this.ui
        };
    }

    validateScene(scene) {
        if (!(scene instanceof Scene)) {
            throw new Error(
                'Navigation expects a Scene instance.'
            );
        }
    }
}