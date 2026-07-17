/******************************************************************************
 * LHI Analyzer
 * Application
 ******************************************************************************/

LHI.Application = class {

    constructor() {
        this.root = document.getElementById("app");
        this.workspace = null;
    }

    start() {
        this.build();
    }

    build() {
        this.root.innerHTML = "";

        const header = new LHI.Header();
        const toolbar = new LHI.Toolbar();
        const statusBar = new LHI.StatusBar();

        this.workspace = new LHI.Workspace();
        this.workspace.addGraph(new LHI.GraphView("Graphique 1"));

        this.root.append(header.render(), toolbar.render(), this.workspace.render(), statusBar.render());
    }

};
