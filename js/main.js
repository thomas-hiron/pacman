/**
 * Created by thiron on 03/07/2015.
 */
class Canvas {
    /**
     * Le constructeur
     * @param canvas
     */
    constructor(canvas = null) {
        /* Init si null */
        if (canvas == null)
            canvas = document.createElement('CANVAS');
        this.element = canvas;
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
    }
    /**
     * Getter du contexte
     *
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.context;
    }
    /**
     * Getter de l'élément
     *
     * @returns {HTMLCanvasElement}
     */
    getElement() {
        return this.element;
    }
    /**
     * Initialise la taille
     *
     * @param width
     * @param height
     *
     * @returns {Canvas}
     */
    setSize(width, height) {
        this.element.width = width;
        this.element.height = height;
        return this;
    }
}
/**
 * Created by thiron on 03/07/2015.
 */
class Case {
    constructor() {
        this.wall = false;
        this.food = null;
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
    isAWall(isAWall = null) {
        if (isAWall !== null)
            this.wall = isAWall;
        return this.wall;
    }
    /**
     * S'il y a une bordure à gauche
     */
    hasBorderLeft(hasBorder = null) {
        if (hasBorder !== null)
            this.borderLeft = hasBorder;
        return this.borderLeft;
    }
    /**
     * S'il y a une bordure à droite
     */
    hasBorderRight(hasBorder = null) {
        if (hasBorder !== null)
            this.borderRight = hasBorder;
        return this.borderRight;
    }
    /**
     * S'il y a une bordure en haut
     */
    hasBorderTop(hasBorder = null) {
        if (hasBorder !== null)
            this.borderTop = hasBorder;
        return this.borderTop;
    }
    /**
     * S'il y a une bordure en bas
     */
    hasBorderBottom(hasBorder = null) {
        if (hasBorder !== null)
            this.borderBottom = hasBorder;
        return this.borderBottom;
    }
    /**
     * Les coordonnées
     *
     * @param i
     * @param j
     */
    setCoordinates(i, j) {
        this.coordinates.x = i;
        this.coordinates.y = j;
    }
    /**
     * Retourne les coordonnées
     *
     * @returns {Point}
     */
    getCoordinates() {
        return this.coordinates;
    }
    /**
     * Ajoute la bouffe
     *
     * @param food
     * @returns {Case}
     */
    setFood(food) {
        this.food = food;
        return this;
    }
    /**
     * S'il y a de la grosse bouffe
     *
     * @returns {boolean}
     */
    hasBigFood() {
        return this.food != null && this.food instanceof BigFood;
    }
    /**
     * S'il y a de la bouffe
     *
     * @returns {boolean}
     */
    hasFood() {
        return this.food != null;
    }
}
Case.CASE_WIDTH = 40;
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
 * Created by mac pro on 04/03/2017.
 */
/**
 * De la bouffe normale
 */
class Food {
}
/**
 * De la bouffe qui permet de manger les fantômes
 */
class BigFood extends Food {
}
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Initialise le jeu, créer les niveaux, lance pacman, les fantomes,...
 */
class Jeu {
    constructor() {
        this.time = +new Date();
    }
    /**
     * Initialise le jeu
     */
    init() {
        try {
            /* Initialisation du canvas */
            this.canvas = new Canvas(document.querySelector("canvas"));
        }
        catch (e) {
            /* Une erreur s'est produite, alert puis redirection */
            alert(e.message);
            window.location.href = "http://www.thomas-hiron.com";
            /* Retour de l'instance pour ne pas continuer le temps de la redirection */
            return this;
        }
        /* Le canvas pour dessiner les niveau */
        var canvasLevel = new Canvas();
        canvasLevel.setSize(this.canvas.getElement().width, this.canvas.getElement().height);
        /* Les niveaux */
        this.levelsManager = new LevelsManager();
        this.levelsManager.draw(canvasLevel);
        /* Dessin du niveau */
        this.canvas.getContext().drawImage(canvasLevel.getElement(), 0, 0);
        /* Pacman */
        this.pacman = new Pacman();
        this.pacman.setCollideFunction(this.checkCollision.bind(this));
        this.pacman.init();
        /* Listener pour la nourriture mangée */
        window.addEventListener('FoodEaten', this.foodEaten.bind(this), false);
        /* RequestAnimationFrame pour le pacman, les fantomes */
        requestAnimFrame(this.draw.bind(this));
        return this;
    }
    /**
     * Dessine les différents éléments du jeu
     *
     * @returns {Jeu}
     */
    draw() {
        /* Si l'interval a été atteint */
        if (+new Date() - this.time > Jeu.INTERVAL) {
            /* Animation de pacman */
            this.animatePacman();
            /* Mise à jour du temps */
            this.time = +new Date();
        }
        /* Animation suivante */
        requestAnimFrame(this.draw.bind(this));
        return this;
    }
    /**
     * Anime pacman et donne les instructions
     *
     * @returns {Jeu}
     */
    animatePacman() {
        var pacman = this.pacman;
        /* Pour centrer dans la case */
        var margin = (Case.CASE_WIDTH - pacman.getSize().w) / 2;
        var ctx = this.canvas.getContext();
        /* Suppression du pacman courant */
        ctx.clearRect(pacman.getX() + margin, pacman.getY() + margin, pacman.getSize().w, pacman.getSize().h);
        /* Instruction de modification des coordonées */
        pacman.move();
        /* Instruction d'animation */
        pacman.animate();
        /* Dessin dans le canvas principal */
        ctx.drawImage(pacman.getCanvasElem(), pacman.getX() + margin, pacman.getY() + margin);
        return this;
    }
    /**
     * Vérifie qu'il n'y a pas de collision
     *
     * @param x
     * @param y
     *
     * @returns {boolean}
     */
    checkCollision(x, y) {
        var currentCasesLevel = this.levelsManager.getCurrentCasesLevel();
        return currentCasesLevel[y] == void 0 || currentCasesLevel[y][x] === void 0 || currentCasesLevel[y][x].isAWall();
    }
    /**
     * Mange la nourriture
     *
     * @returns {Jeu}
     */
    foodEaten(e) {
        /* Les coordonées */
        var coords = e.detail;
        return this;
    }
}
Jeu.INTERVAL = 10;
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Gère le design des niveaux
 */
class Levels {
    constructor() {
        this.levels = [];
        this.constructLevel1();
    }
    /**
     * Niveau 1
     *
     * @returns {Levels}
     */
    constructLevel1() {
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
        var wallsCoordinates = [
            [0, 7],
            [1, 1], [1, 2], [1, 4], [1, 5], [1, 7], [1, 9], [1, 10], [1, 12], [1, 13],
            [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 7], [3, 9], [3, 10], [3, 11], [3, 12], [3, 13],
            [4, 5], [4, 7], [4, 9],
            [5, 1], [5, 3], [5, 5], [5, 7], [5, 9], [5, 11], [5, 13],
            [6, 1], [6, 13],
            [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 7], [7, 9], [7, 10], [7, 11], [7, 12], [7, 13],
            [9, 0], [9, 1], [9, 2], [9, 3], [9, 11], [9, 12], [9, 13], [9, 14],
            [11, 0], [11, 1], [11, 2], [11, 3], [11, 11], [11, 12], [11, 13], [11, 14],
            [12, 3], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 11],
            [13, 1], [13, 3], [13, 7], [13, 11], [13, 13],
            [14, 3], [14, 5], [14, 7], [14, 9], [14, 11],
            [15, 1], [15, 5], [15, 9], [15, 13],
            [16, 1], [16, 2], [16, 3], [16, 4], [16, 5], [16, 7], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13],
            [17, 7],
            [18, 1], [18, 2], [18, 3], [18, 4], [18, 5], [18, 6], [18, 7], [18, 8], [18, 9], [18, 10], [18, 11], [18, 12], [18, 13]
        ];
        /* Déclaration de tous les murs */
        for (i = 0, l = wallsCoordinates.length; i < l; ++i)
            cases[wallsCoordinates[i][0]][wallsCoordinates[i][1]].isAWall(true);
        /* Sinon on met de la bouffe */
        for (i = 0, l = cases.length; i < l; ++i) {
            for (j = 0, k = cases[i].length; j < k; ++j) {
                /* Ajout de la nourriture */
                if (!cases[i][j].isAWall())
                    cases[i][j].setFood(new Food());
            }
        }
        /* Ajout des grosses bouffes, y d'abord */
        cases[2][1].setFood(new BigFood());
        cases[2][13].setFood(new BigFood());
        cases[12][2].setFood(new BigFood());
        cases[12][12].setFood(new BigFood());
        /* Ajout des cases */
        this.levels.push(cases);
        return this;
    }
    /**
     * Retourne le tableau désiré
     *
     * @param currentLevel
     *
     * @returns {Array<Array<Case>>}
     */
    get(currentLevel) {
        var level = this.levels[currentLevel - 1] || null;
        return level;
    }
}
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Gère et dessine les niveaux
 */
class LevelsManager {
    constructor() {
        this.currentLevel = 1;
        this.levels = new Levels();
    }
    /**
     * Dessine le niveau dans le canvas
     *
     * @param canvas
     */
    draw(canvas) {
        var currentLevel = this.levels.get(this.currentLevel);
        /* Prévention de bug */
        if (currentLevel == null)
            return this;
        /* Parcourt de chaque ligne */
        for (var i = 0, l = currentLevel.length; i < l; ++i) {
            var row = currentLevel[i];
            /* Parcourt de chaque case */
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
                /* Dessine la case courante et la nourriture */
                this.drawCase(canvas, currentCase);
                if (currentCase.hasFood())
                    this.drawFood(canvas, currentCase, currentCase.hasBigFood());
            }
        }
        return this;
    }
    /**
     * Dessine la case courante
     *
     * @param canvas
     * @param currentCase
     */
    drawCase(canvas, currentCase) {
        var context = canvas.getContext();
        context.beginPath();
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
    }
    /**
     * Dessine la bouffe
     *
     * @param canvas
     * @param currentCase
     * @param bigFood
     *
     * @returns {LevelsManager}
     */
    drawFood(canvas, currentCase, bigFood) {
        var context = canvas.getContext();
        var coordinates = currentCase.getCoordinates();
        var radius = bigFood ? 7 : 3;
        var margin = Case.CASE_WIDTH / 2;
        context.beginPath();
        context.arc(coordinates.x * Case.CASE_WIDTH + margin, coordinates.y * Case.CASE_WIDTH + margin, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.strokeStyle = '';
        context.lineWidth = 0;
        context.fill();
        context.closePath();
        return this;
    }
    /**
     * Récupère toutes les cases du niveau courant
     *
     * @returns {Array<Array<Case>>}
     */
    getCurrentCasesLevel() {
        return this.levels.get(this.currentLevel);
    }
}
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
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
})();
/**
 * Created by thiron on 01/03/2017.
 */
/**
 * Le pacman, il gère tout seul le mouvement et l'animation pour manger
 */
class Pacman {
    /**
     * Le constructeur qui initialise les variables
     */
    constructor() {
        this.size = {
            w: 24,
            h: 24
        };
        this.coordinates = {
            x: 7 * Case.CASE_WIDTH,
            y: 11 * Case.CASE_WIDTH
        };
        this.currentStep = 0;
        this.stepNumber = 12;
        this.stepPx = 2;
        this.angle = 0;
    }
    /**
     * @param callback
     *
     * @returns {Pacman}
     */
    setCollideFunction(callback) {
        this.checkCollision = callback;
        return this;
    }
    /**
     * @returns {Size}
     */
    getSize() {
        return this.size;
    }
    /**
     * @returns {number}
     */
    getX() {
        return this.coordinates.x;
    }
    /**
     * @returns {number}
     */
    getY() {
        return this.coordinates.y;
    }
    /**
     * Renvoie le canvas de pacman pour pouvoir être dessiné dans le jeu
     *
     * @returns {HTMLCanvasElement}
     */
    getCanvasElem() {
        return this.canvas.getElement();
    }
    /**
     * Initialisation
     *
     * @returns {Pacman}
     */
    init() {
        /* Création du canvas */
        this.canvas = new Canvas();
        /* Initialisation de la taille du canvas */
        this.canvas.setSize(this.size.w, this.size.h);
        /* Initialisation de la direction */
        this.direction = Directions.Right;
        this.nextDirection = this.direction;
        /* Ajout de l'event des flèches */
        window.addEventListener("keydown", this.rotate.bind(this), false);
        /* Retour de l'instance */
        return this;
    }
    /**
     * Modifie la valeur de nextDirection, ne fait rien d'autre
     *
     * @param e:KeyboardEvent
     *
     * @returns {Pacman}
     */
    rotate(e) {
        e.preventDefault();
        /* Le code de la flèche touchée */
        var code = e.keyCode;
        /* Selon la flèche, on change le direction */
        switch (code) {
            case 37:
                this.nextDirection = Directions.Left;
                break;
            case 38:
                this.nextDirection = Directions.Up;
                break;
            case 39:
                this.nextDirection = Directions.Right;
                break;
            case 40:
                this.nextDirection = Directions.Down;
                break;
        }
        /* Retour de l'instance */
        return this;
    }
    /**
     * Anime le pacman et le dessine dans le canvas (methode draw)
     *
     * @returns {Pacman}
     */
    animate() {
        /* Augmentation de l'étape */
        this.currentStep++;
        /* Réinitialisation de l'étape si besoin */
        if (this.currentStep % this.stepNumber == 0)
            this.currentStep = 0;
        /* Dessin dans le canvas */
        this.draw();
        /* Retour de l'instance */
        return this;
    }
    /**
     * Modifie les coordonnées de pacman
     *
     * @returns {Pacman}
     */
    move() {
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
            if (this.direction == Directions.Left && this.nextDirection == Directions.Right ||
                this.direction == Directions.Right && this.nextDirection == Directions.Left ||
                this.direction == Directions.Up && this.nextDirection == Directions.Down ||
                this.direction == Directions.Down && this.nextDirection == Directions.Up)
                this.direction = this.nextDirection;
        }
        /* En fonction de la direction, modification des coords et de l'angle, si 15% dans la case, on supprime la bouffe */
        var percentInCase;
        switch (this.direction) {
            case Directions.Left:
                percentInCase = 100 - this.coordinates.x % caseWidth * 100 / caseWidth;
                newX -= this.stepPx;
                this.angle = 180;
                break;
            case Directions.Right:
                percentInCase = this.coordinates.x % caseWidth * 100 / caseWidth;
                newX += this.stepPx;
                this.angle = 0;
                break;
            case Directions.Up:
                percentInCase = 100 - this.coordinates.y % caseWidth * 100 / caseWidth;
                newY -= this.stepPx;
                this.angle = 270;
                break;
            case Directions.Down:
                percentInCase = this.coordinates.y % caseWidth * 100 / caseWidth;
                newY += this.stepPx;
                this.angle = 90;
                break;
        }
        /* Pas de collision, changement des coordonnées */
        if (!collisionWithNextDirection || !collisionWithCurrentDirection) {
            this.coordinates.x = newX;
            this.coordinates.y = newY;
        }
        /* Suppression du point */
        if (percentInCase == 15) {
            /* Les coordonées de la case */
            var nextCaseCoords = this.getNextCaseCoords(this.direction);
            /* Round */
            nextCaseCoords.x = Math.abs(Math.round(nextCaseCoords.x));
            nextCaseCoords.y = Math.abs(Math.round(nextCaseCoords.y));
            var event = new CustomEvent('FoodEaten', { 'detail': nextCaseCoords });
            window.dispatchEvent(event);
        }
        /* Retour de l'instance */
        return this;
    }
    /**
     * Dessine le Pacman dans le canvas
     *
     * @returns {Pacman}
     */
    draw() {
        /* Le context du pacman */
        var ctx = this.canvas.getContext();
        /* Taille */
        var size = this.size;
        /* Largeur de la case */
        var caseWidth = Case.CASE_WIDTH;
        /* Suppression du context */
        ctx.clearRect(0, 0, size.w, size.h);
        /* Enregistrement du context */
        ctx.save();
        /* Translation */
        ctx.translate(size.w / 2, size.h / 2);
        /* Rotation */
        ctx.rotate(this.angle * Math.PI / 180);
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
        /* Restauration du context */
        ctx.restore();
        /* Retour de l'instance */
        return this;
    }
    /**
     * Récupère les coordonnées de la case suivante en fonction d'une direction donnée
     *
     * @param direction
     *
     * @returns {Point}
     */
    getNextCaseCoords(direction) {
        /* La case suivante avec la prochaine direction */
        var nextCaseCoords = {
            x: this.coordinates.x / Case.CASE_WIDTH,
            y: this.coordinates.y / Case.CASE_WIDTH
        };
        /* Modification de la case suivante */
        switch (direction) {
            case Directions.Left:
                nextCaseCoords.x--;
                break;
            case Directions.Right:
                nextCaseCoords.x++;
                break;
            case Directions.Up:
                nextCaseCoords.y--;
                break;
            case Directions.Down:
                nextCaseCoords.y++;
                break;
        }
        return nextCaseCoords;
    }
}
