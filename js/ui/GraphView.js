/******************************************************************************
 * LHI Analyzer
 * GraphView
 *
 * Un graphique complet : en-tête, barre d'outils, plot Plotly et panneau
 * de mesures.
 ******************************************************************************/

LHI.GraphView = class {

    constructor(title) {
        this.title =
            title || "Graphique";

        this.toolManager =
            new LHI.ToolManager();

        this.cursorManager =
            new LHI.CursorManager();

        this.measurePanel =
            new LHI.MeasurePanel(
                this.cursorManager,
                this.title
            );

        this.graphToolbar =
            new LHI.GraphToolbar(
                this.toolManager
            );

        this.plotManager = null;

        this.plotElement = null;
        this.footerElement = null;
        this.element = null;
    }

    render() {
        this.element =
            document.createElement(
                "section"
            );

        this.element.className =
            "graph-view";

        const header =
            document.createElement(
                "div"
            );

        header.className =
            "graph-header";

        header.textContent =
            this.title;

        this.plotElement =
            document.createElement(
                "div"
            );

        this.plotElement.className =
            "graph-plot";

        this.footerElement =
            document.createElement(
                "div"
            );

        this.footerElement.className =
            "graph-footer";

        this.footerElement.textContent =
            "Aucune donnée";

        const content =
            document.createElement(
                "div"
            );

        content.className =
            "graph-content";

        content.append(
            this.plotElement,
            this.footerElement,
            this.measurePanel.render()
        );

        this.element.append(
            header,
            this.graphToolbar.render(),
            content
        );

        this.plotManager =
            new LHI.PlotManager(
                this.plotElement,
                this.cursorManager
            );

        this.plotManager
            .onPointDoubleClick(
                index => {
                    this.handlePlotDoubleClick(
                        index
                    );
                }
            );

        this.toolManager.onChange(
            tool => {
                this.onToolChanged(
                    tool
                );
            }
        );

        this.bindEvents();

        this.plotManager.init();

        this.onToolChanged(
            this.toolManager.getTool()
        );

        return this.element;
    }

    onToolChanged(tool) {
        if (!this.plotManager) {
            return;
        }

        this.plotManager
            .setInteractionMode(
                tool
            );

        this.measurePanel
            .setCursorMode(
                tool
                === LHI.ToolManager
                    .TOOLS
                    .CURSOR
            );
    }

    setData(x, y) {
        if (!this.plotManager) {
            return;
        }

        const data =
            this.plotManager.setData(
                x,
                y
            );

        this.measurePanel.clearHistory();

        this.footerElement.textContent =
            data.x.length
                ? (
                    `${data.x.length} points`
                    + ` • X : ${this.formatNumber(data.x[0])}`
                    + ` → ${this.formatNumber(data.x[data.x.length - 1])}`
                )
                : "Aucune donnée";
    }

    handlePlotDoubleClick(index) {
        if (
            !this.toolManager.is(
                LHI.ToolManager
                    .TOOLS
                    .CURSOR
            )
        ) {
            return;
        }

        const cursorA =
            this.cursorManager
                .getCursorA();

        const cursorB =
            this.cursorManager
                .getCursorB();

        if (!cursorA) {
            this.cursorManager.create(
                "A",
                index
            );

            return;
        }

        if (!cursorB) {
            this.cursorManager.create(
                "B",
                index
            );

            return;
        }

        const distanceFromA =
            Math.abs(
                cursorA.index - index
            );

        const distanceFromB =
            Math.abs(
                cursorB.index - index
            );

        const nearestCursor =
            distanceFromA <= distanceFromB
                ? "A"
                : "B";

        this.cursorManager.create(
            nearestCursor,
            index
        );
    }

    bindEvents() {
        this.measurePanel.element
            .querySelectorAll(
                "button[data-action]"
            )
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        if (
                            !this.toolManager.is(
                                LHI.ToolManager
                                    .TOOLS
                                    .CURSOR
                            )
                        ) {
                            return;
                        }

                        const action =
                            button.dataset.action;

                        const cursorId =
                            action.charAt(0);

                        const direction =
                            action.includes(
                                "left"
                            )
                                ? "left"
                                : "right";

                        this.cursorManager.move(
                            cursorId,
                            direction
                        );
                    }
                );
            });
    }

    formatNumber(value) {
        const number =
            Number(value);

        if (!Number.isFinite(number)) {
            return "--";
        }

        return number
            .toFixed(4)
            .replace(
                /\.?0+$/,
                ""
            );
    }

};
