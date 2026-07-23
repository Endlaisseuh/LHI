/******************************************************************************
 * LHI Analyzer
 * CursorManager
 *
 * Gestion des curseurs de mesure A et B.
 ******************************************************************************/

LHI.CursorManager = class {

    constructor() {
        this.data = {
            x: [],
            y: []
        };

        this.cursors = {
            A: null,
            B: null
        };

        this.callbacks = [];
    }

    setData(x, y) {
        const xData = Array.isArray(x)
            ? x
            : [];

        const yData = Array.isArray(y)
            ? y
            : [];

        const length = Math.min(
            xData.length,
            yData.length
        );

        this.data = {
            x: xData.slice(0, length),
            y: yData.slice(0, length)
        };

        this.reset();
    }

    reset() {
        this.cursors.A = null;
        this.cursors.B = null;

        this.notify();
    }

    isValidIndex(index) {
        return (
            Number.isInteger(index)
            && index >= 0
            && index < this.data.x.length
        );
    }

    buildCursor(id, index) {
        if (
            id !== "A"
            && id !== "B"
        ) {
            return null;
        }

        if (!this.isValidIndex(index)) {
            return null;
        }

        return {
            id,
            index,
            x: this.data.x[index],
            y: this.data.y[index]
        };
    }

    create(id, index) {
        const cursor =
            this.buildCursor(
                id,
                index
            );

        if (!cursor) {
            return null;
        }

        this.cursors[id] = cursor;

        this.notify();

        return this.cursors[id];
    }

    setPositions(cursorAIndex, cursorBIndex) {
        const cursorA =
            this.buildCursor(
                "A",
                cursorAIndex
            );

        const cursorB =
            this.buildCursor(
                "B",
                cursorBIndex
            );

        if (
            !cursorA
            || !cursorB
        ) {
            return false;
        }

        this.cursors.A = cursorA;
        this.cursors.B = cursorB;

        this.notify();

        return true;
    }

    move(id, direction) {
        const cursor = this.cursors[id];

        if (
            !cursor
            || (
                direction !== "left"
                && direction !== "right"
            )
        ) {
            return null;
        }

        if (!this.canMove(id, direction)) {
            return cursor;
        }

        const offset =
            direction === "left"
                ? -1
                : 1;

        const nextIndex =
            cursor.index + offset;

        cursor.index = nextIndex;
        cursor.x = this.data.x[nextIndex];
        cursor.y = this.data.y[nextIndex];

        this.notify();

        return cursor;
    }

    canMove(id, direction) {
        const cursor = this.cursors[id];

        if (!cursor) {
            return false;
        }

        if (direction === "left") {
            return cursor.index > 0;
        }

        if (direction === "right") {
            return (
                cursor.index
                < this.data.x.length - 1
            );
        }

        return false;
    }

    getCursorA() {
        return this.cursors.A;
    }

    getCursorB() {
        return this.cursors.B;
    }

    getAll() {
        return [
            this.cursors.A,
            this.cursors.B
        ].filter(cursor => {
            return cursor !== null;
        });
    }

    getDataLength() {
        return this.data.x.length;
    }

    getRangeStatistics() {
        const cursorA =
            this.getCursorA();

        const cursorB =
            this.getCursorB();

        if (
            !cursorA
            || !cursorB
        ) {
            return null;
        }

        const startIndex = Math.min(
            cursorA.index,
            cursorB.index
        );

        const endIndex = Math.max(
            cursorA.index,
            cursorB.index
        );

        const values = [];

        for (
            let index = startIndex;
            index <= endIndex;
            index++
        ) {
            const value = Number(
                this.data.y[index]
            );

            if (Number.isFinite(value)) {
                values.push(value);
            }
        }

        if (!values.length) {
            return null;
        }

        let minimum = values[0];
        let maximum = values[0];
        let sum = 0;

        values.forEach(value => {
            minimum = Math.min(
                minimum,
                value
            );

            maximum = Math.max(
                maximum,
                value
            );

            sum += value;
        });

        const cursorAX =
            Number(cursorA.x);

        const cursorBX =
            Number(cursorB.x);

        const deltaX =
            Number.isFinite(cursorAX)
            && Number.isFinite(cursorBX)
                ? Math.abs(
                    cursorBX - cursorAX
                )
                : null;

        return {
            startIndex,
            endIndex,
            count: values.length,
            deltaX,
            minimum,
            maximum,
            average: sum / values.length
        };
    }

    onChange(callback) {
        if (
            typeof callback
            !== "function"
        ) {
            return;
        }

        this.callbacks.push(callback);
    }

    notify() {
        const cursors =
            this.getAll();

        this.callbacks.forEach(callback => {
            callback(cursors);
        });
    }

};
