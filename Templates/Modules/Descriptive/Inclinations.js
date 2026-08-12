class Declensions {
    declensions = {};

    createDeclension(name, declensionTypes) {
        if (this.declensions[name]) {
            throw new Error(`Declension with name ${name} already exists.`);
        }

        this.declensions[name] = new Declension(name, declensionTypes);
    }

    getDeclension(name) {
        if (!this.declensions[name]) {
            throw new Error(`Declension with name ${name} does not exist.`);
        }

        return this.declensions[name];
    }

    removeDeclension(name) {
        if (!this.declensions[name]) {
            throw new Error(`Declension with name ${name} does not exist.`);
        }

        delete this.declensions[name];
    }

    toJSON() {
        const json = {};
        for (const name in this.declensions) {
            json[name] = {
                name: this.declensions[name].name,
                declensionTypes: this.declensions[name].declensionTypes,
                data: this.declensions[name].data
            };
        }

        return json;
    }

    fromJSON(json) {
        for (const name in json) {
            const declensionData = json[name];
            const declension = new Declension(declensionData.name, declensionData.declensionTypes);
            declension.data = declensionData.data;
            this.declensions[name] = declension;
        }
    }
}

class Declension {
    name = '';
    declensionTypes = [];
    data = {};

    constructor(name, declensionTypes) {
        this.name = name;
        this.declensionTypes = declensionTypes;
    }

    addSynonyms(type, synonyms) {
        if (!this.declensionTypes.includes(type)) {
            throw new Error(`Declension type ${type} is not valid for this case.`);
        }

        if (!this.data[type]) {
            this.data[type] = [];
        }

        this.data[type].push(...synonyms);
    }

    getSynonyms(type) {
        if (!this.declensionTypes.includes(type)) {
            throw new Error(`Declension type ${type} is not valid for this case.`);
        }

        return this.data[type] || [];
    }

    getRandom(type) {
        const synonyms = this.getSynonyms(type);
        if (synonyms.length === 0) {
            throw new Error(`No synonyms available for type ${type}.`);
        }

        const randomIndex = Math.floor(Math.random() * synonyms.length);
        return synonyms[randomIndex];
    }

    removeSynonyms(type, synonym) {
        if (!this.declensionTypes.includes(type)) {
            throw new Error(`Declension type ${type} is not valid for this case.`);
        }

        const index = this.data[type]?.indexOf(synonym);
        if (index === -1 || index === undefined) {
            throw new Error(`Synonym ${synonym} not found for type ${type}.`);
        }

        this.data[type].splice(index, 1);
    }

    removeAllSynonyms(type) {
        if (!this.declensionTypes.includes(type)) {
            throw new Error(`Declension type ${type} is not valid for this case.`);
        }

        this.data[type] = [];
    }

    clear() {
        this.data = {};
    }
} 