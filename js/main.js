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
        this.pacDot = null;
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
     * Ajoute le point
     *
     * @param pacDot
     * @returns {Case}
     */
    setPacDot(pacDot) {
        this.pacDot = pacDot;
        return this;
    }
    /**
     * S'il y a un power pellet
     *
     * @returns {boolean}
     */
    hasPowerPellet() {
        return this.pacDot != null && this.pacDot instanceof PowerPellet;
    }
    /**
     * S'il y a un pacdot
     *
     * @returns {boolean}
     */
    hasPacDot() {
        return this.pacDot != null;
    }
    /**
     * Getter
     *
     * @returns {PacDot}
     */
    getPacDot() {
        return this.pacDot;
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
 * Created by mac pro on 05/03/2017.
 */
/**
 * Gère tous les fruits
 */
class FruitsManager {
    /**
     * Démarrage
     * @returns {FruitsManager}
     */
    start() {
        this.startTime = +new Date();
        return this;
    }
    /**
     * Appelé à chaque nouvelle frame du jeu
     *
     * @returns {FruitsManager}
     */
    onRequestAnimFrame() {
        /* Un nouveau fruit au bout de 30 secondes */
        if (this.startTime != null && +new Date() - this.startTime > FruitsManager.APPEARANCE_INTEVERVAL)
            this.newFruit();
        return this;
    }
    /**
     * Ajoute un fruit
     *
     * @returns {FruitsManager}
     */
    newFruit() {
        /* Suppression du startTime */
        this.startTime = null;
        // TODO : ajouter un fruit au hasard
        return this;
    }
}
/* Chaque fois qu'un fruit apparait */
FruitsManager.APPEARANCE_INTEVERVAL = 1000;
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
        this.canvas.getContext().drawImage(canvasLevel.getElement(), 0, Jeu.TOP_HEIGHT);
        /* Le manager des fruits */
        this.fruitsManager = new FruitsManager();
        /* Le score */
        this.score = new Score();
        /* Dessin du haut */
        this.drawTop();
        /* Pacman */
        this.pacman = new Pacman();
        this.pacman.setCollideFunction(this.checkCollision.bind(this));
        this.pacman.init();
        /* Listener pour un point mangée */
        window.addEventListener('PacDotEaten', this.pacDotEaten.bind(this), false);
        /* Listener pour niveau terminé */
        window.addEventListener('LevelFinished', this.levelFinished.bind(this), false);
        /* Démarrage du jeu */
        this.start();
        return this;
    }
    /**
     * Démarre le jeu, appelé à chaque nouveau niveau
     *
     * @returns {Jeu}
     */
    start() {
        /* Récupération de toutes les power pellet pour les faire clignoter */
        this.powerPelletCases = this.levelsManager.getPowerPellet();
        /* Date de début pour le fruit manager */
        this.fruitsManager.start();
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
            /* Dessine la case courante si le point a pas été mangé pour pas le couper */
            this.drawCurrentPacDot();
            /* Clignotement des points */
            this.flashPowerPellet();
            /* Animation de pacman */
            this.animatePacman();
            /* Mise à jour du score */
            this.drawScore();
            /* Dessin de la porte de sortie des fantomes */
            this.drawEscapeDoor();
            /* Notification de la nouvelle frame au fruitsManager */
            this.fruitsManager.onRequestAnimFrame();
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
        ctx.clearRect(pacman.getX() + margin, pacman.getY() + margin + Jeu.TOP_HEIGHT, pacman.getSize().w, pacman.getSize().h);
        /* Instruction de modification des coordonées */
        pacman.move();
        /* Instruction d'animation */
        pacman.animate();
        /* Dessin dans le canvas principal */
        ctx.drawImage(pacman.getCanvasElem(), pacman.getX() + margin, pacman.getY() + margin + Jeu.TOP_HEIGHT);
        return this;
    }
    /**
     * Dessine un point si il a pas été mangé
     *
     * @returns {Jeu}
     */
    drawCurrentPacDot() {
        /* La case de pacman */
        var coords = this.pacman.getPreviousCaseCoords();
        var margin = 5;
        /* Récupération de la case courante */
        var currentCasesLevel = this.levelsManager.getCurrentCasesLevel();
        var currentCase = currentCasesLevel[coords.y][coords.x];
        /* Case ok */
        if (currentCase != null && currentCase.hasPacDot()) {
            var canvas = new Canvas();
            canvas.setSize(this.canvas.getElement().width, this.canvas.getElement().height);
            /* Dessin */
            this.levelsManager.drawPacDot(canvas, currentCase);
            /* Dessin du point et suppression de l'ancien */
            this.canvas.getContext().clearRect(coords.x * Case.CASE_WIDTH + margin, coords.y * Case.CASE_WIDTH + margin + Jeu.TOP_HEIGHT, 30, 30);
            this.canvas.getContext().drawImage(canvas.getElement(), 0, Jeu.TOP_HEIGHT);
        }
        return this;
    }
    /**
     * Dessine le haut
     *
     * @returns {Jeu}
     */
    drawTop() {
        var context = this.canvas.getContext();
        context.beginPath();
        context.strokeStyle = "#012EB6";
        context.lineWidth = 4;
        /* Toute la bordure */
        context.moveTo(0, Jeu.TOP_HEIGHT);
        context.lineTo(this.canvas.getElement().width, Jeu.TOP_HEIGHT);
        context.lineTo(this.canvas.getElement().width, this.canvas.getElement().height);
        context.lineTo(0, this.canvas.getElement().height);
        context.lineTo(0, Jeu.TOP_HEIGHT);
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
        /* Propriété des fonts */
        context.fillStyle = 'white';
        context.font = "16px Arial";
        /* Affichage du score */
        context.fillText(this.score.toString(), 10, Jeu.TOP_HEIGHT / 2 + 5);
        /* Affichage du titre */
        context.textAlign = 'center';
        context.fillText("Pacman", this.canvas.getElement().width / 2, Jeu.TOP_HEIGHT / 2 + 5);
        /* Affichage du niveau */
        context.textAlign = 'right';
        context.fillText("Niveau 1", this.canvas.getElement().width - 10, Jeu.TOP_HEIGHT / 2 + 5);
        return this;
    }
    /**
     * Affichage le score
     *
     * @returns {Jeu}
     */
    drawScore() {
        var context = this.canvas.getContext();
        /* Suppression */
        context.clearRect(0, 0, 200, Jeu.TOP_HEIGHT - 5);
        /* Rajout */
        context.textAlign = 'left';
        context.fillText(this.score.toString(), 10, Jeu.TOP_HEIGHT / 2 + 5);
        return this;
    }
    /**
     * Dessine la porte de sortie des fantomes
     *
     * @returns {Jeu}
     */
    drawEscapeDoor() {
        var context = this.canvas.getContext();
        /* Suppression */
        context.clearRect(7 * Case.CASE_WIDTH, 10 * Case.CASE_WIDTH - 5, Case.CASE_WIDTH, Case.CASE_WIDTH);
        /* Dessin de la ligne */
        context.beginPath();
        context.moveTo(7 * Case.CASE_WIDTH, 10 * Case.CASE_WIDTH);
        context.lineTo(8 * Case.CASE_WIDTH, 10 * Case.CASE_WIDTH);
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.stroke();
        context.closePath();
        return this;
    }
    /**
     * Fait clignoter les gros points
     *
     * @returns {Jeu}
     */
    flashPowerPellet() {
        var date = new Date();
        var context = this.canvas.getContext();
        var margin = 10;
        /* Suppression dans les deux cas */
        for (var i = 0, l = this.powerPelletCases.length; i < l; ++i) {
            context.clearRect(this.powerPelletCases[i].getCoordinates().x * Case.CASE_WIDTH + margin, this.powerPelletCases[i].getCoordinates().y * Case.CASE_WIDTH + margin + Jeu.TOP_HEIGHT, Case.CASE_WIDTH / 2, Case.CASE_WIDTH / 2);
        }
        /* Redessin */
        if (date.getMilliseconds() >= 500) {
            var canvas = new Canvas();
            canvas.setSize(this.canvas.getElement().width, this.canvas.getElement().height);
            /* Dessin */
            for (var i = 0, l = this.powerPelletCases.length; i < l; ++i)
                this.levelsManager.drawPacDot(canvas, this.powerPelletCases[i]);
            /* Dessin du point  */
            this.canvas.getContext().drawImage(canvas.getElement(), 0, Jeu.TOP_HEIGHT);
        }
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
     * Mange le point
     *
     * @returns {Jeu}
     */
    pacDotEaten(e) {
        /* Les coordonées de la case courante */
        var coords = e.detail;
        /* Récupération de la case courante */
        var currentCasesLevel = this.levelsManager.getCurrentCasesLevel();
        var currentCase = currentCasesLevel[coords.y][coords.x];
        /* Augmentation du score */
        this.score.update(currentCase);
        /* Suppression du point */
        currentCase.setPacDot(null);
        return this;
    }
    /**
     * Niveau terminé !
     *
     * @returns {Jeu}
     */
    levelFinished() {
        console.log('Todo : Niveau terminé');
        return this;
    }
}
/* Interval du request animation frame */
Jeu.INTERVAL = 10;
/* Hauteur du panneau supérieur */
Jeu.TOP_HEIGHT = 40;
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
        /* Le conteneur des fantomes */
        wallsCoordinates.push([9, 5]);
        wallsCoordinates.push([9, 6]);
        wallsCoordinates.push([9, 7]);
        wallsCoordinates.push([9, 8]);
        wallsCoordinates.push([9, 9]);
        wallsCoordinates.push([10, 5]);
        wallsCoordinates.push([10, 6]);
        wallsCoordinates.push([10, 7]);
        wallsCoordinates.push([10, 8]);
        wallsCoordinates.push([10, 9]);
        /* Déclaration de tous les murs */
        for (i = 0, l = wallsCoordinates.length; i < l; ++i)
            cases[wallsCoordinates[i][0]][wallsCoordinates[i][1]].isAWall(true);
        /* Sinon on met un point */
        for (i = 0, l = cases.length; i < l; ++i) {
            for (j = 0, k = cases[i].length; j < k; ++j) {
                /* Ajout du point */
                if (!cases[i][j].isAWall())
                    cases[i][j].setPacDot(new PacDot());
            }
        }
        /* Ajout des power pellet, y d'abord */
        cases[2][1].setPacDot(new PowerPellet());
        cases[2][13].setPacDot(new PowerPellet());
        cases[12][2].setPacDot(new PowerPellet());
        cases[12][12].setPacDot(new PowerPellet());
        /* Suppression de la case où y'a pacman */
        cases[11][7].setPacDot(null);
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
        this.currentLevelPacDotNumber = 0;
        /* Listener food eaten */
        window.addEventListener('PacDotEaten', this.pacDotEaten.bind(this), false);
    }
    /**
     * Dessine le niveau dans le canvas
     *
     * @param canvas
     */
    draw(canvas) {
        var currentLevel = this.levels.get(this.currentLevel);
        /* Réinitialisation du nombre de points */
        this.currentLevelPacDotNumber = 0;
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
                /* Dessine la case courante et le point */
                this.drawCase(canvas, currentCase);
                if (currentCase.hasPacDot()) {
                    this.drawPacDot(canvas, currentCase);
                    /* Incrémentation du nombre de points */
                    this.currentLevelPacDotNumber++;
                }
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
     * Dessine le point
     *
     * @param canvas
     * @param currentCase
     *
     * @returns {LevelsManager}
     */
    drawPacDot(canvas, currentCase) {
        if (currentCase.hasPacDot()) {
            var context = canvas.getContext();
            var coordinates = currentCase.getCoordinates();
            var radius = currentCase.getPacDot() instanceof PowerPellet ? 6 : 3;
            var margin = Case.CASE_WIDTH / 2;
            context.beginPath();
            context.arc(coordinates.x * Case.CASE_WIDTH + margin, coordinates.y * Case.CASE_WIDTH + margin, radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'white';
            context.strokeStyle = 'white';
            context.lineWidth = 0;
            context.fill();
            context.closePath();
        }
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
    /**
     * Lorsqu'un case a été mangée
     *
     * @param e
     *
     * @returns {LevelsManager}
     */
    pacDotEaten(e) {
        /* Les coordonées de la case courante */
        var coords = e.detail;
        /* Récupération de la case courante */
        var currentCasesLevel = this.getCurrentCasesLevel();
        var currentCase = currentCasesLevel[coords.y][coords.x];
        /* Décrémentation s'il y a un point */
        if (currentCase.hasPacDot())
            this.currentLevelPacDotNumber--;
        /* Niveau terminé */
        if (this.currentLevelPacDotNumber <= 0) {
            var event = new CustomEvent('LevelFinished');
            window.dispatchEvent(event);
        }
        return this;
    }
    /**
     * Récupère les gros points
     *
     * @returns {Array<Case>}
     */
    getPowerPellet() {
        var cases = this.getCurrentCasesLevel();
        var casesWithPowerPellet = [];
        for (var i = 0, l = cases.length; i < l; ++i) {
            /* Parcourt de chaque case */
            for (var j = 0, k = cases[i].length; j < k; ++j) {
                if (cases[i][j].hasPowerPellet())
                    casesWithPowerPellet.push(cases[i][j]);
            }
        }
        return casesWithPowerPellet;
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
 * Created by mac pro on 04/03/2017.
 */
/**
 * De la bouffe normale
 */
class PacDot {
}
/**
 * De la bouffe qui permet de manger les fantômes
 */
class PowerPellet extends PacDot {
}
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
        /* En fonction de la direction, modification des coords et de l'angle, si 15% dans la case, on supprime le point */
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
        if (percentInCase == 75) {
            /* Les coordonées de la case */
            var currentCaseCoords = this.getCurrentCaseCoords();
            var event = new CustomEvent('PacDotEaten', { 'detail': currentCaseCoords });
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
    /**
     * Récupère les coordonnées de la case courante
     *
     * @returns {Point}
     */
    getCurrentCaseCoords() {
        var moduloX = this.coordinates.x % Case.CASE_WIDTH;
        var moduloY = this.coordinates.y % Case.CASE_WIDTH;
        /* Suppression pour avoir la case */
        var coords = {
            x: (this.coordinates.x - moduloX) / Case.CASE_WIDTH,
            y: (this.coordinates.y - moduloY) / Case.CASE_WIDTH
        };
        /* Suivant la direction, c'est pas forcément la bonne case */
        if (this.direction == Directions.Right)
            coords.x++;
        else if (this.direction == Directions.Down)
            coords.y++;
        return coords;
    }
    /**
     * Récupère les coordonnées de la case précédente (celle derrière pacman)
     *
     * @returns {Point}
     */
    getPreviousCaseCoords() {
        var coords = this.getCurrentCaseCoords();
        /* Suivant la direction, c'est pas forcément la bonne case */
        switch (this.direction) {
            case Directions.Left:
                coords.x++;
                break;
            case Directions.Right:
                coords.x--;
                break;
            case Directions.Up:
                coords.y++;
                break;
            case Directions.Down:
                coords.y--;
                break;
        }
        return coords;
    }
}
/**
 * Created by mac pro on 05/03/2017.
 */
/**
 * Gère le score
 */
class Score {
    constructor() {
        this.score = 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        return 'Score : ' + this.score;
    }
    /**
     * Augmente le score en fonction de la case
     *
     * @param currentCase
     *
     * @returns {Score}
     */
    update(currentCase) {
        if (currentCase.hasPowerPellet())
            this.score += Score.POWER_PELLET;
        else if (currentCase.hasPacDot())
            this.score += Score.PAC_DOT;
        return this;
    }
}
/* Constantes de score */
Score.PAC_DOT = 10;
Score.POWER_PELLET = 50;
/* Les fruits */
Score.CHERRY = 100;
Score.STRAWBERRY = 300;
Score.ORANGE = 500;
Score.APPLE = 700;
Score.MELON = 1000;
Score.GALAXIAN = 2000;
Score.BELL = 3000;
Score.KEY = 5000;
