/**
 * Created by thiron on 03/07/2015.
 */
var Canvas = (function () {
    /**
     * Le constructeur
     * @param canvas
     */
    function Canvas(canvas) {
        this.element = canvas;
    }
    /**
     * Initialisation
     */
    Canvas.prototype.init = function () {
        /* Erreur */
        if (!this.element || !this.element.getContext)
            throw new Error("Le canvas n'est pas pris en charge par votre navigateur");
        /* Initialisation du context */
        this.context = this.element.getContext("2d");
        /* Erreur */
        if (!this.context)
            throw new Error("Le canvas n'est pas pris en charge par votre navigateur");
        /* Retour de l'instance */
        return this;
    };
    return Canvas;
})();
/**
 * Created by thiron on 03/07/2015.
 */
var oDirections;
(function (oDirections) {
    oDirections[oDirections["Left"] = 0] = "Left";
    oDirections[oDirections["Right"] = 1] = "Right";
    oDirections[oDirections["Up"] = 2] = "Up";
    oDirections[oDirections["Down"] = 3] = "Down";
})(oDirections || (oDirections = {}));
/**
 * Created by thiron on 03/07/2015.
 */
var Jeu = (function () {
    function Jeu() {
    }
    /**
     * Initialise le jeu
     */
    Jeu.prototype.init = function () {
        try {
            /* Initialisation du canvas */
            this.canvas = new Canvas(document.querySelector("canvas"));
            this.canvas.init();
        }
        catch (e) {
            /* Une erreur s'est produite, alert puis redirection */
            alert(e.message);
            window.location.href = "http://www.thomas-hiron.com";
            /* Retour de l'instance pour ne pas continuer le temps de la redirection */
            return this;
        }
        /* Les niveaux */
        this.levelsManager = new LevelsManager();
        this.levelsManager.draw(this.canvas);
    };
    Jeu.INTERVAL = 50;
    return Jeu;
})();
/**
 * Created by thiron on 03/07/2015.
 */
var LevelsManager = (function () {
    function LevelsManager() {
        this.currentLevel = 1;
    }
    /**
     * Dessine le niveau dans le canvas
     *
     * @param canvas
     */
    LevelsManager.prototype.draw = function (canvas) {
    };
    return LevelsManager;
})();
/**
 * Created by thiron on 03/07/2015.
 */
window.addEventListener("load", init, false);
/**
 * Chargement de la fenêtre, initialisation
 */
function init() {
    var jeu = new Jeu();
    jeu.init();
}
/* RequestAnimationFrame */
var requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();
