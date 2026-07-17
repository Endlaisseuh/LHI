/******************************************************************************
 * LHI Analyzer
 * PlotManager
 *
 * Gestion de Plotly et de l'affichage des curseurs de mesure.
 ******************************************************************************/

LHI.PlotManager = class {

    constructor(element, cursorManager) {
        this.element = element;
        this.cursorManager = cursorManager;

        this.xData = [];
        this.yData = [];
        this.onClickCallback = null;

        this.layout = {
            paper_bgcolor: "#303030",
            plot_bgcolor: "#202020",
            font: { color: "#f5f5f5", size: 12 },
            margin: { t: 20, r: 20, b: 40, l: 55 },
            xaxis: { gridcolor: "#444", zerolinecolor: "#555" },
            yaxis: { gridcolor: "#444", zerolinecolor: "#555" },
            shapes: []
        };

        this.cursorManager.onChange(() => this.updateCursorDisplay());
    }

    init() {
        Plotly.newPlot(
            this.element,
            [this.buildTrace([], [])],
            this.layout,
            { responsive: true, displaylogo: false }
        );

        this.element.on("plotly_click", event => {
            if (!event.points || !event.points.length || !this.onClickCallback) return;
            this.onClickCallback(event.points[0].pointIndex);
        });
    }

    onPointClick(callback) {
        this.onClickCallback = callback;
    }

    setData(x, y) {
        this.xData = x;
        this.yData = y;
        this.cursorManager.setData(x, y);

        Plotly.react(this.element, [this.buildTrace(x, y)], this.layout);
        this.updateCursorDisplay();
    }

    buildTrace(x, y) {
        return { x, y, type: "scatter", mode: "lines", line: { color: "#4FC3F7", width: 1.5 } };
    }

    createCursorLine(cursor) {
        return {
            type: "line",
            x0: cursor.x,
            x1: cursor.x,
            y0: 0,
            y1: 1,
            xref: "x",
            yref: "paper",
            line: {
                width: 2,
                dash: "dot",
                color: cursor.id === "A" ? "#FFD54F" : "#00D7FF"
            }
        };
    }

    updateCursorDisplay() {
        const shapes = this.cursorManager.getAll().map(cursor => this.createCursorLine(cursor));
        Plotly.relayout(this.element, { shapes });
    }

};
