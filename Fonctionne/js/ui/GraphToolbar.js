/******************************************************************************
 * LHI Analyzer
 * GraphToolbar
 ******************************************************************************/

LHI.GraphToolbar = class {

    constructor(toolManager) {
        this.toolManager = toolManager;
        this.element = null;
    }

    render() {
        this.element = document.createElement("div");
        this.element.className = "graph-toolbar";

        this.element.appendChild(this.createButton("Curseur", LHI.ToolManager.TOOLS.CURSOR));
        this.element.appendChild(this.createButton("Déplacer", LHI.ToolManager.TOOLS.PAN));
        this.element.appendChild(this.createButton("Zoom", LHI.ToolManager.TOOLS.ZOOM));

        this.refresh();

        return this.element;
    }

    createButton(label, tool) {
        const button = document.createElement("button");
        button.className = "graph-tool-button";
        button.textContent = label;
        button.dataset.tool = tool;

        button.addEventListener("click", () => {
            this.toolManager.setTool(tool);
            this.refresh();
        });

        return button;
    }

    refresh() {
        const buttons = this.element.querySelectorAll(".graph-tool-button");

        buttons.forEach(button => {
            button.classList.toggle("active", button.dataset.tool === this.toolManager.getTool());
        });
    }

};
