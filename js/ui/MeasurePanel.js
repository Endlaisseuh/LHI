/******************************************************************************
 * LHI Analyzer
 * MeasurePanel
 *
 * Panneau compact et détaillé des mesures du graphique.
 ******************************************************************************/

LHI.MeasurePanel = class {

    constructor(cursorManager, graphTitle) {
        this.cursorManager =
            cursorManager;

        this.graphTitle =
            graphTitle || "Graphique";

        this.element = null;

        this.isExpanded = false;
        this.isCursorMode = false;

        this.measureHistory = [];
        this.nextMeasureId = 1;

        this.cursorManager.onChange(
            () => {
                this.refresh();
            }
        );
    }

    render() {
        this.element =
            document.createElement(
                "section"
            );

        this.element.className =
            "measure-panel";

        this.element.innerHTML = `
            <button
                type="button"
                class="measure-toggle"
                data-role="measure-toggle"
                aria-expanded="false"
            >
                <span class="measure-toggle-content">
                    <span
                        class="measure-curve-name"
                        data-role="curve-name"
                    ></span>

                    <span class="measure-summary">
                        <span class="measure-summary-item">
                            <span class="measure-summary-label">
                                A
                            </span>

                            <span data-role="summary-A">
                                --
                            </span>
                        </span>

                        <span class="measure-summary-item">
                            <span class="measure-summary-label">
                                B
                            </span>

                            <span data-role="summary-B">
                                --
                            </span>
                        </span>

                        <span class="measure-summary-item">
                            <span class="measure-summary-label">
                                ΔX
                            </span>

                            <span data-role="summary-delta">
                                --
                            </span>
                        </span>
                    </span>
                </span>

                <span
                    class="measure-chevron"
                    data-role="measure-chevron"
                    aria-hidden="true"
                >
                    ▼
                </span>
            </button>

            <div
                class="measure-details"
                data-role="measure-details"
            >
                <div class="measure-section">
                    <div class="measure-section-title">
                        Curseurs
                    </div>

                    <div class="measure-row">
                        <span class="cursor-name cursor-a">
                            Curseur A
                        </span>

                        <div class="cursor-controls">
                            <button
                                type="button"
                                class="cursor-button"
                                data-action="A-left"
                                aria-label="Déplacer le curseur A vers la gauche"
                                hidden
                            >
                                ◀
                            </button>

                            <span
                                class="cursor-value"
                                data-role="cursor-A-value"
                            >
                                --
                            </span>

                            <button
                                type="button"
                                class="cursor-button"
                                data-action="A-right"
                                aria-label="Déplacer le curseur A vers la droite"
                                hidden
                            >
                                ▶
                            </button>
                        </div>
                    </div>

                    <div class="measure-row">
                        <span class="cursor-name cursor-b">
                            Curseur B
                        </span>

                        <div class="cursor-controls">
                            <button
                                type="button"
                                class="cursor-button"
                                data-action="B-left"
                                aria-label="Déplacer le curseur B vers la gauche"
                                hidden
                            >
                                ◀
                            </button>

                            <span
                                class="cursor-value"
                                data-role="cursor-B-value"
                            >
                                --
                            </span>

                            <button
                                type="button"
                                class="cursor-button"
                                data-action="B-right"
                                aria-label="Déplacer le curseur B vers la droite"
                                hidden
                            >
                                ▶
                            </button>
                        </div>
                    </div>
                </div>

                <div class="measure-separator"></div>

                <div class="measure-section">
                    <div class="measure-section-title">
                        Statistiques entre A et B
                    </div>

                    <div class="measure-stat-grid">
                        <div class="measure-stat">
                            <span class="measure-stat-label">
                                ΔX
                            </span>

                            <span
                                class="measure-stat-value"
                                data-role="measure-delta"
                            >
                                --
                            </span>
                        </div>

                        <div class="measure-stat">
                            <span class="measure-stat-label">
                                Min
                            </span>

                            <span
                                class="measure-stat-value"
                                data-role="measure-minimum"
                            >
                                --
                            </span>
                        </div>

                        <div class="measure-stat">
                            <span class="measure-stat-label">
                                Max
                            </span>

                            <span
                                class="measure-stat-value"
                                data-role="measure-maximum"
                            >
                                --
                            </span>
                        </div>

                        <div class="measure-stat">
                            <span class="measure-stat-label">
                                Moyenne
                            </span>

                            <span
                                class="measure-stat-value"
                                data-role="measure-average"
                            >
                                --
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    class="measure-add-button"
                    data-role="measure-add"
                    disabled
                >
                    Figer la mesure
                </button>

                <div
                    class="measure-history"
                    data-role="measure-history"
                    hidden
                >
                    <div class="measure-history-title">
                        Mesures figées
                    </div>

                    <div
                        class="measure-history-container"
                        data-role="measure-history-container"
                    ></div>
                </div>
            </div>
        `;

        this.element
            .querySelector(
                "[data-role='curve-name']"
            )
            .textContent =
                this.graphTitle;

        this.bindEvents();

        this.refreshExpandedState();
        this.setCursorMode(false);
        this.refresh();
        this.refreshHistory();

        return this.element;
    }

    bindEvents() {
        const toggleButton =
            this.element.querySelector(
                "[data-role='measure-toggle']"
            );

        const addButton =
            this.element.querySelector(
                "[data-role='measure-add']"
            );

        const historyContainer =
            this.element.querySelector(
                "[data-role='measure-history-container']"
            );

        toggleButton.addEventListener(
            "click",
            () => {
                this.toggleExpanded();
            }
        );

        addButton.addEventListener(
            "click",
            () => {
                this.saveMeasure();
            }
        );

        historyContainer.addEventListener(
            "click",
            event => {
                const button =
                    event.target.closest(
                        "button[data-history-action]"
                    );

                if (!button) {
                    return;
                }

                const measureId =
                    Number(
                        button.dataset.measureId
                    );

                const action =
                    button.dataset.historyAction;

                if (
                    !Number.isInteger(
                        measureId
                    )
                ) {
                    return;
                }

                if (action === "restore") {
                    this.restoreMeasure(
                        measureId
                    );
                }

                if (action === "overwrite") {
                    this.overwriteMeasure(
                        measureId
                    );
                }
            }
        );
    }

    toggleExpanded() {
        this.isExpanded =
            !this.isExpanded;

        this.refreshExpandedState();
    }

    setExpanded(expanded) {
        this.isExpanded =
            Boolean(expanded);

        this.refreshExpandedState();
    }

    refreshExpandedState() {
        if (!this.element) {
            return;
        }

        const toggleButton =
            this.element.querySelector(
                "[data-role='measure-toggle']"
            );

        const chevron =
            this.element.querySelector(
                "[data-role='measure-chevron']"
            );

        this.element.classList.toggle(
            "is-expanded",
            this.isExpanded
        );

        toggleButton.setAttribute(
            "aria-expanded",
            String(this.isExpanded)
        );

        chevron.textContent =
            this.isExpanded
                ? "▲"
                : "▼";
    }

    setCursorMode(active) {
        this.isCursorMode =
            Boolean(active);

        if (!this.element) {
            return;
        }

        this.element.classList.toggle(
            "is-cursor-mode",
            this.isCursorMode
        );

        this.element
            .querySelectorAll(
                ".cursor-button"
            )
            .forEach(button => {
                button.hidden =
                    !this.isCursorMode;
            });

        this.refreshMovementControls();
    }

    refresh() {
        if (!this.element) {
            return;
        }

        const cursorA =
            this.cursorManager
                .getCursorA();

        const cursorB =
            this.cursorManager
                .getCursorB();

        const statistics =
            this.cursorManager
                .getRangeStatistics();

        this.setText(
            "cursor-A-value",
            this.formatCursor(
                cursorA
            )
        );

        this.setText(
            "cursor-B-value",
            this.formatCursor(
                cursorB
            )
        );

        this.setText(
            "summary-A",
            cursorA
                ? this.formatNumber(
                    cursorA.x
                )
                : "--"
        );

        this.setText(
            "summary-B",
            cursorB
                ? this.formatNumber(
                    cursorB.x
                )
                : "--"
        );

        this.setText(
            "summary-delta",
            statistics
                ? this.formatNumber(
                    statistics.deltaX
                )
                : "--"
        );

        this.setText(
            "measure-delta",
            statistics
                ? this.formatNumber(
                    statistics.deltaX
                )
                : "--"
        );

        this.setText(
            "measure-minimum",
            statistics
                ? this.formatNumber(
                    statistics.minimum
                )
                : "--"
        );

        this.setText(
            "measure-maximum",
            statistics
                ? this.formatNumber(
                    statistics.maximum
                )
                : "--"
        );

        this.setText(
            "measure-average",
            statistics
                ? this.formatNumber(
                    statistics.average
                )
                : "--"
        );

        const addButton =
            this.element.querySelector(
                "[data-role='measure-add']"
            );

        addButton.disabled =
            !cursorA
            || !cursorB
            || !statistics;

        this.refreshMovementControls();
        this.refreshHistoryActions();
    }

    refreshMovementControls() {
        if (!this.element) {
            return;
        }

        this.element
            .querySelectorAll(
                ".cursor-button"
            )
            .forEach(button => {
                const action =
                    button.dataset.action;

                const cursorId =
                    action.charAt(0);

                const direction =
                    action.includes("left")
                        ? "left"
                        : "right";

                button.hidden =
                    !this.isCursorMode;

                button.disabled =
                    !this.isCursorMode
                    || !this.cursorManager
                        .canMove(
                            cursorId,
                            direction
                        );
            });
    }

    createCurrentMeasure() {
        const cursorA =
            this.cursorManager
                .getCursorA();

        const cursorB =
            this.cursorManager
                .getCursorB();

        const statistics =
            this.cursorManager
                .getRangeStatistics();

        if (
            !cursorA
            || !cursorB
            || !statistics
        ) {
            return null;
        }

        return {
            graphTitle:
                this.graphTitle,

            cursorA: {
                index:
                    cursorA.index,

                x:
                    cursorA.x,

                y:
                    cursorA.y
            },

            cursorB: {
                index:
                    cursorB.index,

                x:
                    cursorB.x,

                y:
                    cursorB.y
            },

            statistics: {
                startIndex:
                    statistics.startIndex,

                endIndex:
                    statistics.endIndex,

                count:
                    statistics.count,

                deltaX:
                    statistics.deltaX,

                minimum:
                    statistics.minimum,

                maximum:
                    statistics.maximum,

                average:
                    statistics.average
            }
        };
    }

    saveMeasure() {
        const measure =
            this.createCurrentMeasure();

        if (!measure) {
            return;
        }

        measure.id =
            this.nextMeasureId;

        this.nextMeasureId++;

        this.measureHistory.push(
            measure
        );

        this.refreshHistory();
    }

    clearHistory() {
        this.measureHistory = [];
        this.nextMeasureId = 1;

        if (this.element) {
            this.refreshHistory();
        }
    }

    findMeasure(measureId) {
        return (
            this.measureHistory.find(
                measure => {
                    return (
                        measure.id
                        === measureId
                    );
                }
            )
            || null
        );
    }

    restoreMeasure(measureId) {
        const measure =
            this.findMeasure(
                measureId
            );

        if (!measure) {
            return;
        }

        const restored =
            this.cursorManager
                .setPositions(
                    measure.cursorA.index,
                    measure.cursorB.index
                );

        if (!restored) {
            return;
        }

        this.setExpanded(true);
    }

    overwriteMeasure(measureId) {
        const currentMeasure =
            this.createCurrentMeasure();

        if (!currentMeasure) {
            return;
        }

        const measureIndex =
            this.measureHistory
                .findIndex(
                    measure => {
                        return (
                            measure.id
                            === measureId
                        );
                    }
                );

        if (measureIndex === -1) {
            return;
        }

        currentMeasure.id =
            measureId;

        this.measureHistory[
            measureIndex
        ] = currentMeasure;

        this.refreshHistory();
    }

    canRestoreMeasure(measure) {
        if (!measure) {
            return false;
        }

        return (
            this.cursorManager
                .isValidIndex(
                    measure.cursorA.index
                )
            && this.cursorManager
                .isValidIndex(
                    measure.cursorB.index
                )
        );
    }

    refreshHistory() {
        if (!this.element) {
            return;
        }

        const history =
            this.element.querySelector(
                "[data-role='measure-history']"
            );

        const container =
            this.element.querySelector(
                "[data-role='measure-history-container']"
            );

        container.innerHTML = "";

        history.hidden =
            this.measureHistory.length
            === 0;

        this.measureHistory.forEach(
            (measure, index) => {
                const item =
                    this.createHistoryItem(
                        measure,
                        index
                    );

                container.appendChild(
                    item
                );
            }
        );

        this.refreshHistoryActions();
    }

    createHistoryItem(measure, index) {
        const item =
            document.createElement(
                "article"
            );

        item.className =
            "measure-history-item";

        item.dataset.measureId =
            String(measure.id);

        item.innerHTML = `
            <div class="measure-history-header">
                <div>
                    <div class="measure-history-name">
                        Mesure ${index + 1}
                    </div>

                    <div class="measure-history-curve"></div>
                </div>

                <div class="measure-history-actions">
                    <button
                        type="button"
                        class="measure-history-button"
                        data-history-action="restore"
                        data-measure-id="${measure.id}"
                    >
                        Replacer
                    </button>

                    <button
                        type="button"
                        class="measure-history-button"
                        data-history-action="overwrite"
                        data-measure-id="${measure.id}"
                    >
                        Écraser
                    </button>
                </div>
            </div>

            <div class="measure-history-cursors">
                <div class="measure-history-cursor">
                    <span class="measure-history-label cursor-a">
                        A
                    </span>

                    <span>
                        X : ${this.formatNumber(measure.cursorA.x)}
                        • Y : ${this.formatNumber(measure.cursorA.y)}
                    </span>
                </div>

                <div class="measure-history-cursor">
                    <span class="measure-history-label cursor-b">
                        B
                    </span>

                    <span>
                        X : ${this.formatNumber(measure.cursorB.x)}
                        • Y : ${this.formatNumber(measure.cursorB.y)}
                    </span>
                </div>
            </div>

            <div class="measure-history-statistics">
                <div class="measure-history-stat">
                    <span>ΔX</span>

                    <strong>
                        ${this.formatNumber(measure.statistics.deltaX)}
                    </strong>
                </div>

                <div class="measure-history-stat">
                    <span>Min</span>

                    <strong>
                        ${this.formatNumber(measure.statistics.minimum)}
                    </strong>
                </div>

                <div class="measure-history-stat">
                    <span>Max</span>

                    <strong>
                        ${this.formatNumber(measure.statistics.maximum)}
                    </strong>
                </div>

                <div class="measure-history-stat">
                    <span>Moyenne</span>

                    <strong>
                        ${this.formatNumber(measure.statistics.average)}
                    </strong>
                </div>
            </div>
        `;

        item
            .querySelector(
                ".measure-history-curve"
            )
            .textContent =
                measure.graphTitle;

        return item;
    }

    refreshHistoryActions() {
        if (!this.element) {
            return;
        }

        const currentMeasure =
            this.createCurrentMeasure();

        this.measureHistory.forEach(
            measure => {
                const restoreButton =
                    this.element.querySelector(
                        `button[data-history-action='restore'][data-measure-id='${measure.id}']`
                    );

                const overwriteButton =
                    this.element.querySelector(
                        `button[data-history-action='overwrite'][data-measure-id='${measure.id}']`
                    );

                if (restoreButton) {
                    restoreButton.disabled =
                        !this.canRestoreMeasure(
                            measure
                        );
                }

                if (overwriteButton) {
                    overwriteButton.disabled =
                        !currentMeasure;
                }
            }
        );
    }

    setText(role, value) {
        const element =
            this.element.querySelector(
                `[data-role='${role}']`
            );

        if (element) {
            element.textContent =
                value;
        }
    }

    formatCursor(cursor) {
        if (!cursor) {
            return "--";
        }

        return (
            `X : ${this.formatNumber(cursor.x)}`
            + ` • Y : ${this.formatNumber(cursor.y)}`
        );
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
