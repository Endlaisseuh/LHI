/******************************************************************************
 * LHI Analyzer
 * StatusBar
 ******************************************************************************/

LHI.StatusBar = class {

    render() {
        const status = document.createElement("footer");
        status.className = "status-bar";
        status.textContent = "Ready";
        return status;
    }

};
