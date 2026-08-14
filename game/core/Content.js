export class Content {
    scenes = new Map();
    templates = new Map();

    scene(id, value) {
        if (value !== undefined) {
            this.scenes.set(id, value);
        }

        return this.scenes.get(id);
    }

    template(id, value) {
        if (value !== undefined) {
            this.templates.set(id, value);
        }

        return this.templates.get(id);
    }
}