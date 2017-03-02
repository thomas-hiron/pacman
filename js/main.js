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
    /**
     * Getter du contexte
     *
     * @returns {CanvasRenderingContext2D}
     */
    Canvas.prototype.getContext = function () {
        return this.context;
    };
    /**
     * Getter de l'�l�ment
     *
     * @returns {HTMLCanvasElement}
     */
    Canvas.prototype.getElement = function () {
        return this.element;
    };
    return Canvas;
})();
/**
 * Created by thiron on 03/07/2015.
 */
var Case = (function () {
    function Case() {
        this.wall = false;
        this.coordinates = {
            x: 0,
            y: 0
        };
        /* Initialisation des bordures */
        this.borderLeft = true;
        this.borderRight = true;
        this.borderTop = true;
        this.borderBottom = true;
    }
    /**
     * Getter/Setter
     *
     * @returns {boolean}
     */
    Case.prototype.isAWall = function (isAWall) {
        if (isAWall === void 0) { isAWall = null; }
        if (isAWall !== null)
            this.wall = isAWall;
        return this.wall;
    };
    /**
     * S'il y a une bordure à gauche
     */
    Case.prototype.hasBorderLeft = function (hasBorder) {
        if (hasBorder === void 0) { hasBorder = null; }
        if (hasBorder !== null)
            this.borderLeft = hasBorder;
        return this.borderLeft;
    };
    /**
     * S'il y a une bordure à droite
     */
    Case.prototype.hasBorderRight = function (hasBorder) {
        if (hasBorder === void 0) { hasBorder = null; }
        if (hasBorder !== null)
            this.borderRight = hasBorder;
        return this.borderRight;
    };
    /**
     * S'il y a une bordure en haut
     */
    Case.prototype.hasBorderTop = function (hasBorder) {
        if (hasBorder === void 0) { hasBorder = null; }
        if (hasBorder !== null)
            this.borderTop = hasBorder;
        return this.borderTop;
    };
    /**
     * S'il y a une bordure en bas
     */
    Case.prototype.hasBorderBottom = function (hasBorder) {
        if (hasBorder === void 0) { hasBorder = null; }
        if (hasBorder !== null)
            this.borderBottom = hasBorder;
        return this.borderBottom;
    };
    /**
     * Les coordonnées
     *
     * @param i
     * @param j
     */
    Case.prototype.setCoordinates = function (i, j) {
        this.coordinates.x = i;
        this.coordinates.y = j;
    };
    /**
     * Retourne les coordonnées
     *
     * @returns {Point}
     */
    Case.prototype.getCoordinates = function () {
        return this.coordinates;
    };
    Case.CASE_WIDTH = 40;
    return Case;
})();
/**
 * Created by thiron on 03/07/2015.
 */
var Directions;
(function (Directions) {
    Directions[Directions["Left"] = 0] = "Left";
    Directions[Directions["Right"] = 1] = "Right";
    Directions[Directions["Up"] = 2] = "Up";
    Directions[Directions["Down"] = 3] = "Down";
})(Directions || (Directions = {}));
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Created by thiron on 03/07/2015.
 */
var Jeu = (function () {
    function Jeu() {
        this.time = +new Date();
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
        /* Pacman */
        this.pacman = new Pacman();
        this.pacman.setCollideFunction(this.checkCollision.bind(this));
        this.pacman.init();
        /* TMP - démarrage du jeu */
        this.pacman.start();
        /* RequestAnimationFrame pour le pacman, les fantomes */
        requestAnimFrame(this.draw.bind(this));
        return this;
    };
    /**
     * Dessine les différents éléments du jeu
     *
     * @returns {Jeu}
     */
    Jeu.prototype.draw = function () {
        /* Si l'interval a été atteint */
        if (+new Date() - this.time > Jeu.INTERVAL) {
            var pacman = this.pacman;
            var margin = (Case.CASE_WIDTH - pacman.getSize().w) / 2;
            /* Suppression puis dessin du pacman */
            this.canvas.getContext().clearRect(pacman.getX() + margin, pacman.getY() + margin, pacman.getSize().w, pacman.getSize().h);
            pacman.draw(this.canvas.getContext());
            /* Mise à jour du temps */
            this.time = +new Date();
        }
        /* Animation suivante */
        requestAnimFrame(this.draw.bind(this));
        return this;
    };
    /**
     * Vérifie qu'il n'y a pas de collision
     *
     * @param x
     * @param y
     *
     * @returns {boolean}
     */
    Jeu.prototype.checkCollision = function (x, y) {
        var currentCasesLevel = this.levelsManager.getCurrentCasesLevel();
        return currentCasesLevel[y] == void 0 || currentCasesLevel[y][x] === void 0 || currentCasesLevel[y][x].isAWall();
    };
    Jeu.INTERVAL = 10;
    return Jeu;
})();
/**
 * Created by thiron on 03/07/2015.
 */
var Levels = (function () {
    function Levels() {
        this.levels = [];
        this.constructLevel1();
    }
    /**
     * Niveau 1
     *
     * @returns {Levels}
     */
    Levels.prototype.constructLevel1 = function () {
        /* Les blocs avec cases */
        var cases = new Array(20);
        for (var i = 0, l = cases.length; i < l; ++i) {
            cases[i] = new Array(15);
            for (var j = 0, k = cases[i].length; j < k; ++j) {
                cases[i][j] = new Case();
                cases[i][j].setCoordinates(j, i);
            }
        }
        /* On rempli toutes les cases murs */
        var casesCoords = [
            [0, 7],
            [1, 1],
            [1, 2],
            [1, 4],
            [1, 5],
            [1, 7],
            [1, 9],
            [1, 10],
            [1, 12],
            [1, 13],
            [3, 1],
            [3, 2],
            [3, 3],
            [3, 4],
            [3, 5],
            [3, 7],
            [3, 9],
            [3, 10],
            [3, 11],
            [3, 12],
            [3, 13],
            [4, 5],
            [4, 7],
            [4, 9],
            [5, 1],
            [5, 3],
            [5, 5],
            [5, 7],
            [5, 9],
            [5, 11],
            [5, 13],
            [6, 1],
            [6, 13],
            [7, 1],
            [7, 2],
            [7, 3],
            [7, 4],
            [7, 5],
            [7, 7],
            [7, 9],
            [7, 10],
            [7, 11],
            [7, 12],
            [7, 13],
            [9, 0],
            [9, 1],
            [9, 2],
            [9, 3],
            [9, 11],
            [9, 12],
            [9, 13],
            [9, 14],
            [11, 0],
            [11, 1],
            [11, 2],
            [11, 3],
            [11, 11],
            [11, 12],
            [11, 13],
            [11, 14],
            [12, 3],
            [12, 5],
            [12, 6],
            [12, 7],
            [12, 8],
            [12, 9],
            [12, 11],
            [13, 1],
            [13, 3],
            [13, 7],
            [13, 11],
            [13, 13],
            [14, 3],
            [14, 5],
            [14, 7],
            [14, 9],
            [14, 11],
            [15, 1],
            [15, 5],
            [15, 9],
            [15, 13],
            [16, 1],
            [16, 2],
            [16, 3],
            [16, 4],
            [16, 5],
            [16, 7],
            [16, 9],
            [16, 10],
            [16, 11],
            [16, 12],
            [16, 13],
            [17, 7],
            [18, 1],
            [18, 2],
            [18, 3],
            [18, 4],
            [18, 5],
            [18, 6],
            [18, 7],
            [18, 8],
            [18, 9],
            [18, 10],
            [18, 11],
            [18, 12],
            [18, 13]
        ];
        for (i = 0, l = casesCoords.length; i < l; ++i)
            cases[casesCoords[i][0]][casesCoords[i][1]].isAWall(true);
        /* Ajout des cases */
        this.levels.push(cases);
        return this;
    };
    /**
     * Retourne le tableau désiré
     *
     * @param currentLevel
     *
     * @returns {Array<Array<Case>>}
     */
    Levels.prototype.get = function (currentLevel) {
        var level = this.levels[currentLevel - 1] || null;
        return level;
    };
    return Levels;
})();
/**
 * Created by thiron on 03/07/2015.
 */
var LevelsManager = (function () {
    function LevelsManager() {
        this.currentLevel = 1;
        this.levels = new Levels();
    }
    /**
     * Dessine le niveau dans le canvas
     *
     * @param canvas
     */
    LevelsManager.prototype.draw = function (canvas) {
        var currentLevel = this.levels.get(this.currentLevel);
        /* Prévention de bug */
        if (currentLevel == null)
            return this;
        for (var i = 0, l = currentLevel.length; i < l; ++i) {
            var row = currentLevel[i];
            for (var j = 0, k = row.length; j < k; ++j) {
                var currentCase = row[j];
                /* Détermination des bordures à supprimer */
                var leftCase = row[j - 1] || null;
                var rightCase = row[j + 1] || null;
                var upCase = currentLevel[i - 1] != null ? currentLevel[i - 1][j] : null;
                var downCase = currentLevel[i + 1] != null ? currentLevel[i + 1][j] : null;
                /* Suppression des bordures */
                currentCase.hasBorderLeft(leftCase != null && currentCase.isAWall() && !leftCase.isAWall());
                currentCase.hasBorderRight(rightCase != null && currentCase.isAWall() && !rightCase.isAWall());
                currentCase.hasBorderTop(upCase != null && currentCase.isAWall() && !upCase.isAWall());
                currentCase.hasBorderBottom(downCase != null && currentCase.isAWall() && !downCase.isAWall());
                /* Dessine la case courante */
                this.drawCase(canvas, currentCase);
            }
        }
        return this;
    };
    /**
     * Dessine la case courante
     *
     * @param currentCase
     */
    LevelsManager.prototype.drawCase = function (canvas, currentCase) {
        var context = canvas.getContext();
        context.strokeStyle = "#012EB6";
        context.lineWidth = 4;
        var coordinates = currentCase.getCoordinates();
        if (currentCase.hasBorderLeft()) {
            context.moveTo(coordinates.x * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
            context.lineTo(coordinates.x * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
        }
        /* Bordure droite */
        if (currentCase.hasBorderRight()) {
            context.moveTo((coordinates.x + 1) * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
            context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
        }
        /* Bordure haut */
        if (currentCase.hasBorderTop()) {
            context.moveTo(coordinates.x * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
            context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
        }
        /* Bordure bas */
        if (currentCase.hasBorderBottom()) {
            context.moveTo(coordinates.x * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
            context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
        }
        /* Bordure */
        context.stroke();
        /* Pour faire la bordure double */
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 2;
        context.stroke();
        /* Le contexte par défaut */
        context.globalCompositeOperation = 'source-over';
        /* Fermeture du path */
        context.closePath();
        return this;
    };
    /**
     * Récupère toutes les cases du niveau courant
     *
     * @returns {Array<Array<Case>>}
     */
    LevelsManager.prototype.getCurrentCasesLevel = function () {
        return this.levels.get(this.currentLevel);
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
/**
 * Created by thiron on 01/03/2017.
 */
var Pacman = (function () {
    /**
     * Le constructeur qui initialise les variables
     *
     * @param gameCanvas
     */
    function Pacman() {
        this.size = {
            w: 24,
            h: 24
        };
        this.coordinates = {
            x: 7 * Case.CASE_WIDTH,
            y: 11 * Case.CASE_WIDTH
        };
        this.currentStep = 0;
        this.stepNumber = 6;
        this.interval = 40;
        this.stepPx = 2;
        this.time = +new Date();
    }
    /**
     * @param callback
     *
     * @returns {Pacman}
     */
    Pacman.prototype.setCollideFunction = function (callback) {
        this.checkCollision = callback;
        return this;
    };
    /**
     * @returns {Size}
     */
    Pacman.prototype.getSize = function () {
        return this.size;
    };
    /**
     * @returns {number}
     */
    Pacman.prototype.getX = function () {
        return this.coordinates.x;
    };
    /**
     * @returns {number}
     */
    Pacman.prototype.getY = function () {
        return this.coordinates.y;
    };
    /**
     * Initialisation
     *
     * @returns {Pacman}
     */
    Pacman.prototype.init = function () {
        /* Création du canvas */
        this.canvas = new Canvas(document.createElement('CANVAS'));
        this.canvas.init();
        /* Initialisation de la taille du canvas */
        var canvas = this.canvas.getElement();
        canvas.width = this.size.w;
        canvas.height = this.size.h;
        /* Initialisation de la direction */
        this.direction = 1 /* Right */;
        this.nextDirection = this.direction;
        /* Ajout de l'event des flèches */
        window.addEventListener("keydown", this.rotate.bind(this), false);
        /* Retour de l'instance */
        return this;
    };
    /**
     * Modifie la valeur de nextDirection, ne fait rien d'autre
     *
     * @param e:KeyboardEvent
     *
     * @returns {Pacman}
     */
    Pacman.prototype.rotate = function (e) {
        e.preventDefault();
        /* Le code de la flèche touchée */
        var code = e.keyCode;
        switch (code) {
            case 37:
                this.nextDirection = 0 /* Left */;
                break;
            case 38:
                this.nextDirection = 2 /* Up */;
                break;
            case 39:
                this.nextDirection = 1 /* Right */;
                break;
            case 40:
                this.nextDirection = 3 /* Down */;
                break;
        }
        /* Retour de l'instance */
        return this;
    };
    /**
     * Démarre le requestAnimationFrame
     *
     * @returns {Pacman}
     */
    Pacman.prototype.start = function () {
        /* Animation suivante */
        requestAnimFrame(this.animate.bind(this));
        return this;
    };
    /**
     * Anime le pacman
     *
     * @returns {Pacman}
     */
    Pacman.prototype.animate = function () {
        /* Si l'interval a été atteind */
        if (+new Date() - this.time > this.interval) {
            /* On augmente l'étape */
            this.currentStep++;
            /* Réinitialisation de l'étape si besoin */
            if (this.currentStep % this.stepNumber == 0)
                this.currentStep = 0;
            /* Mise à jour du temps */
            this.time = +new Date();
        }
        /* Animation suivante */
        requestAnimFrame(this.animate.bind(this));
        /* Retour de l'instance */
        return this;
    };
    /**
     * Dessine le Pacman
     *
     * @returns {Pacman}
     */
    Pacman.prototype.draw = function (gameCtx) {
        /* L'angle du dessin */
        var angle = 0;
        /* Le context du pacman */
        var ctx = this.canvas.getContext();
        /* Taille */
        var size = this.size;
        /* Largeur de la case */
        var caseWidth = Case.CASE_WIDTH;
        /* Pas de collision par défaut */
        var collisionWithNextDirection = false;
        var collisionWithCurrentDirection = false;
        /* Les nouvelles coordonnées */
        var newX = this.coordinates.x;
        var newY = this.coordinates.y;
        /* Si dans une case, on change de direction, si possible */
        if (this.coordinates.x % caseWidth == 0 && this.coordinates.y % caseWidth == 0) {
            /* Les cases suivantes en fonction de la direction courante et suivante */
            var nextCaseCoordsWithNextDirection = this.getNextCaseCoords(this.nextDirection);
            var nextCaseCoordsWithCurrentDirection = this.getNextCaseCoords(this.direction);
            /* Vérification que pas de collision */
            collisionWithNextDirection = this.checkCollision(nextCaseCoordsWithNextDirection.x, nextCaseCoordsWithNextDirection.y);
            collisionWithCurrentDirection = this.checkCollision(nextCaseCoordsWithCurrentDirection.x, nextCaseCoordsWithCurrentDirection.y);
            /* Changement de direction que si pas de collision avec la prochaine direction */
            if (!collisionWithNextDirection)
                this.direction = this.nextDirection;
        }
        else {
            /* Si on veut changer dans la direction opposée, faut le faire immédiatement */
            if (this.direction == 0 /* Left */ && this.nextDirection == 1 /* Right */ || this.direction == 1 /* Right */ && this.nextDirection == 0 /* Left */ || this.direction == 2 /* Up */ && this.nextDirection == 3 /* Down */ || this.direction == 3 /* Down */ && this.nextDirection == 2 /* Up */)
                this.direction = this.nextDirection;
        }
        switch (this.direction) {
            case 0 /* Left */:
                newX -= this.stepPx;
                angle = 180;
                break;
            case 1 /* Right */:
                newX += this.stepPx;
                angle = 0;
                break;
            case 2 /* Up */:
                newY -= this.stepPx;
                angle = 270;
                break;
            case 3 /* Down */:
                newY += this.stepPx;
                angle = 90;
                break;
        }
        /* Pas de collision, changement des coordonnées */
        if (!collisionWithNextDirection || !collisionWithCurrentDirection) {
            this.coordinates.x = newX;
            this.coordinates.y = newY;
        }
        /* Suppression du context */
        ctx.clearRect(0, 0, size.w, size.h);
        /* Enregistrement du context */
        ctx.save();
        /* Translation */
        ctx.translate(size.w / 2, size.h / 2);
        /* Rotation */
        ctx.rotate(angle * Math.PI / 180);
        /* Translation inverse pour le remettre comme avant */
        ctx.translate(-size.w / 2, -size.h / 2);
        /* Couleur */
        ctx.fillStyle = "#FFFF00";
        /* Calcul pour le dessin */
        var inclinaison = this.currentStep * 0.25 / (this.stepNumber - 1);
        var inclinaison2 = 1 - inclinaison;
        /* Dessin */
        ctx.beginPath();
        ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison * Math.PI, (inclinaison + 1) * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison2 * Math.PI, (inclinaison2 + 1) * Math.PI, false);
        ctx.fill();
        /* La marge */
        var margin = (caseWidth - size.w) / 2;
        /* Dessin dans le canvas du jeu */
        gameCtx.drawImage(ctx.canvas, this.getX() + margin, this.getY() + margin);
        /* Restauration du context */
        ctx.restore();
        /* Retour de l'instance */
        return this;
    };
    /**
     * Récupère les coordonnées de la case suivante en fonction d'une direction donnée
     *
     * @param direction
     *
     * @returns {Point}
     */
    Pacman.prototype.getNextCaseCoords = function (direction) {
        /* La case suivante avec la prochaine direction */
        var nextCaseCoords = {
            x: this.coordinates.x / Case.CASE_WIDTH,
            y: this.coordinates.y / Case.CASE_WIDTH
        };
        switch (direction) {
            case 0 /* Left */:
                nextCaseCoords.x--;
                break;
            case 1 /* Right */:
                nextCaseCoords.x++;
                break;
            case 2 /* Up */:
                nextCaseCoords.y--;
                break;
            case 3 /* Down */:
                nextCaseCoords.y++;
                break;
        }
        return nextCaseCoords;
    };
    return Pacman;
})();
