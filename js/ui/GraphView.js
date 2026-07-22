/******************************************************************************
 * LHI Analyzer
 * GraphView
 *
 * Un graphique complet : en-tête, barre d'outils, plot Plotly et panneau
 * de mesures.
 ******************************************************************************/

LHI.GraphView = class {

    constructor(title) {
        this.title = title;

        this.toolManager = new LHI.ToolManager();
        this.cursorManager = new LHI.CursorManager();
        this.measurePanel = new LHI.MeasurePanel(this.cursorManager);
        this.graphToolbar = new LHI.GraphToolbar(this.toolManager);
        this.plotManager = null;

        this.plotElement = null;
        this.footerElement = null;
        this.element = null;
    }

    render() {
        this.element = document.createElement("section");
        this.element.className = "graph-view";

        const header = document.createElement("div");
        header.className = "graph-header";
        header.textContent = this.title;

        this.plotElement = document.createElement("div");
        this.plotElement.className = "graph-plot";

        this.footerElement = document.createElement("div");
        this.footerElement.className = "graph-footer";
        this.footerElement.textContent = "Aucune donnée";

        const content = document.createElement("div");
        content.className = "graph-content";
        content.append(this.plotElement, this.footerElement, this.measurePanel.render());

        this.element.append(header, this.graphToolbar.render(), content);

        this.plotManager = new LHI.PlotManager(this.plotElement, this.cursorManager);
        this.plotManager.onPointClick(index => this.handlePlotClick(index));
        this.plotManager.init();

        this.bindEvents();

        return this.element;
    }

    // Charge les données à tracer. x et y doivent être deux tableaux de même longueur.
    setData(x, y) {
        this.plotManager.setData(x, y);

        this.footerElement.textContent = x.length
            ? `${x.length} points • X: ${x[0].toFixed(2)} → ${x[x.length - 1].toFixed(2)}`
            : "Aucune donnée";
    }

    // Clic sur le graphe en mode "Curseur" : place A, puis B, puis déplace
    // le curseur le plus proche du point cliqué.
    handlePlotClick(index) {
        if (!this.toolManager.is(LHI.ToolManager.TOOLS.CURSOR)) return;

        const a = this.cursorManager.getCursorA();
        const b = this.cursorManager.getCursorB();

        if (!a) {
            this.cursorManager.create("A", index);
        } else if (!b) {
            this.cursorManager.create("B", index);
        } else {
            const nearest = Math.abs(a.index - index) <= Math.abs(b.index - index) ? "A" : "B";
            this.cursorManager.create(nearest, index);
        }
    }

    bindEvents() {
        this.measurePanel.element.querySelectorAll("button[data-action]").forEach(button => {
            button.addEventListener("click", () => {
                const action = button.dataset.action;
                const cursorId = action.charAt(0);
                const direction = action.includes("left") ? "left" : "right";
                this.cursorManager.move(cursorId, direction);
            });
        });
    }

};
