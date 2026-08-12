class Template {
    name = '';
    variants = [];

    constructor(name, variants = []) {
        this.name = name;
        this.variants = [...new Set(variants)];
    }

    addVariants(variants) {
        this.variants = [
            ...new Set([
                ...this.variants,
                ...variants
            ])
        ];
    }

    getVariants() {
        return this.variants;
    }

    getRandomIndex() {
        if (this.variants.length === 0) {
            throw new Error(
                `No variants available for template ${this.name}.`
            );
        }

        return Math.floor(
            Math.random() * this.variants.length
        );
    }

    getRandom() {
        const templateIndex = this.getRandomIndex();
        const template = this.variants[templateIndex];

        return template;
    }

    render(data = {}) {
        const templateIndex = this.getRandomIndex();
        const template = this.variants[templateIndex];

        return template.replace(
            /\{(\w+)\}/g,
            (match, key) => {
                if (!(key in data)) {
                    throw new Error(
                        `Variable {${key}} is not defined.`
                    );
                }

                const value = data[key];

                if (typeof value === 'function') {
                    return value(templateIndex);
                }

                return value;
            }
        );
    }

    removeVariant(variant) {
        const index = this.variants.indexOf(variant);

        if (index === -1) {
            throw new Error(
                `Variant "${variant}" not found in template ${this.name}.`
            );
        }

        this.variants.splice(index, 1);
    }

    clear() {
        this.variants = [];
    }
}


class TemplateRegistry {
    templates = {};

    createTemplate(name, variants = []) {
        if (this.templates[name]) {
            throw new Error(
                `Template with name ${name} already exists.`
            );
        }

        this.templates[name] = new Template(
            name,
            variants
        );
    }

    getTemplate(name) {
        if (!this.templates[name]) {
            throw new Error(
                `Template with name ${name} does not exist.`
            );
        }

        return this.templates[name];
    }

    removeTemplate(name) {
        if (!this.templates[name]) {
            throw new Error(
                `Template with name ${name} does not exist.`
            );
        }

        delete this.templates[name];
    }

    render(name, data = {}) {
        return this.getTemplate(name).render(data);
    }

    clear() {
        this.templates = {};
    }

    toJSON() {
        const json = {};

        for (const name in this.templates) {
            json[name] = {
                name: this.templates[name].name,
                variants: this.templates[name].variants
            };
        }

        return json;
    }

    fromJSON(json) {
        this.templates = {};

        for (const name in json) {
            const templateData = json[name];

            this.templates[name] = new Template(
                templateData.name,
                templateData.variants
            );
        }
    }
}