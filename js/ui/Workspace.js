/******************************************************************************
 * LHI Analyzer
 * Workspace
 ******************************************************************************/

LHI.Workspace = class {

    constructor() {
        this.graphs = [];
    }

    addGraph(graph) {
        this.graphs.push(graph);
    }

    render() {
        const workspace = document.createElement("main");
        workspace.className = "workspace";

        this.graphs.forEach(graph => {
            workspace.appendChild(graph.render());
        });

        return workspace;
    }

};
