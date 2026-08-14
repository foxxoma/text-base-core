import { Scene } from '../content/scenes/Scene.js';
import { Template } from '../content/templates/Template.js';

export class Content {
    scenes = new Map();
    templates = new Map();

    setScene(key, scene) {
        this.validateScene(scene);
        if (this.scenes.has(key)) {
            throw new Error(
                `Scene "${key}" is already registered.`
            );
        }

        this.scenes.set(key, scene);

        return this;
    }

    setTemplate(key, template) {
        this.validateTemplate(template);
        if (this.templates.has(key)) {
            throw new Error(
                `Template "${key}" is already registered.`
            );
        }

        this.templates.set(key, template);

        return this;
    }

    scene(key) {
        const scene = this.scenes.get(key);

        if (!scene) {
            throw new Error(
                `Scene "${key}" not found.`
            );
        }

        return scene;
    }

    template(key) {
        const template =
            this.templates.get(key);

        if (!template) {
            throw new Error(
                `Template "${key}" not found.`
            );
        }

        return template;
    }

    validateScene(scene) {
        if (!(scene instanceof Scene)) {
            throw new TypeError(
                'Content expects a Scene instance.'
            );
        }
    }

    validateTemplate(template) {
        if (!(template instanceof Template)) {
            throw new TypeError(
                'Content expects a Template instance.'
            );
        }
    }
}