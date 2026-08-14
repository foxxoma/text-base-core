import { Scene } from '../content/scenes/Scene.js';

export class Navigation {
    stack = [];

    constructor({
        content,
        ui = null,
        onChange = null
    } = {}) {
        if (!content) {
            throw new Error(
                'Navigation requires a content instance.'
            );
        }

        this.content = content;
        this.ui = ui;
        this.onChange = onChange;
    }

    // ─────────────────────────────────────────────
    // Navigation
    // ─────────────────────────────────────────────

    call(scene, data = {}) {
        this.validateSceneKey(scene);
        this.validateData(data);

        const current = this.stack.at(-1);

        // Calling the same scene again replaces
        // its current data instead of creating
        // another identical frame.
        if (
            current &&
            current.scene === scene
        ) {
            current.data = {
                ...data
            };
        } else {
            this.stack.push({
                scene,
                data: {
                    ...data
                }
            });
        }

        return this.run();
    }

    goto(scene, data = {}) {
        this.validateSceneKey(scene);
        this.validateData(data);

        this.stack = [{
            scene,
            data: {
                ...data
            }
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

    // ─────────────────────────────────────────────
    // Run
    // ─────────────────────────────────────────────

    run() {
        const frame = this.getFrame();

        if (!frame) {
            return this;
        }

        const scene = this.content.scene(
            frame.scene
        );

        if (!scene) {
            throw new Error(
                `Scene "${frame.scene}" not found.`
            );
        }

        this.validateScene(scene);

        this.ui?.clear();

        scene.run(
            this.getData()
        );

        this.onChange?.(
            scene,
            this.getData()
        );

        return this;
    }

    // ─────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────

    getFrame() {
        return this.stack.at(-1) ?? null;
    }

    getScene() {
        return this.getFrame()?.scene ?? null;
    }

    getData() {
        const data = {};

        for (const frame of this.stack) {
            Object.assign(
                data,
                frame.data
            );
        }

        return data;
    }

    getStack() {
        return this.stack.map(frame => ({
            scene: frame.scene,
            data: {
                ...frame.data
            }
        }));
    }

    // ─────────────────────────────────────────────
    // Save / Load
    // ─────────────────────────────────────────────

    toJSON() {
        return {
            stack: this.getStack()
        };
    }

    fromJSON(data) {
        if (
            !data ||
            !Array.isArray(data.stack)
        ) {
            throw new Error(
                'Invalid Navigation data.'
            );
        }

        for (const frame of data.stack) {
            this.validateScene(frame.scene);
            this.validateData(frame.data);
        }

        this.stack = data.stack.map(frame => ({
            scene: frame.scene,
            data: {
                ...frame.data
            }
        }));

        return this;
    }

    static fromJSON(data, options = {}) {
        const navigation = new Navigation(
            options
        );

        navigation.fromJSON(data);

        return navigation;
    }

    // ─────────────────────────────────────────────
    // Validation
    // ─────────────────────────────────────────────

    validateSceneKey(scene) {
        if (
            typeof scene !== 'string' ||
            scene.trim() === ''
        ) {
            throw new Error(
                'Navigation scene must be a non-empty string.'
            );
        }

        if (!this.content.scene(scene)) {
            throw new Error(
                `Scene "${scene}" not found.`
            );
        }
    }

    validateScene(scene) {
        if (!(scene instanceof Scene)) {
            throw new TypeError(
                'Content expects a Scene instance.'
            );
        }
    }

    validateData(data) {
        if (
            data === null ||
            typeof data !== 'object' ||
            Array.isArray(data)
        ) {
            throw new Error(
                'Navigation data must be an object.'
            );
        }
    }
}