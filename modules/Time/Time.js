class Time {
    date = null;

    constructor(date = new Date()) {
        this.date = new Date(date);
    }

    // ─────────────────────────────────────────────
    // Current values
    // ─────────────────────────────────────────────

    get minutes() {
        return this.date.getMinutes();
    }

    get hours() {
        return this.date.getHours();
    }

    get day() {
        return this.date.getDate();
    }

    get dayOfWeek() {
        return this.date.getDay();
    }

    get month() {
        return this.date.getMonth() + 1;
    }

    get year() {
        return this.date.getFullYear();
    }

    get timestamp() {
        return this.date.getTime();
    }

    get() {
        return {
            minutes: this.minutes,
            hours: this.hours,
            day: this.day,
            dayOfWeek: this.dayOfWeek,
            month: this.month,
            year: this.year
        };
    }

    // ─────────────────────────────────────────────
    // Set time
    // ─────────────────────────────────────────────

    set({
        minutes,
        hours,
        day,
        month,
        year
    } = {}) {
        if (minutes !== undefined) {
            this.date.setMinutes(minutes);
        }

        if (hours !== undefined) {
            this.date.setHours(hours);
        }

        if (day !== undefined) {
            this.date.setDate(day);
        }

        if (month !== undefined) {
            this.date.setMonth(month - 1);
        }

        if (year !== undefined) {
            this.date.setFullYear(year);
        }

        return this;
    }

    // ─────────────────────────────────────────────
    // Skip time
    // ─────────────────────────────────────────────

    skip({
        minutes = 0,
        hours = 0,
        days = 0,
        weeks = 0,
        months = 0,
        years = 0
    } = {}) {
        this.date.setMinutes(
            this.date.getMinutes() + minutes
        );

        this.date.setHours(
            this.date.getHours() + hours
        );

        this.date.setDate(
            this.date.getDate() + days + weeks * 7
        );

        this.date.setMonth(
            this.date.getMonth() + months
        );

        this.date.setFullYear(
            this.date.getFullYear() + years
        );

        return this;
    }

    // ─────────────────────────────────────────────
    // Reset
    // ─────────────────────────────────────────────

    reset(date = new Date()) {
        this.date = new Date(date);

        return this;
    }

    // ─────────────────────────────────────────────
    // Date
    // ─────────────────────────────────────────────

    getDate() {
        return new Date(this.date);
    }

    // ─────────────────────────────────────────────
    // JSON
    // ─────────────────────────────────────────────

    toJSON() {
        return this.date.toISOString();
    }

    static fromJSON(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            throw new Error(
                `Invalid date: ${value}`
            );
        }

        return new Time(date);
    }
}