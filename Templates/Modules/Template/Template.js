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

    getIndex(selector = null) {
        if (this.variants.length === 0) {
            throw new Error(
                `No variants available for template ${this.name}.`
            );
        }

        const index = selector
            ? selector(this.variants)
            : Math.floor(
                Math.random() * this.variants.length
            );

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= this.variants.length
        ) {
            throw new Error(
                `Invalid template index: ${index}.`
            );
        }

        return index;
    }

    getRandom(selector = null) {
        return this.variants[this.getIndex(selector)];
    }

    render(data = {}, selector = null) {
        const templateIndex = this.getIndex(selector);
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

    toJSON() {
        return {
            name: this.name,
            variants: this.variants
        };
    }

    static fromJSON(data) {
        return new Template(
            data.name,
            data.variants
        );
    }
}