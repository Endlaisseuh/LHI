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

    setTool(tool) {

        if (this.currentTool === tool) {
            return;
        }

        this.currentTool = tool;

        this.emit();

    }

    getTool() {

        return this.currentTool;

    }

    is(tool) {

        return this.currentTool === tool;

    }

    onChange(callback) {

        this.listeners.push(callback);

    }

    emit() {

        this.listeners.forEach(callback => {

            callback(this.currentTool);

        });

    }

};
