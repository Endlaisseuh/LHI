/******************************************************************************
 * LHI Analyzer
 * CursorManager
 *
 * Gestion des curseurs de mesure A et B.
 ******************************************************************************/

LHI.CursorManager = class {

    constructor() {
        this.data = { x: [], y: [] };
        this.cursors = { A: null, B: null };
        this.callbacks = [];
    }

    setData(x, y) {
        this.data.x = x || [];
        this.data.y = y || [];
    }

    create(id, index) {
        if (id !== "A" && id !== "B") return null;
        if (index < 0 || index >= this.data.x.length) return null;

        this.cursors[id] = { id, index, x: this.data.x[index], y: this.data.y[index] };
        this.notify();

        return this.cursors[id];
    }

    move(id, direction) {
        const cursor = this.cursors[id];
        if (!cursor) return;

        let index = cursor.index;
        if (direction === "left") index--;
        if (direction === "right") index++;
        index = Math.max(0, Math.min(index, this.data.x.length - 1));

        cursor.index = index;
        cursor.x = this.data.x[index];
        cursor.y = this.data.y[index];

        this.notify();
    }

    getCursorA() {
        return this.cursors.A;
    }

    getCursorB() {
        return this.cursors.B;
    }

    getAll() {
        return [this.cursors.A, this.cursors.B].filter(cursor => cursor !== null);
    }

    onChange(callback) {
        this.callbacks.push(callback);
    }

    notify() {
        this.callbacks.forEach(callback => callback(this.getAll()));
    }

};
