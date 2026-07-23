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
        this.listeners = [];
    }

    isValidTool(tool) {
        return Object.values(LHI.ToolManager.TOOLS).includes(tool);
    }

    setTool(tool) {
        if (!this.isValidTool(tool) || this.currentTool === tool) {
            return false;
        }

        this.currentTool = tool;
        this.emit();

        return true;
    }

    getTool() {
        return this.currentTool;
    }

    is(tool) {
        return this.currentTool === tool;
    }

    onChange(callback) {
        if (typeof callback !== "function") {
            return;
        }

        this.listeners.push(callback);
    }

    emit() {
        this.listeners.forEach(callback => {
            callback(this.currentTool);
        });
    }

};
