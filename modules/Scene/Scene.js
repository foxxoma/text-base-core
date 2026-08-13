class Scene {
    constructor(main) {
        if (typeof main !== 'function') {
            throw new Error(
                'Scene main must be a function.'
            );
        }

        this.main = main;
    }

    run(data, context) {
        return this.main(data, context);
    }
}