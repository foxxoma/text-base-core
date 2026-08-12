class Declension {
    name = '';
    types = [];
    variants = {};

    constructor(name, types) {
        this.name = name;
        this.types = types;
    }

    addVariants(type, variants) {
        this.validateType(type);

        if (!this.variants[type]) {
            this.variants[type] = [];
        }

        this.variants[type] = [
            ...new Set([
                ...this.variants[type],
                ...variants
            ])
        ];
    }

    getVariants(type) {
        this.validateType(type);

        return this.variants[type] || [];
    }

    render(type) {
        const variants = this.getVariants(type);

        if (variants.length === 0) {
            throw new Error(`No variants available for type ${type}.`);
        }

        return variants[Math.floor(Math.random() * variants.length)];
    }

    removeVariant(type, variant) {
        this.validateType(type);

        const variants = this.variants[type];

        if (!variants?.includes(variant)) {
            throw new Error(
                `Variant ${variant} not found for type ${type}.`
            );
        }

        this.variants[type] = variants.filter(
            item => item !== variant
        );
    }

    removeAllVariants(type) {
        this.validateType(type);

        this.variants[type] = [];
    }

    clear() {
        this.variants = {};
    }

    validateType(type) {
        if (!this.types.includes(type)) {
            throw new Error(
                `Declension type ${type} is not valid.`
            );
        }
    }
}

class DeclensionRegistry {
    declensions = {};

    createDeclension(name, types) {
        if (this.declensions[name]) {
            throw new Error(
                `Declension with name ${name} already exists.`
            );
        }

        this.declensions[name] = new Declension(name, types);
    }

    getDeclension(name) {
        if (!this.declensions[name]) {
            throw new Error(
                `Declension with name ${name} does not exist.`
            );
        }

        return this.declensions[name];
    }

    removeDeclension(name) {
        if (!this.declensions[name]) {
            throw new Error(
                `Declension with name ${name} does not exist.`
            );
        }

        delete this.declensions[name];
    }

    render(name, type) {
        return this.getDeclension(name).render(type);
    }

    toJSON() {
        const json = {};
        for (const [name, declension] of Object.entries(this.declensions)) {
            json[name] = {
                types: declension.types,
                variants: declension.variants
            };
        }
        return json;
    }

    fromJSON(json) {
        for (const [name, data] of Object.entries(json)) {
            const declension = new Declension(name, data.types);
            declension.variants = data.variants;
            this.declensions[name] = declension;
        }
    }
}