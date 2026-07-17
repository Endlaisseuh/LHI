/******************************************************************************
 * LHI Analyzer
 * ToolManager
 ******************************************************************************/

LHI.ToolManager = class {

    static TOOLS = {
        CURSOR: "cursor",
        PAN: "pan",
        ZOOM: "zoom"
    };

    constructor() {
        this.currentTool = LHI.ToolManager.TOOLS.PAN;
    }

    setTool(tool) {
        this.currentTool = tool;
    }

    getTool() {
        return this.currentTool;
    }

    is(tool) {
        return this.currentTool === tool;
    }

};
