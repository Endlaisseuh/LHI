/******************************************************************************
 * LHI Analyzer
 * PlotManager
 *
 * Gestion de Plotly, des modes d'interaction et de l'affichage des curseurs.
 ******************************************************************************/

LHI.PlotManager = class {

    constructor(element, cursorManager) {
        this.element = element;
        this.cursorManager = cursorManager;

        this.xData = [];
        this.yData = [];

        this.currentTool = LHI.ToolManager.TOOLS.PAN;

        this.onDoubleClickCallback = null;
        this.lastPlotClick = null;
        this.doubleClickDelay = 500;

        this.initialized = false;
        this.ready = null;

        this.layout = {
            paper_bgcolor: "#303030",
            plot_bgcolor: "#202020",

            font: {
                color: "#f5f5f5",
                size: 12
            },

            margin: {
                t: 20,
                r: 20,
                b: 40,
                l: 55
            },

            xaxis: {
                gridcolor: "#444",
                zerolinecolor: "#555"
            },

            yaxis: {
                gridcolor: "#444",
                zerolinecolor: "#555"
            },

            dragmode: "pan",
            shapes: []
        };

        this.config = {
            responsive: true,
            displaylogo: false,
            doubleClick: false,
            scrollZoom: false,

            modeBarButtonsToRemove: [
                "zoom2d",
                "pan2d",
                "select2d",
                "lasso2d",
                "zoomIn2d",
                "zoomOut2d",
                "autoScale2d",
                "resetScale2d"
            ]
        };

        this.cursorManager.onChange(() => {
            this.updateCursorDisplay();
        });
    }

    init() {
        this.ready = Plotly.newPlot(
            this.element,
            [
                this.buildTrace([], [])
            ],
            this.layout,
            this.config
        ).then(() => {
            this.initialized = true;

            this.bindEvents();

            return this.renderData();
        });

        return this.ready;
    }

    bindEvents() {
        this.element.on(
            "plotly_click",
            event => this.handlePlotClick(event)
        );

        this.element.on(
            "plotly_doubleclick",
            () => false
        );
    }

    handlePlotClick(event) {
        if (
            this.currentTool
            !== LHI.ToolManager.TOOLS.CURSOR
        ) {
            this.lastPlotClick = null;
            return;
        }

        if (
            !event.points
            || !event.points.length
            || !this.onDoubleClickCallback
        ) {
            return;
        }

        const pointIndex = event.points[0].pointIndex;
        const now = Date.now();

        if (
            this.lastPlotClick
            && now - this.lastPlotClick.time
                <= this.doubleClickDelay
        ) {
            this.lastPlotClick = null;

            this.onDoubleClickCallback(
                pointIndex
            );

            return;
        }

        this.lastPlotClick = {
            time: now,
            pointIndex
        };
    }

    onPointDoubleClick(callback) {
        this.onDoubleClickCallback =
            typeof callback === "function"
                ? callback
                : null;
    }

    setInteractionMode(tool) {
        if (
            !Object
                .values(LHI.ToolManager.TOOLS)
                .includes(tool)
        ) {
            return;
        }

        this.currentTool = tool;
        this.lastPlotClick = null;

        if (this.initialized) {
            this.applyInteractionMode();
        }
    }

    applyInteractionMode() {
        Plotly.relayout(
            this.element,
            {
                dragmode: this.getDragMode()
            }
        );
    }

    getDragMode() {
        switch (this.currentTool) {
            case LHI.ToolManager.TOOLS.CURSOR:
                return false;

            case LHI.ToolManager.TOOLS.ZOOM:
                return "zoom";

            case LHI.ToolManager.TOOLS.PAN:
            default:
                return "pan";
        }
    }

    setData(x, y) {
        const xData = Array.isArray(x) ? x : [];
        const yData = Array.isArray(y) ? y : [];
        const length = Math.min(
            xData.length,
            yData.length
        );

        this.xData = xData.slice(
            0,
            length
        );

        this.yData = yData.slice(
            0,
            length
        );

        this.cursorManager.setData(
            this.xData,
            this.yData
        );

        if (this.initialized) {
            this.renderData();
        }

        return {
            x: this.xData,
            y: this.yData
        };
    }

    renderData() {
        if (!this.initialized) {
            return Promise.resolve();
        }

        this.layout.shapes = [];

        return Plotly.react(
            this.element,
            [
                this.buildTrace(
                    this.xData,
                    this.yData
                )
            ],
            this.layout,
            this.config
        ).then(() => {
            this.applyInteractionMode();
            this.updateCursorDisplay();
        });
    }

    buildTrace(x, y) {
        return {
            x,
            y,
            type: "scatter",
            mode: "lines",

            line: {
                color: "#4FC3F7",
                width: 1.5
            }
        };
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

                color:
                    cursor.id === "A"
                        ? "#FFD54F"
                        : "#00D7FF"
            }
        };
    }

    updateCursorDisplay() {
        if (!this.initialized) {
            return;
        }

        const shapes = this.cursorManager
            .getAll()
            .map(cursor => {
                return this.createCursorLine(
                    cursor
                );
            });

        Plotly.relayout(
            this.element,
            {
                shapes
            }
        );
    }

};
