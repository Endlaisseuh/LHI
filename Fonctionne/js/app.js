/******************************************************************************
 * LHI Analyzer
 * Point d'entrée
 ******************************************************************************/

window.onload = function () {

    const app = new LHI.Application();
    app.start();

    // --- Données d'exemple, à remplacer par un vrai chargement de mesures ---
    // Le projet ne contient pour l'instant aucun mécanisme d'import : ceci
    // sert uniquement à avoir une courbe visible pour tester curseurs/mesures.
    const x = [];
    const y = [];

    for (let i = 0; i <= 200; i++) {
        const t = i / 10;
        x.push(Number(t.toFixed(2)));
        y.push(Number((Math.sin(t) * Math.exp(-t / 15)).toFixed(4)));
    }

    app.workspace.graphs[0].setData(x, y);

};
