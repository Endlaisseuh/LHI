/******************************************************************************
 * LHI Analyzer
 * MeasurePanel
 *
 * Affichage des curseurs A/B, du delta courant et de l'historique des mesures.
 ******************************************************************************/

LHI.MeasurePanel = class {

    constructor(cursorManager) {
        this.cursorManager = cursorManager;
        this.element = null;
        this.measureHistory = [];

        this.cursorManager.onChange(() => this.refresh());
    }

    render() {
        this.element = document.createElement("section");
        this.element.className = "measure-panel";

        this.element.innerHTML = `
            <div class="measure-current">
                <div class="measure-title">Mesures</div>

                <div class="measure-row">
                    <span class="cursor-name cursor-a">Curseur A</span>
                    <button class="cursor-button" data-action="A-left">◀</button>
                    <span class="cursor-value" id="cursor-A-value">--</span>
                    <button class="cursor-button" data-action="A-right">▶</button>
                </div>

                <div class="measure-row">
                    <span class="cursor-name cursor-b">Curseur B</span>
                    <button class="cursor-button" data-action="B-left">◀</button>
                    <span class="cursor-value" id="cursor-B-value">--</span>
                    <button class="cursor-button" data-action="B-right">▶</button>
                </div>

                <div class="measure-separator"></div>

                <div class="measure-stat">
                    <span>ΔX</span>
                    <span id="measure-delta">--</span>
                </div>

                <button class="measure-add-button" id="measure-add">Ajouter la mesure</button>
            </div>

            <div class="measure-history">
                <div class="measure-history-title">Historique</div>
                <div id="measure-history-container"></div>
            </div>
        `;

        this.bindEvents();

        return this.element;
    }

    bindEvents() {
        this.element.querySelector("#measure-add").addEventListener("click", () => this.saveMeasure());
    }

    saveMeasure() {
        const A = this.cursorManager.getCursorA();
        const B = this.cursorManager.getCursorB();
        if (!A || !B) return;

        this.measureHistory.push({
            cursorA: { x: A.x, y: A.y },
            cursorB: { x: B.x, y: B.y },
            deltaX: Math.abs(B.x - A.x)
        });

        this.refreshHistory();
    }

    refresh() {
        const A = this.cursorManager.getCursorA();
        const B = this.cursorManager.getCursorB();

        this.element.querySelector("#cursor-A-value").textContent = A ? `X:${A.x} Y:${A.y}` : "--";
        this.element.querySelector("#cursor-B-value").textContent = B ? `X:${B.x} Y:${B.y}` : "--";
        this.element.querySelector("#measure-delta").textContent = (A && B) ? Math.abs(B.x - A.x).toFixed(3) : "--";
    }

    refreshHistory() {
        const container = this.element.querySelector("#measure-history-container");
        container.innerHTML = "";

        this.measureHistory.forEach((measure, index) => {
            const line = document.createElement("div");
            line.textContent = `Mesure ${index + 1} — A:${measure.cursorA.x} B:${measure.cursorB.x} ΔX:${measure.deltaX.toFixed(3)}`;
            container.appendChild(line);
        });
    }

};
