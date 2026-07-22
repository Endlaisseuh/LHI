/******************************************************************************
 * LHI Analyzer
 * Header
 ******************************************************************************/

LHI.Header = class {

    render() {
        const header = document.createElement("header");
        header.className = "app-header";
        header.textContent = LHI.CONFIG.application.name;
        return header;
    }

};
