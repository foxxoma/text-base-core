export class Random {
    static float(min = 0, max = 1) {
        if (min > max) {
            throw new Error(
                'Random float minimum cannot be greater than maximum.'
            );
        }

        return Math.random() * (max - min) + min;
    }

    static int(min, max) {
        if (!Number.isInteger(min) || !Number.isInteger(max)) {
            throw new Error(
                'Random integer bounds must be integers.'
            );
        }

        if (min > max) {
            throw new Error(
                'Random integer minimum cannot be greater than maximum.'
            );
        }

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;
    }

    static chance(probability) {
        if (
            typeof probability !== 'number' ||
            probability < 0 ||
            probability > 1
        ) {
            throw new Error(
                'Probability must be a number between 0 and 1.'
            );
        }

        return Math.random() < probability;
    }

    static percent(percent) {
        if (
            typeof percent !== 'number' ||
            percent < 0 ||
            percent > 100
        ) {
            throw new Error(
                'Percent must be a number between 0 and 100.'
            );
        }

        return this.chance(percent / 100);
    }

    static pick(array) {
        if (!Array.isArray(array)) {
            throw new Error(
                'Random pick expects an array.'
            );
        }

        if (array.length === 0) {
            throw new Error(
                'Cannot pick from an empty array.'
            );
        }

        return array[
            this.int(0, array.length - 1)
        ];
    }

    static weighted(items) {
        if (!Array.isArray(items)) {
            throw new Error(
                'Random weighted expects an array.'
            );
        }

        if (items.length === 0) {
            throw new Error(
                'Cannot pick from an empty collection.'
            );
        }

        let totalWeight = 0;

        for (const item of items) {
            if (!Array.isArray(item) || item.length !== 2) {
                throw new Error(
                    'Each weighted item must be [value, weight].'
                );
            }

            const [, weight] = item;

            if (
                typeof weight !== 'number' ||
                !Number.isFinite(weight) ||
                weight < 0
            ) {
                throw new Error(
                    'Weight must be a finite non-negative number.'
                );
            }

            totalWeight += weight;
        }

        if (totalWeight <= 0) {
            throw new Error(
                'Total weight must be greater than zero.'
            );
        }

        let random = Math.random() * totalWeight;

        for (const [value, weight] of items) {
            random -= weight;

            if (random < 0) {
                return value;
            }
        }

        return items[items.length - 1][0];
    }
}