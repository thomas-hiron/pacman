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
    /**
     * Nettoie le canvas
     *
     * @returns {Canvas}
     */
    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        return this;
    }
}
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
var Modes;
(function (Modes) {
    Modes[Modes["Chase"] = 0] = "Chase";
    Modes[Modes["Scatter"] = 1] = "Scatter";
    Modes[Modes["Frightened"] = 2] = "Frightened";
    Modes[Modes["OutFromHome"] = 3] = "OutFromHome";
    Modes[Modes["GoingHome"] = 4] = "GoingHome";
})(Modes || (Modes = {}));
/**
 * Created by mac pro on 04/03/2017.
 */
/**
 * De la bouffe normale
 */
class PacDot {
    constructor() {
        this.scoreValue = PacDot.SCORE_VALUE;
    }
    getScoreValue() {
        return this.scoreValue;
    }
}
PacDot.SCORE_VALUE = 10;
/**
 * De la bouffe qui permet de manger les fantômes
 */
class PowerPellet extends PacDot {
    constructor(...args) {
        super(...args);
        this.scoreValue = PowerPellet.SCORE_VALUE;
    }
}
PowerPellet.SCORE_VALUE = 50;
///<reference path='PacDot.ts' />
/**
 * Created by mac pro on 05/03/2017.
 */
class Fruit extends PacDot {
}
Fruit.WIDTH = 20;
/* Les fruits */
class Cherry extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Cherry.SCORE_VALUE;
    }
}
Cherry.SCORE_VALUE = 100;
class Strawberry extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Strawberry.SCORE_VALUE;
    }
}
Strawberry.SCORE_VALUE = 300;
class Orange extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Orange.SCORE_VALUE;
    }
}
Orange.SCORE_VALUE = 500;
class Apple extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Apple.SCORE_VALUE;
    }
}
Apple.SCORE_VALUE = 700;
class Melon extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Melon.SCORE_VALUE;
    }
}
Melon.SCORE_VALUE = 1000;
class Galaxian extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Galaxian.SCORE_VALUE;
    }
}
Galaxian.SCORE_VALUE = 2000;
class Bell extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Bell.SCORE_VALUE;
    }
}
Bell.SCORE_VALUE = 3000;
class Key extends Fruit {
    constructor(...args) {
        super(...args);
        this.scoreValue = Key.SCORE_VALUE;
    }
}
Key.SCORE_VALUE = 5000;
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
    init() {
        this.hasFruit = false;
        this.frames = 0;
        return this;
    }
    /**
     * Appelé à chaque nouvelle frame du jeu
     *
     * @returns {FruitsManager}
     */
    onRequestAnimFrame() {
        this.frames++;
        /* Gestion des secondes */
        var date = +new Date();
        /* Un nouveau fruit au bout de 30 secondes */
        if (!this.hasFruit && this.frames > FruitsManager.APPEARANCE_INTEVERVAL)
            this.newFruit();
        else if (this.hasFruit && this.frames > FruitsManager.APPEARANCE_DURATION)
            this.removeFruit();
        return this;
    }
    /**
     * Ajoute un fruit
     *
     * @returns {FruitsManager}
     */
    newFruit() {
        /* Redémarrage du compteur */
        this.frames = 0;
        this.hasFruit = true;
        /* Les proba de chaque fruit, en se basant à 1 seule chance pour la clé */
        var keyProbability = 1;
        var bellProbability = keyProbability + Key.SCORE_VALUE / Bell.SCORE_VALUE;
        var galaxianProbability = bellProbability + Key.SCORE_VALUE / Galaxian.SCORE_VALUE;
        var melonProbability = galaxianProbability + Key.SCORE_VALUE / Melon.SCORE_VALUE;
        var appleProbability = melonProbability + Key.SCORE_VALUE / Apple.SCORE_VALUE;
        var orangeProbability = appleProbability + Key.SCORE_VALUE / Orange.SCORE_VALUE;
        var strawberryProbability = orangeProbability + Key.SCORE_VALUE / Strawberry.SCORE_VALUE;
        var cherryProbability = strawberryProbability + Key.SCORE_VALUE / Cherry.SCORE_VALUE;
        /* Récupération dans l'interval trouvé */
        var random = Math.round(Math.random() * (cherryProbability - keyProbability) + keyProbability);
        var fruit;
        /* Instanciation du bon fruit */
        if (random <= keyProbability)
            fruit = new Key();
        else if (random <= bellProbability)
            fruit = new Bell();
        else if (random <= galaxianProbability)
            fruit = new Galaxian();
        else if (random <= melonProbability)
            fruit = new Melon();
        else if (random <= appleProbability)
            fruit = new Apple();
        else if (random <= orangeProbability)
            fruit = new Orange();
        else if (random <= strawberryProbability)
            fruit = new Strawberry();
        else
            fruit = new Cherry();
        /* Dispatch event pour que le jeu l'ajoute */
        var event = new CustomEvent('NewFruit', { 'detail': fruit });
        Jeu.ELEMENT.dispatchEvent(event);
        return this;
    }
    /**
     * Supprime un fruit
     *
     * @returns {FruitsManager}
     */
    removeFruit() {
        /* Démarrage */
        this.init();
        /* Dispatch event */
        var event = new CustomEvent('RemoveFruit');
        Jeu.ELEMENT.dispatchEvent(event);
        return this;
    }
}
/* Chaque fois qu'un fruit apparait */
FruitsManager.APPEARANCE_INTEVERVAL = 30 * 60;
FruitsManager.APPEARANCE_DURATION = 10 * 60;
/**
 * Created by thiron on 13/03/2017.
 */
class Functions {
    /**
     * Tri un tableau
     *
     * @param a
     */
    static shuffle(a) {
        var j;
        var x;
        for (var i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
}
/**
 * Created by mac pro on 06/03/2017.
 */
/**
 * Un fantôme
 */
class Ghost {
    constructor() {
        this.frightenedColor = "#2121ff";
        /* Le décalage en px pour le mouvement */
        this.stepPx = Ghost.NORMAL;
        /* L'étape courante d'animation */
        this.stepNumber = 10;
        this.currentStep = 0;
    }
    /**
     * @param callback
     *
     * @returns {Ghost}
     */
    setCollideFunction(callback) {
        this.checkCollision = callback;
        return this;
    }
    /**
     * Initialise les fantômes
     * @returns {Ghost}
     */
    init() {
        this.canvas = new Canvas();
        this.canvas.setSize(Ghost.SIZE.w, Ghost.SIZE.h);
        /* Clone pour réinitialiser les params */
        this.coordinates = JSON.parse(JSON.stringify(this.startCoordinates));
        /* Dessin */
        this.draw();
        /* Mode par défaut */
        this.alternativeMode = null;
        this.direction = null;
        this.outFromHome = false;
        this.isFlashing = false;
        this.stepPx = Ghost.NORMAL;
        /* Pour que blinky aille à gauche obligatoirement */
        if (this instanceof Blinky) {
            this.direction = Directions.Right;
            this.outFromHome = true;
        }
        return this;
    }
    /**
     * Dessine le fantôme
     *
     * @returns {Ghost}
     */
    draw() {
        this.canvas.clear();
        var context = this.canvas.getContext();
        context.globalCompositeOperation = 'source-over';
        context.beginPath();
        /* Si retour à la maison, y'a juste les yeux */
        if (this.alternativeMode != Modes.GoingHome) {
            /* La tête */
            context.arc(Ghost.SIZE.w / 2, Ghost.SIZE.h / 2, Ghost.SIZE.w / 2, 0, 2 * Math.PI, false);
            /* Le corps */
            context.rect(0, Ghost.SIZE.h / 2, Ghost.SIZE.w, Ghost.SIZE.h / 2);
            var color = this.alternativeMode == Modes.Frightened ? this.frightenedColor : this.color;
            /* Si flash, couleur blanche */
            if (this.isFlashing && this.alternativeMode == Modes.Frightened) {
                var date = new Date();
                var milliseconds = date.getMilliseconds();
                color = milliseconds > 250 && milliseconds < 500 || milliseconds > 750 ? "#ffffff" : color;
            }
            /* Remplissage */
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }
        /* Les yeux */
        var x = 0;
        var y = 0;
        /* S'ils sont dans la maison, on génère une direction aléatoire */
        if (!this.outFromHome && this.alternativeMode != Modes.OutFromHome)
            this.getDirectionBasedOnTime();
        switch (this.direction) {
            case Directions.Left:
                x = -2;
                break;
            case Directions.Right:
                x = 2;
                break;
            case Directions.Up:
                y = -2;
                break;
            case Directions.Down:
                y = 2;
                break;
        }
        context.beginPath();
        if (this.alternativeMode == Modes.Frightened) {
            /* Petits yeux */
            context.arc(Ghost.SIZE.w / 2 - 4, Ghost.SIZE.h / 2 - 2, 2, 0, 2 * Math.PI, false);
            context.arc(Ghost.SIZE.w / 2 + 4, Ghost.SIZE.h / 2 - 2, 2, 0, 2 * Math.PI, false);
        }
        else {
            /* Yeux normaux */
            context.ellipse(Ghost.SIZE.w / 2 - 5 + x, Ghost.SIZE.h / 2 + y, 3, 4, 0, 2 * Math.PI, false);
            context.ellipse(Ghost.SIZE.w / 2 + 5 + x, Ghost.SIZE.h / 2 + y, 3, 4, 0, 2 * Math.PI, false);
        }
        /* Remplissage du blanc */
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
        /* Les pupilles si pas apeuré */
        if (this.alternativeMode != Modes.Frightened) {
            context.beginPath();
            context.ellipse(Ghost.SIZE.w / 2 - 5 + x * 2, Ghost.SIZE.h / 2 + y * 2, 1, 2, 0, 2 * Math.PI, false);
            context.ellipse(Ghost.SIZE.w / 2 + 5 + x * 2, Ghost.SIZE.h / 2 + y * 2, 1, 2, 0, 2 * Math.PI, false);
            /* Remplissage de la pupille */
            context.fillStyle = 'black';
            context.fill();
            context.closePath();
        }
        else {
            /* La bouche */
            context.beginPath();
            context.moveTo(6, Ghost.SIZE.h / 2 + 6);
            context.lineTo(8, Ghost.SIZE.h / 2 + 4);
            context.lineTo(10, Ghost.SIZE.h / 2 + 6);
            context.lineTo(12, Ghost.SIZE.h / 2 + 4);
            context.lineTo(14, Ghost.SIZE.h / 2 + 6);
            context.lineTo(16, Ghost.SIZE.h / 2 + 4);
            context.lineTo(18, Ghost.SIZE.h / 2 + 6);
            /* Remplissage */
            context.strokeStyle = 'white';
            context.stroke();
            context.closePath();
        }
        /* Changement de mode et ajout des pates */
        context.globalCompositeOperation = 'destination-out';
        /* Le nombre de pates */
        var legsNumber = this.currentStep >= this.stepNumber / 2 ? 3 : 4;
        var legWidth = Ghost.SIZE.w / legsNumber;
        var legHeight = 3;
        for (var i = 0; i < legsNumber; ++i) {
            context.beginPath();
            context.moveTo(i * Ghost.SIZE.w / legsNumber, Ghost.SIZE.h);
            context.lineTo(i * Ghost.SIZE.w / legsNumber + legWidth / 2, Ghost.SIZE.h - legHeight);
            context.lineTo(i * Ghost.SIZE.w / legsNumber + legWidth, Ghost.SIZE.h);
            context.closePath();
            /* Remplissage */
            context.fill();
        }
        return this;
    }
    /**
     * Renvoie la direction à prendre pour arriver le plus rapidement à la case ciblée
     *
     * @param destinationTileCoords La case à aller
     * @see https://en.wikipedia.org/wiki/Pathfinding
     *
     * @returns {number}
     */
    findBestPath(destinationTileCoords) {
        /* Les coordonnées de la case courante */
        var currentTileCoords = {
            x: this.coordinates.x / Tile.TILE_WIDTH,
            y: this.coordinates.y / Tile.TILE_WIDTH
        };
        /* Récupération du meilleur chemin */
        var pathFinder = new PathFinder();
        pathFinder.findPath(currentTileCoords, destinationTileCoords, this.checkCollision.bind(this), this.hasToGoBackwards.bind(this));
        /* Récupération de la bonne direction, par défaut la courante */
        var direction = this.direction;
        var nextTile = pathFinder.getNextTile();
        if (nextTile != null) {
            /* Gauche */
            if (currentTileCoords.x == nextTile.x + 1)
                direction = Directions.Left;
            /* Droite */
            if (currentTileCoords.x == nextTile.x - 1)
                direction = Directions.Right;
            /* Haut */
            if (currentTileCoords.y == nextTile.y + 1)
                direction = Directions.Up;
            /* Bas */
            if (currentTileCoords.y == nextTile.y - 1)
                direction = Directions.Down;
        }
        return direction;
    }
    /**
     * S'il doit faire demi-tour pour atteindre la case de destination
     *
     * @returns {boolean}
     */
    hasToGoBackwards(fromTile, toTile) {
        /* Gauche */
        if (fromTile.x == toTile.x + 1)
            return this.direction == Directions.Right;
        /* Droite */
        if (fromTile.x == toTile.x - 1)
            return this.direction == Directions.Left;
        /* Haut */
        if (fromTile.y == toTile.y + 1)
            return this.direction == Directions.Down;
        /* Bas */
        if (fromTile.y == toTile.y - 1)
            return this.direction == Directions.Up;
        return true;
    }
    /**
     * @param x
     *
     * @returns {Ghost}
     */
    setX(x) {
        this.coordinates.x = x;
        return this;
    }
    /**
     * Déplace le fantôme
     *  Tout droit si dans une case
     *  Appelle targetTile et findBestPath si c'est un croisement
     *
     * @param pacmanCenter
     * @param blinkyCoords
     *
     * @returns {Ghost}
     */
    move(pacmanCenter, blinkyCoords = null) {
        /* Pas de déplacement si à l'arrêt ou pas en train de sortir */
        if (!this.outFromHome && this.alternativeMode != Modes.OutFromHome)
            return this;
        /* Le mode, l'alertnatif prendra le dessus */
        var mode = this.alternativeMode || this.mode;
        /* Si dans une case */
        if (this.coordinates.x % Tile.TILE_WIDTH == 0 && this.coordinates.y % Tile.TILE_WIDTH == 0) {
            switch (mode) {
                /* Dans le coin attribué */
                case Modes.Scatter:
                    this.direction = this.findBestPath(this.cornerCoordinates);
                    break;
                case Modes.Chase:
                    /* Récupération de la bonne case */
                    var target = this.targetTile(pacmanCenter, blinkyCoords);
                    this.direction = this.findBestPath(target);
                    break;
                case Modes.Frightened:
                    /* Une case aléatoire */
                    var coords = TileFunctions.getTileCoordinates({
                        x: this.coordinates.x + Tile.TILE_WIDTH / 2,
                        y: this.coordinates.y + Tile.TILE_WIDTH / 2
                    });
                    /* Toutes les cases autour et la case finale */
                    var adjacentTiles = TileFunctions.getAdjacentTiles(coords);
                    var target;
                    /* Mélange des cases pour faire un chemin aléatoire quand il y aura plusieurs possibilités */
                    Functions.shuffle(adjacentTiles);
                    for (var i = 0; i < adjacentTiles.length; ++i) {
                        var collisionDetected = this.checkCollision(adjacentTiles[i].x, adjacentTiles[i].y);
                        if (!collisionDetected && !this.hasToGoBackwards(coords, adjacentTiles[i])) {
                            target = adjacentTiles[i];
                            break;
                        }
                    }
                    /* Changement de direction */
                    this.direction = this.findBestPath(target);
                    break;
                /* Sort de la maison */
                case Modes.OutFromHome:
                    var coords = {
                        x: this.coordinates.x / Tile.TILE_WIDTH,
                        y: this.coordinates.y / Tile.TILE_WIDTH
                    };
                    /* Case du milieu, sortie vers le haut */
                    if (coords.x == 7 && coords.y == 9)
                        this.direction = Directions.Up;
                    else if (coords.x == 7 && coords.y == 8) {
                        /* Signaler au manager qu'il est sorti */
                        var event = new CustomEvent('OutFromHome', { 'detail': this });
                        Jeu.ELEMENT.dispatchEvent(event);
                        /* Vitesse normale */
                        this.stepPx = Ghost.NORMAL;
                        /* Sorti */
                        this.outFromHome = true;
                        this.alternativeMode = null;
                        /* Forcément à gauche */
                        this.direction = Directions.Left;
                    }
                    else {
                        if (coords.x == 6)
                            this.direction = Directions.Right;
                        else if (coords.x == 8)
                            this.direction = Directions.Left;
                    }
                    break;
                case Modes.GoingHome:
                    /* La case */
                    var coords = {
                        x: this.coordinates.x / Tile.TILE_WIDTH,
                        y: this.coordinates.y / Tile.TILE_WIDTH
                    };
                    /* Aller au milieu */
                    this.direction = this.findBestPath({
                        x: 7,
                        y: 8
                    });
                    /* Case du milieu, il descend */
                    if (coords.x == 7 && coords.y == 8)
                        this.direction = Directions.Down;
                    /* Rentré */
                    if (coords.x == 7 && coords.y == 9) {
                        this.direction = Directions.Up;
                        this.changeAlternativeMode(null);
                        this.getOutFromHome();
                    }
                    break;
            }
        }
        /* Déplacement */
        switch (this.direction) {
            case Directions.Left:
                this.coordinates.x -= this.stepPx;
                break;
            case Directions.Right:
                this.coordinates.x += this.stepPx;
                break;
            case Directions.Up:
                this.coordinates.y -= this.stepPx;
                break;
            case Directions.Down:
                this.coordinates.y += this.stepPx;
                break;
        }
        /* Mangé ou a mangé */
        this.checkEatOrEaten(pacmanCenter);
        return this;
    }
    /**
     * Fait l'animation du fantôme dans le canvas
     *
     * @returns {Ghost}
     */
    animate() {
        /* Augmentation de l'étape */
        this.currentStep++;
        /* Réinitialisation de l'étape si besoin */
        if (this.currentStep % this.stepNumber == 0)
            this.currentStep = 0;
        /* Dessin dans le canvas */
        this.draw();
        return this;
    }
    /**
     * Sort le fantôme de la maison
     *
     * @returns {Ghost}
     */
    getOutFromHome() {
        this.alternativeMode = Modes.OutFromHome;
        this.stepPx = Ghost.OUT_FROM_HOME;
        return this;
    }
    /**
     * Modifie le mode
     *
     * @param mode
     *
     * @returns {Ghost}
     */
    changeMode(mode) {
        /* Changement */
        this.mode = mode;
        /* Si scatter, changement de direction */
        if (this.mode == Modes.Scatter) {
            switch (this.direction) {
                case Directions.Left:
                    this.direction = Directions.Right;
                    break;
                case Directions.Right:
                default:
                    this.direction = Directions.Left;
                    break;
                case Directions.Up:
                    this.direction = Directions.Down;
                    break;
                case Directions.Down:
                    this.direction = Directions.Up;
                    break;
            }
        }
        return this;
    }
    /**
     * Changement du mode alternatif
     *
     * @param mode
     *
     * @returns {Ghost}
     */
    changeAlternativeMode(mode) {
        /* Que si pas dans un mode alternatif */
        if (this.alternativeMode == null || mode == Modes.GoingHome) {
            /* Si le mode alternatif est frightened, il faut qu'il soit sorti */
            if (mode == Modes.Frightened && this.outFromHome || mode != Modes.Frightened) {
                this.alternativeMode = mode;
                /* Si frightened, réduction de la vitesse */
                if (mode == Modes.Frightened)
                    this.stepPx = Ghost.FRIGHTENED;
                else if (mode == Modes.GoingHome)
                    this.stepPx = Ghost.GOING_HOME;
            }
        }
        else if (this.alternativeMode == Modes.Frightened && mode == null) {
            this.alternativeMode = mode;
            /* Vitesse normale et pas de flash */
            this.stepPx = Ghost.NORMAL;
            this.isFlashing = false;
        }
        /* Vérification de l'intégrité des données (pas de pixels impairs) */
        this.checkCoordsIntegrity();
        return this;
    }
    /**
     * Vérifie que les données sont correctes et que y'a pas de cases impaires (sinon il pourra pas tourner)
     *
     * @returns {Ghost}
     */
    checkCoordsIntegrity() {
        /* Le reste à calculer */
        var modulo = this.alternativeMode == Modes.GoingHome ? Ghost.GOING_HOME : Ghost.NORMAL;
        switch (this.direction) {
            case Directions.Left:
            case Directions.Right:
            default:
                this.coordinates.x -= this.coordinates.x % modulo;
                break;
            case Directions.Up:
            case Directions.Down:
                this.coordinates.y -= this.coordinates.y % modulo;
                break;
        }
        return this;
    }
    /**
     * Renvoie les coordonnées
     *
     * @returns {Point}
     */
    getCoordinates() {
        return this.coordinates;
    }
    /**
     * Renvoie le canvas
     *
     * @returns {Canvas}
     */
    getCanvas() {
        return this.canvas;
    }
    /**
     * @returns {HTMLCanvasElement}
     */
    getCanvasElem() {
        return this.canvas.getElement();
    }
    /**
     * Ralenti le fantome
     *
     * @returns {Ghost}
     */
    slow() {
        /* Il ralenti que s'il rentre pas */
        if (this.alternativeMode != Modes.GoingHome)
            this.stepPx = Ghost.FRIGHTENED;
        return this;
    }
    /**
     * Accélère le fantome
     *
     * @returns {Ghost}
     */
    speedUp() {
        /* Il accélère que s'il est pas apeuré et qu'il rentre pas */
        if (this.alternativeMode != Modes.Frightened && this.alternativeMode != Modes.GoingHome)
            this.stepPx = Ghost.NORMAL;
        return this;
    }
    /**
     * Vérifie que pacman est mangé ou a été mangé
     *
     * @param pacmanCenter
     *
     * @returns {Ghost}
     */
    checkEatOrEaten(pacmanCenter) {
        var center = {
            x: this.coordinates.x + Tile.TILE_WIDTH / 2,
            y: this.coordinates.y + Tile.TILE_WIDTH / 2
        };
        /* Mangé */
        if (Math.abs(pacmanCenter.x - center.x) < 10 && Math.abs(pacmanCenter.y - center.y) < 10) {
            /* Dispatch que s'il rentre pas */
            if (this.alternativeMode != Modes.GoingHome) {
                var eventName = this.alternativeMode == Modes.Frightened ? 'GhostEaten' : 'PacmanEaten';
                var event = new Event(eventName);
                Jeu.ELEMENT.dispatchEvent(event);
            }
            /* Retour à la maison */
            if (this.alternativeMode == Modes.Frightened)
                this.changeAlternativeMode(Modes.GoingHome);
        }
        return this;
    }
    /**
     * Fait flasher
     *
     * @returns {Ghost}
     */
    flash(state) {
        this.isFlashing = state;
        return this;
    }
    /**
     * Renvoie une direction basée sur le temps
     *
     * @returns {Ghost}
     */
    getDirectionBasedOnTime() {
        var directions = [
            Directions.Left,
            Directions.Right,
            Directions.Up,
            Directions.Down
        ];
        var date = new Date();
        var rand = Math.floor(Math.random() * directions.length);
        var randDate = Math.floor(Math.random() * 1000);
        /* Si dans une période de 10ms pour pas faire de flickering */
        if (date.getMilliseconds() >= randDate && date.getMilliseconds() <= randDate + 10)
            this.direction = directions[rand];
        return this;
    }
}
Ghost.SIZE = {
    w: 24,
    h: 24
};
/* Les différentes vitesses */
Ghost.OUT_FROM_HOME = 1;
Ghost.NORMAL = 2;
Ghost.FRIGHTENED = 1;
Ghost.GOING_HOME = 4;
/**
 * Fantôme rose
 *  Prend pacman en ambuscade (vise 4 cases devant pacman)
 *  Coin en haut à gauche
 *  Sort immédiatement
 */
class Pinky extends Ghost {
    constructor() {
        super();
        this.mode = null;
        this.startCoordinates = {
            x: 7 * Tile.TILE_WIDTH,
            y: 9 * Tile.TILE_WIDTH
        };
        this.cornerCoordinates = {
            x: 0,
            y: 0
        };
        this.color = '#fdc3d4';
    }
    /**
     * Détermine la case à laquelle se rendre
     *
     * @param pacmanCenter
     *
     * @returns {null}
     */
    targetTile(pacmanCenter) {
        /* La case de pacman */
        var pacmanTile = TileFunctions.getTileCoordinates(pacmanCenter);
        /* Viser 4 cases devant */
        switch (pacmanCenter.direction) {
            case Directions.Left:
                pacmanTile.x = Math.max(0, pacmanTile.x - 4);
                break;
            case Directions.Right:
                pacmanTile.x = Math.min(14, pacmanTile.x + 4);
                break;
            case Directions.Up:
                pacmanTile.y = Math.max(0, pacmanTile.y - 4);
                break;
            case Directions.Down:
                pacmanTile.y = Math.min(19, pacmanTile.y + 4);
                break;
        }
        return pacmanTile;
    }
}
/**
 * Fantôme rouge
 *  Vise la case de pacman en permanence
 *  Coin en haut à droite
 *  Sorti dès le début
 */
class Blinky extends Ghost {
    constructor() {
        super();
        this.mode = null;
        this.startCoordinates = {
            x: 7 * Tile.TILE_WIDTH,
            y: 8 * Tile.TILE_WIDTH
        };
        this.cornerCoordinates = {
            x: 14,
            y: 0
        };
        this.color = '#fd3b11';
    }
    /**
     * Détermine la case à laquelle se rendre
     *
     * @param pacmanCenter
     *
     * @returns {null}
     */
    targetTile(pacmanCenter) {
        return TileFunctions.getTileCoordinates(pacmanCenter);
    }
}
/**
 * Fantôme bleu
 *  Vise 2 cases devant pacman et fait un calcul de vecteur en fonction de la position de Blinky
 *  Coin en bas à droite
 *  Sort dès qu'il y a 30 points mangés
 */
class Inky extends Ghost {
    constructor() {
        super();
        this.mode = null;
        this.startCoordinates = {
            x: 6 * Tile.TILE_WIDTH,
            y: 9 * Tile.TILE_WIDTH
        };
        this.cornerCoordinates = {
            x: 14,
            y: 19
        };
        this.color = '#49dfca';
    }
    /**
     * Détermine la case à laquelle se rendre
     *
     * @param pacmanCenter
     * @param blinkyCoords
     *
     * @returns {null}
     */
    targetTile(pacmanCenter, blinkyCoords) {
        /* La case de blinky */
        var a = TileFunctions.getTileCoordinates({
            x: blinkyCoords.x + Tile.TILE_WIDTH / 2,
            y: blinkyCoords.y + Tile.TILE_WIDTH / 2
        });
        /* La case de pacman */
        var b = TileFunctions.getTileCoordinates(pacmanCenter);
        /* Viser 2 cases devant */
        switch (pacmanCenter.direction) {
            case Directions.Left:
                b.x = Math.max(0, b.x - 2);
                break;
            case Directions.Right:
                b.x = Math.min(14, b.x + 2);
                break;
            case Directions.Up:
                b.y = Math.max(0, b.y - 2);
                break;
            case Directions.Down:
                b.y = Math.min(19, b.y + 2);
                break;
        }
        /* Le vecteur */
        var ab = {
            x: b.x - a.x,
            y: b.y - a.y
        };
        /* La nouvelle case */
        var target = {
            x: ab.x + b.x,
            y: ab.y + b.y
        };
        /* Limitation des valeurs */
        target.x = Math.max(0, target.x);
        target.x = Math.min(14, target.x);
        target.y = Math.max(0, target.y);
        target.y = Math.min(19, target.y);
        return target;
    }
}
/**
 * Fantôme orange
 *  S'il est a plus de 8 cases de pacman, il vise la case, sinon retour dans le coin
 *  Coin en bas à gauche
 *  Sort dès qu'il y a 1/3 des points mangés
 */
class Clyde extends Ghost {
    constructor() {
        super();
        this.mode = null;
        this.startCoordinates = {
            x: 8 * Tile.TILE_WIDTH,
            y: 9 * Tile.TILE_WIDTH
        };
        this.cornerCoordinates = {
            x: 0,
            y: 19
        };
        this.color = '#ffbf57';
    }
    /**
     * Détermine la case à laquelle se rendre
     *
     * @param pacmanCenter
     *
     * @returns {null}
     */
    targetTile(pacmanCenter) {
        /* Pacman */
        var pacmanTileCoords = TileFunctions.getTileCoordinates(pacmanCenter);
        /* La case courante */
        var currentTileCoords = TileFunctions.getTileCoordinates({
            x: this.coordinates.x + Tile.TILE_WIDTH / 2,
            y: this.coordinates.y + Tile.TILE_WIDTH / 2
        });
        /* Le chemin */
        var pathFinder = new PathFinder();
        pathFinder.findPath(currentTileCoords, pacmanTileCoords, this.checkCollision.bind(this), this.hasToGoBackwards.bind(this));
        /* Récupération de la distance */
        var distance = pathFinder.getDistance();
        /* Si supérieur à 8, il vise pacman, sinon retour au coin */
        return distance > 8 ? pacmanTileCoords : this.cornerCoordinates;
    }
}
/**
 * Created by mac pro on 06/03/2017.
 */
class GhostsManager {
    constructor() {
        /* Initialisation des intervalles et autres */
        this.chaseInterval = 20 * 60;
        this.scatterInterval = 7 * 60;
        this.frightenedInterval = 7 * 60;
        /* Instanciation des fantômes */
        this.pinky = new Pinky();
        this.blinky = new Blinky();
        this.inky = new Inky();
        this.clyde = new Clyde();
        /* Listener sorti de la maison */
        Jeu.ELEMENT.addEventListener('OutFromHome', this.ghostGotOut.bind(this), false);
        Jeu.ELEMENT.addEventListener('InkyCanGo', this.inkyCanGo.bind(this), false);
        Jeu.ELEMENT.addEventListener('ClydeCanGo', this.clydeCanGo.bind(this), false);
        Jeu.ELEMENT.addEventListener('GhostEaten', this.ghostEaten.bind(this), false);
    }
    /**
     * @param callback
     *
     * @returns {GhostsManager}
     */
    setCollideFunction(callback) {
        this.pinky.setCollideFunction(callback);
        this.blinky.setCollideFunction(callback);
        this.inky.setCollideFunction(callback);
        this.clyde.setCollideFunction(callback);
        return this;
    }
    /**
     * Initialise tous les fantômes
     *
     * @returns {GhostsManager}
     */
    init() {
        this.waveNumber = 1;
        this.mode = Modes.Scatter;
        this.areFrightened = false;
        /* Initialisation des fantômes et des canvas */
        this.pinky.init();
        this.blinky.init();
        this.inky.init();
        this.clyde.init();
        this.frames = 0;
        this.frightenedFrames = 0;
        this.numberEaten = 0;
        /* Changement du mode */
        this.changeMode(this.mode);
        /* Pinky doit sortir immédiatement */
        this.pinky.getOutFromHome();
        return this;
    }
    /**
     * Change de mode si besoin et déplace les fantômes
     *
     * @param pacmanCenter
     *
     * @returns {GhostsManager}
     */
    moveGhosts(pacmanCenter) {
        if (!this.areFrightened)
            this.frames++;
        else
            this.frightenedFrames++;
        /* Gestion du mode frightened */
        var mode = this.areFrightened ? Modes.Frightened : this.mode;
        /* Vérification du chrono */
        switch (mode) {
            case Modes.Chase:
                /* Si intervalle atteint et 4e vague pas dépassée */
                if (this.frames > this.chaseInterval && this.waveNumber < 4) {
                    this.changeMode(Modes.Scatter);
                    /* Modification de la vague */
                    this.waveNumber++;
                    /* Diminution des intervalles */
                    if (this.waveNumber > 2)
                        this.scatterInterval = 5 * 60;
                    /* Réinitialisation du chrono */
                    this.frames = 0;
                }
                break;
            case Modes.Scatter:
                if (this.frames > this.scatterInterval) {
                    this.changeMode(Modes.Chase);
                    /* Réinitialisation du chrono */
                    this.frames = 0;
                }
                break;
            case Modes.Frightened:
                if (this.frightenedFrames > this.frightenedInterval) {
                    /* Comme si on avait stoppé le timer précédent */
                    this.areFrightened = false;
                    this.numberEaten = 0;
                    /* Suppression du mode alternatif */
                    this.changeAlternativeMode(null);
                }
                else if (this.frightenedFrames > this.frightenedInterval - 2 * 60)
                    this.flashGhosts();
                break;
        }
        /* Déplacements */
        this.pinky.move(pacmanCenter);
        this.blinky.move(pacmanCenter);
        this.inky.move(pacmanCenter, this.blinky.getCoordinates());
        this.clyde.move(pacmanCenter);
        return this;
    }
    /**
     * Anime les fantômes dans leur canvas
     *
     * @returns {GhostsManager}
     */
    animateGhosts() {
        /* Changement de mode si intervalle dépassé */
        this.pinky.animate();
        this.blinky.animate();
        this.inky.animate();
        this.clyde.animate();
        return this;
    }
    /**
     * Change le mode et le numéro de la vague si besoin lorsque l'intervalle est atteint
     *
     * @param mode
     *
     * @returns {GhostsManager}
     */
    changeMode(mode) {
        this.mode = mode;
        /* Changement pour les fantômes */
        this.pinky.changeMode(this.mode);
        this.blinky.changeMode(this.mode);
        this.inky.changeMode(this.mode);
        this.clyde.changeMode(this.mode);
        return this;
    }
    /**
     * Change le mode alternatif
     *
     * @param mode
     *
     * @returns {GhostsManager}
     */
    changeAlternativeMode(mode) {
        /* Changement pour les fantômes */
        this.pinky.changeAlternativeMode(mode);
        this.blinky.changeAlternativeMode(mode);
        this.inky.changeAlternativeMode(mode);
        this.clyde.changeAlternativeMode(mode);
        return this;
    }
    /**
     * Fait flasher les fantômes
     *
     * @returns {GhostsManager}
     */
    flashGhosts(state = true) {
        this.pinky.flash(state);
        this.blinky.flash(state);
        this.inky.flash(state);
        this.clyde.flash(state);
        return this;
    }
    /**
     * Retourne la position des fantômes et leur canvas pour les redissiner
     *
     * @returns {{canvas: Canvas, coords: Point}[]}
     */
    getGhosts() {
        return [
            this.pinky,
            this.blinky,
            this.inky,
            this.clyde
        ];
    }
    /**
     * Un fantôme est sorti
     *
     * @returns {GhostsManager}
     */
    ghostGotOut(e) {
        e.detail.changeMode(this.mode);
        return this;
    }
    /**
     * Inky peut sortir de la maison
     *
     * @returns {GhostsManager}
     */
    inkyCanGo() {
        this.inky.getOutFromHome();
        return this;
    }
    /**
     * Clyde peut sortir de la maison
     *
     * @returns {GhostsManager}
     */
    clydeCanGo() {
        this.clyde.getOutFromHome();
        return this;
    }
    /**
     * Change de mode
     *
     * @returns {GhostsManager}
     */
    goToFrightenedMode() {
        /* Réinit des frames */
        this.frightenedFrames = 0;
        /* Changement si pas déjà dans le mode */
        this.changeAlternativeMode(Modes.Frightened);
        this.areFrightened = true;
        /* Ils ne clignottent plus */
        this.flashGhosts(false);
        return this;
    }
    /**
     * Un fantôme a été mangé
     *
     * @returns {GhostsManager}
     */
    ghostEaten() {
        this.numberEaten++;
        /* Information de jeu pour augmenter le score */
        var event = new CustomEvent('UpdateScoreAfterGhostEaten', { 'detail': this.numberEaten });
        Jeu.ELEMENT.dispatchEvent(event);
        return this;
    }
}
/* Le nombre de point que pacman doit manger pour que certains fantômes sortent */
GhostsManager.INKY_DOT_TO_GO = 30;
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Created by mac pro on 05/03/2017.
 */
/**
 * Gère le score
 */
class Score {
    /**
     * Init
     *
     * @returns {Score}
     */
    init() {
        this.score = 0;
        return this;
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
     * @param tile
     *
     * @returns {Score}
     */
    update(tile) {
        if (tile.getPacDot() instanceof PacDot)
            this.score += tile.getPacDot().getScoreValue();
        return this;
    }
    /**
     * Met à jour le score
     *
     * @param ghostEatenNumber
     *
     * @returns {Score}
     */
    updateWithGhost(ghostEatenNumber) {
        switch (ghostEatenNumber) {
            case 1:
                this.score += 200;
                break;
            case 2:
                this.score += 400;
                break;
            case 3:
                this.score += 800;
                break;
            case 4:
                this.score += 1600;
                break;
        }
        return this;
    }
}
///<reference path='Score.ts' />
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Initialise le jeu, créer les niveaux, lance pacman, les fantomes,...
 *
 * Liens :
 *  http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
 *  http://www.grospixels.com/site/trucpac.php
 */
class Jeu {
    constructor() {
        this.frames = 0;
        this.playing = false;
        this.level = 1;
        /* Ajout des listeners */
        this.addListeners();
        /* Init des elem */
        this.canvas = new Canvas(document.querySelector("canvas"));
        this.levelManager = new LevelManager();
        this.fruitsManager = new FruitsManager();
        this.ghostsManager = new GhostsManager();
        this.score = new Score();
        this.pacman = new Pacman();
    }
    /**
     * Initialise le jeu
     */
    init(newGame = true) {
        /* Nettoyage du canvas */
        this.canvas.clear();
        /* Les niveaux */
        this.levelManager.init();
        this.levelManager.draw(this.canvas);
        /* Le ghosts manager */
        this.ghostsManager.setCollideFunction(this.checkCollision.bind(this));
        this.ghostsManager.init();
        if (newGame)
            this.score.init();
        /* Dessin du haut */
        this.drawTop();
        /* Pacman */
        this.pacman.setCollideFunction(this.checkCollision.bind(this));
        this.pacman.init();
        this.pacmanEaten = false;
        /* Dessin dans le canvas principal */
        this.pacman.draw();
        var coords = this.pacman.getCoordinates();
        var margin = (Tile.TILE_WIDTH - Pacman.SIZE.w) / 2;
        this.canvas.getContext().drawImage(this.pacman.getCanvasElem(), coords.x + margin, coords.y + margin + Jeu.TOP_HEIGHT);
        /* Récupération de toutes les power pellet pour les faire clignoter */
        this.powerPelletTiles = this.levelManager.getPowerPellet();
        /* Date de début pour le fruit manager */
        this.fruitsManager.init();
        return this;
    }
    /**
     * Ajoute les listeners
     *
     * @returns {Jeu}
     */
    addListeners() {
        /* Listener pour un point mangée */
        Jeu.ELEMENT.addEventListener('PacDotEatenProcessed', this.onPacDotEaten.bind(this), false);
        /* Listener pour niveau terminé */
        Jeu.ELEMENT.addEventListener('LevelFinished', this.onLevelFinished.bind(this), false);
        /* Listener pour un nouveau fruit */
        Jeu.ELEMENT.addEventListener('NewFruit', this.onNewFruit.bind(this), false);
        /* Listener pour un fruit supprimé (pas mangé) */
        Jeu.ELEMENT.addEventListener('RemoveFruit', this.onRemoveFruit.bind(this), false);
        /* Pacman mangé */
        Jeu.ELEMENT.addEventListener('PacmanEaten', this.onPacmanEaten.bind(this), false);
        /* Pacman mort */
        Jeu.ELEMENT.addEventListener('PacmanDied', this.onPacmanDead.bind(this), false);
        /* Fantôme(s) mangé */
        Jeu.ELEMENT.addEventListener('UpdateScoreAfterGhostEaten', this.onGhostEaten.bind(this), false);
        /* Play */
        document.querySelector('.jouer').addEventListener('click', this.play.bind(this), false);
        document.querySelector('.continuer').addEventListener('click', this.play.bind(this), false);
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        return this;
    }
    /**
     * Démarre le jeu et cache le bouton
     *
     * @returns {Jeu}
     */
    play() {
        document.querySelector('.jouer').style.display = "none";
        document.querySelector('.continuer').style.display = "none";
        /* Pour redémarrer */
        this.playing = true;
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
        var interval = this.pacmanEaten ? Jeu.EATEN_INTERVAL : Jeu.INTERVAL;
        /* Si l'interval a été atteint */
        if (this.canvas != null && this.frames >= interval) {
            if (!this.pacmanEaten) {
                /* Nettoyage des éléments pour pas avoir de carrés qui trainent */
                this.clearAll();
                /* Dessin du fruit */
                this.onNewFruit(null);
                /* Clignotement des points */
                this.flashPowerPellet();
                /* Dessin de la porte de sortie des fantomes */
                this.drawEscapeDoor();
                /* Animation de pacman */
                this.animatePacman();
                /* Animation des fantômes */
                this.animateGhosts();
                /* Mise à jour du score */
                this.drawScore();
                /* Notification de la nouvelle frame au fruitsManager */
                this.fruitsManager.onRequestAnimFrame();
            }
            else {
                /* Nettoyage */
                this.clearAll();
                /* Animation de pacman */
                this.animatePacman();
            }
            /* Redémarrage */
            this.frames = 0;
        }
        /* Animation suivante */
        if (this.playing === true)
            requestAnimFrame(this.draw.bind(this));
        /* Incrémentation */
        this.frames++;
        return this;
    }
    /**
     * Nettoie tous les éléments avant de les redessiner (pacman et fantômes)
     *
     * @returns {Jeu}
     */
    clearAll() {
        var context = this.canvas.getContext();
        var pacman = (Tile.TILE_WIDTH - Ghost.SIZE.w) / 2;
        var ghost = (Tile.TILE_WIDTH - Ghost.SIZE.w) / 2;
        var coords = this.pacman.getCoordinates();
        /* Suppression de pacman */
        context.clearRect(coords.x + pacman, coords.y + pacman + Jeu.TOP_HEIGHT, Pacman.SIZE.w, Pacman.SIZE.h);
        /* Suppression des fantômes */
        var ghosts = this.ghostsManager.getGhosts();
        for (var i = 0, l = ghosts.length; i < l; ++i) {
            var obj = ghosts[i];
            context.clearRect(obj.getCoordinates().x + ghost, obj.getCoordinates().y + ghost + Jeu.TOP_HEIGHT, Ghost.SIZE.w, Ghost.SIZE.h);
            /* Suppression de la case derrière */
            this.drawCurrentPacDot(TileFunctions.getTileCoordinates({
                x: obj.getCoordinates().x + Tile.TILE_WIDTH / 2,
                y: obj.getCoordinates().y + Tile.TILE_WIDTH / 2
            }), true);
        }
        /* Suppression de la case derrière pacman */
        this.drawCurrentPacDot(this.pacman.getPreviousTileCoords(), true);
        return this;
    }
    /**
     * Anime pacman et donne les instructions
     *
     * @returns {Jeu}
     */
    animatePacman() {
        var pacman = this.pacman;
        var coords = pacman.getCoordinates();
        /* Pour centrer dans la case */
        var margin = (Tile.TILE_WIDTH - Pacman.SIZE.w) / 2;
        var context = this.canvas.getContext();
        /* Instruction de modification des coordonées */
        if (!this.pacmanEaten) {
            pacman.move();
            /* Instruction d'animation */
            pacman.animate();
            /* Dessine la case courante si le point a pas été mangé pour pas le couper */
            this.drawCurrentPacDot(pacman.getPreviousTileCoords());
        }
        else
            this.pacman.die();
        /* Dessin dans le canvas principal */
        if (this.playing === true)
            context.drawImage(pacman.getCanvasElem(), coords.x + margin, coords.y + margin + Jeu.TOP_HEIGHT);
        /* Gestion du tunnel */
        Tunnel.checkEntry(pacman, context, margin);
        return this;
    }
    /**
     * Anime les fantômes
     *
     * @returns {Jeu}
     */
    animateGhosts() {
        var context = this.canvas.getContext();
        var margin = (Tile.TILE_WIDTH - Ghost.SIZE.w) / 2;
        var ghosts = this.ghostsManager.getGhosts();
        var coords = this.pacman.getCoordinates();
        /* Déplacement des fantômes en passant le centre de pacman en paramètre */
        this.ghostsManager.moveGhosts({
            x: coords.x + Tile.TILE_WIDTH / 2,
            y: coords.y + Tile.TILE_WIDTH / 2,
            direction: this.pacman.getDirection()
        });
        /* Anime les fantômes */
        this.ghostsManager.animateGhosts();
        /* Redessiner les fantômes, après pour pas faire disparaître un fantome qui en suit un autre */
        for (var i = 0, l = ghosts.length; i < l; ++i) {
            var obj = ghosts[i];
            /* Redessiner la case derrière */
            this.drawCurrentPacDot(TileFunctions.getTileCoordinates({
                x: obj.getCoordinates().x + Tile.TILE_WIDTH / 2,
                y: obj.getCoordinates().y + Tile.TILE_WIDTH / 2
            }));
            /* Dessin des fantômes */
            context.drawImage(obj.getCanvas().getElement(), obj.getCoordinates().x + margin, obj.getCoordinates().y + margin + Jeu.TOP_HEIGHT);
            /* Gestion du tunnel */
            Tunnel.checkEntry(obj, context, margin);
        }
        return this;
    }
    /**
     * Dessine un point si il a pas été mangé
     *
     * @returns {Jeu}
     */
    drawCurrentPacDot(coords, removeOnly = false) {
        /* La case de pacman */
        var margin = 5;
        /* Récupération de la case courante */
        var tiles = this.levelManager.getTiles();
        var currentTile = tiles[coords.y] != void 0 ? tiles[coords.y][coords.x] : null;
        /* Tile ok */
        if (currentTile != null && currentTile.hasPacDot()) {
            /* Dessin que si pacdot */
            if (!(currentTile.getPacDot() instanceof Fruit) && !(currentTile.getPacDot() instanceof PowerPellet)) {
                /* Suppression du point */
                if (removeOnly)
                    this.canvas.getContext().clearRect(coords.x * Tile.TILE_WIDTH + margin, coords.y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT, 30, 30);
                /* Dessin */
                this.levelManager.drawPacDot(this.canvas, currentTile);
            }
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
        /* Trous pour le tunnel */
        context.clearRect(15 * Tile.TILE_WIDTH - 5, 11 * Tile.TILE_WIDTH + 2, Tile.TILE_WIDTH, Tile.TILE_WIDTH - 4);
        context.clearRect(-1 * Tile.TILE_WIDTH + 5, 11 * Tile.TILE_WIDTH + 2, Tile.TILE_WIDTH, Tile.TILE_WIDTH - 4);
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
        context.fillText("Niveau " + this.level, this.canvas.getElement().width - 10, Jeu.TOP_HEIGHT / 2 + 5);
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
        context.clearRect(7 * Tile.TILE_WIDTH, 10 * Tile.TILE_WIDTH - 5, Tile.TILE_WIDTH, Tile.TILE_WIDTH);
        /* Dessin de la ligne */
        context.beginPath();
        context.moveTo(7 * Tile.TILE_WIDTH, 10 * Tile.TILE_WIDTH);
        context.lineTo(8 * Tile.TILE_WIDTH, 10 * Tile.TILE_WIDTH);
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
        for (var i = 0, l = this.powerPelletTiles.length; i < l; ++i) {
            context.clearRect(this.powerPelletTiles[i].getCoordinates().x * Tile.TILE_WIDTH + margin, this.powerPelletTiles[i].getCoordinates().y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT, Tile.TILE_WIDTH / 2, Tile.TILE_WIDTH / 2);
        }
        /* Redessin */
        if (date.getMilliseconds() >= 500) {
            /* Dessin */
            for (var i = 0, l = this.powerPelletTiles.length; i < l; ++i)
                this.levelManager.drawPacDot(this.canvas, this.powerPelletTiles[i]);
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
        var tiles = this.levelManager.getTiles();
        return tiles[y] == void 0 || tiles[y][x] === void 0 || tiles[y][x].isAWall();
    }
    /**
     * Mange le point, après avoir été traité par le levelManager pour libérer un fantôme
     *
     * @returns {Jeu}
     */
    onPacDotEaten(e) {
        /* Les coordonées de la case courante */
        var coords = e.detail;
        /* Récupération de la case courante */
        var tiles = this.levelManager.getTiles();
        var currentTile = tiles[coords.y][coords.x];
        /* Augmentation du score */
        if (currentTile != void 0) {
            this.score.update(currentTile);
            /* Si c'est un fruit, on recommence le compteur */
            if (currentTile.getPacDot() instanceof Fruit)
                this.fruitsManager.init();
            else if (currentTile.getPacDot() instanceof PowerPellet)
                this.ghostsManager.goToFrightenedMode();
            /* Suppression du point */
            currentTile.setPacDot(null);
        }
        return this;
    }
    /**
     * Niveau terminé !
     *
     * @returns {Jeu}
     */
    onLevelFinished() {
        /* Niveau suivant */
        this.level++;
        /* Redessin du haut avec le nouveau niveau */
        this.canvas.getContext().clearRect(0, 0, this.canvas.getElement().width, Jeu.TOP_HEIGHT);
        this.drawTop();
        /* Bouton continuer */
        document.querySelector('.continuer').style.display = 'block';
        /* Stop frames */
        this.playing = false;
        /* Reinit values */
        this.init(false);
        return this;
    }
    /**
     * Quand un fruit a été rajouté
     *
     * @param e
     *
     * @returns {Jeu}
     */
    onNewFruit(e) {
        /* Récupération de la case du milieu */
        var tiles = this.levelManager.getTiles();
        var middleTile = tiles[Pacman.BASE_Y][Pacman.BASE_X];
        /* Le fruit */
        var fruit = e === null ? middleTile.getPacDot() : e.detail;
        /* Ajout du fruit */
        if (e !== null || fruit !== null) {
            /* Nettoyage de la case au cas où */
            this.onRemoveFruit(false);
            var fruitWidth = Fruit.WIDTH;
            var margin = (Tile.TILE_WIDTH - fruitWidth) / 2;
            var index = 0;
            middleTile.setPacDot(fruit);
            if (fruit instanceof Strawberry)
                index = 1;
            else if (fruit instanceof Orange)
                index = 2;
            else if (fruit instanceof Apple)
                index = 3;
            else if (fruit instanceof Melon)
                index = 4;
            else if (fruit instanceof Galaxian)
                index = 5;
            else if (fruit instanceof Bell)
                index = 6;
            else if (fruit instanceof Key)
                index = 7;
            var img = document.querySelector('img');
            this.canvas.getContext().drawImage(
            /* L'image */
            img, 
            /* Où commencer le clip de l'image, dépend donc du fruit */
            index * fruitWidth, 0, 
            /* La taille du fruit */
            fruitWidth, fruitWidth, 
            /* La position dans le canvas */
            middleTile.getCoordinates().x * Tile.TILE_WIDTH + margin, middleTile.getCoordinates().y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT, 
            /*  La taille du fruit */
            fruitWidth, fruitWidth);
        }
        return this;
    }
    /**
     * Quand un fruit a été supprimé parce que pas mangé
     *
     * @returns {Jeu}
     */
    onRemoveFruit(removeFromTile = true) {
        var fruitWidth = Fruit.WIDTH;
        var margin = (Tile.TILE_WIDTH - fruitWidth) / 2;
        /* Suppression dans le canvas */
        this.canvas.getContext().clearRect(Pacman.BASE_X * Tile.TILE_WIDTH + margin, Pacman.BASE_Y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT, fruitWidth, fruitWidth);
        /* Récupération de la case du milieu et suppression du fruit */
        if (removeFromTile !== false) {
            var tiles = this.levelManager.getTiles();
            var middleTile = tiles[Pacman.BASE_Y][Pacman.BASE_X];
            middleTile.setPacDot(null);
        }
        return this;
    }
    /**
     * Pacman mangé !
     *
     * @returns {Jeu}
     */
    onPacmanEaten() {
        this.pacmanEaten = true;
        return this;
    }
    /**
     * Pacman est mort
     *
     * @returns {Jeu}
     */
    onPacmanDead() {
        /* Suppression de tous les events */
        document.querySelector('.jouer').style.display = "block";
        /* Réinitialisation */
        this.playing = false;
        this.init();
        return this;
    }
    /**
     * Un fantôme a été mangé
     *
     * @param e Contient le nombre de fantômes mangés
     *
     * @returns {Jeu}
     */
    onGhostEaten(e) {
        this.score.updateWithGhost(e.detail);
        return this;
    }
    /**
     * Gère le démarrage aux touches
     *
     * @param e
     *
     * @returns {Jeu}
     */
    onKeyDown(e) {
        /* Entrée ou espace */
        if (!this.playing && (e.keyCode == 32 || e.keyCode == 13))
            this.play();
        return this;
    }
}
/* Interval du request animation frame */
Jeu.INTERVAL = 1;
Jeu.EATEN_INTERVAL = 10;
/* Hauteur du panneau supérieur */
Jeu.TOP_HEIGHT = 40;
/* L'élément pour les events */
Jeu.ELEMENT = document.createElement('DIV');
/**
 * Created by thiron on 03/07/2015.
 */
class Tile {
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
     * @returns {Tile}
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
Tile.TILE_WIDTH = 40;
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
        /* Ajout de l'event des flèches */
        window.addEventListener("keydown", this.rotate.bind(this), false);
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
     * @param x
     *
     * @returns {Pacman}
     */
    setX(x) {
        this.coordinates.x = x;
        return this;
    }
    /**
     * @returns {Point}
     */
    getCoordinates() {
        return this.coordinates;
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
     * Renvoie la direction
     *
     * @returns {number}
     */
    getDirection() {
        return this.direction;
    }
    /**
     * Initialisation
     *
     * @returns {Pacman}
     */
    init() {
        this.coordinates = {
            x: 7 * Tile.TILE_WIDTH,
            y: 10 * Tile.TILE_WIDTH
        };
        this.currentStep = 0;
        this.stepNumber = 12;
        this.stepPx = 2;
        this.angle = 0;
        /* Création du canvas */
        this.canvas = new Canvas();
        /* Initialisation de la taille du canvas */
        this.canvas.setSize(Pacman.SIZE.w, Pacman.SIZE.h);
        /* Initialisation de la direction */
        this.direction = Directions.Right;
        this.nextDirection = this.direction;
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
        /* Le code de la flèche touchée */
        var code = e.keyCode;
        /* Selon la flèche, on change le direction */
        switch (code) {
            case 37:
                e.preventDefault();
                this.nextDirection = Directions.Left;
                break;
            case 38:
                e.preventDefault();
                this.nextDirection = Directions.Up;
                break;
            case 39:
                e.preventDefault();
                this.nextDirection = Directions.Right;
                break;
            case 40:
                e.preventDefault();
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
        var tileWidth = Tile.TILE_WIDTH;
        /* Pas de collision par défaut */
        var collisionWithNextDirection = false;
        var collisionWithCurrentDirection = false;
        /* Les nouvelles coordonnées */
        var newX = this.coordinates.x;
        var newY = this.coordinates.y;
        /* Si dans une case, on change de direction, si possible */
        if (this.coordinates.x % tileWidth == 0 && this.coordinates.y % tileWidth == 0) {
            /* Les cases suivantes en fonction de la direction courante et suivante */
            var nextTileCoordsWithNextDirection = this.getNextTileCoords(this.nextDirection);
            var nextTileCoordsWithCurrentDirection = this.getNextTileCoords(this.direction);
            /* Vérification que pas de collision */
            collisionWithNextDirection = this.checkCollision(nextTileCoordsWithNextDirection.x, nextTileCoordsWithNextDirection.y);
            collisionWithCurrentDirection = this.checkCollision(nextTileCoordsWithCurrentDirection.x, nextTileCoordsWithCurrentDirection.y);
            /* S'il va dans le tunnel */
            if (this.direction == Directions.Right && nextTileCoordsWithCurrentDirection.x == 15 && nextTileCoordsWithCurrentDirection.y == 10)
                collisionWithCurrentDirection = false;
            if (this.direction == Directions.Left && nextTileCoordsWithCurrentDirection.x == -1 && nextTileCoordsWithCurrentDirection.y == 10)
                collisionWithCurrentDirection = false;
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
        var percentInTile;
        switch (this.direction) {
            case Directions.Left:
                percentInTile = 100 - this.coordinates.x % tileWidth * 100 / tileWidth;
                newX -= this.stepPx;
                this.angle = 180;
                break;
            case Directions.Right:
                /* Bigfix traversée du tunnel, simulation d'une case en plus */
                percentInTile = this.coordinates.x < 0 ?
                    (this.coordinates.x + Tile.TILE_WIDTH) % tileWidth * 100 / tileWidth :
                    this.coordinates.x % tileWidth * 100 / tileWidth;
                newX += this.stepPx;
                this.angle = 0;
                break;
            case Directions.Up:
                percentInTile = 100 - this.coordinates.y % tileWidth * 100 / tileWidth;
                newY -= this.stepPx;
                this.angle = 270;
                break;
            case Directions.Down:
                percentInTile = this.coordinates.y % tileWidth * 100 / tileWidth;
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
        if (percentInTile == 75) {
            /* Les coordonées de la case */
            var currentTileCoords = this.getCurrentTileCoords();
            var event = new CustomEvent('PacDotEaten', { 'detail': currentTileCoords });
            Jeu.ELEMENT.dispatchEvent(event);
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
        var size = Pacman.SIZE;
        /* Largeur de la case */
        var tileWidth = Tile.TILE_WIDTH;
        /* Nettoyage */
        this.canvas.clear();
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
        var startAngle = (inclinaison2 + 1) * Math.PI;
        var endAngle = inclinaison * Math.PI;
        if (startAngle < Math.PI) {
            startAngle = 0;
            endAngle = 0;
            /* Event terminé */
            var event = new Event('PacmanDied');
            Jeu.ELEMENT.dispatchEvent(event);
        }
        /* Dessin */
        ctx.beginPath();
        ctx.arc(size.w / 2, size.h / 2, size.w / 2, startAngle, endAngle, true);
        ctx.lineTo(size.w / 2, size.h / 2);
        ctx.fill();
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
    getNextTileCoords(direction) {
        /* La case suivante avec la prochaine direction */
        var nextTileCoords = this.getCurrentTileCoords();
        /* Modification de la case suivante */
        switch (direction) {
            case Directions.Left:
                nextTileCoords.x--;
                break;
            case Directions.Right:
                nextTileCoords.x++;
                break;
            case Directions.Up:
                nextTileCoords.y--;
                break;
            case Directions.Down:
                nextTileCoords.y++;
                break;
        }
        return nextTileCoords;
    }
    /**
     * Récupère les coordonnées de la case courante
     *
     * @returns {Point}
     */
    getCurrentTileCoords() {
        return TileFunctions.getTileCoordinates({
            x: this.coordinates.x + Pacman.SIZE.w / 2,
            y: this.coordinates.y + Pacman.SIZE.h / 2
        });
    }
    /**
     * Récupère les coordonnées de la case précédente (celle derrière pacman)
     *
     * @returns {Point}
     */
    getPreviousTileCoords() {
        var coords = this.getCurrentTileCoords();
        /* Suivant la direction, c'est pas forcément la bonne case */
        switch (this.direction) {
            case Directions.Left:
                coords.x++;
                break;
            case Directions.Up:
                coords.y++;
                break;
        }
        if (coords.x == 15)
            coords.x = 0;
        return coords;
    }
    /**
     * Anime pacman pour mourir
     *
     * @returns {Pacman}
     */
    die() {
        /* Augmentation de l'étape */
        this.currentStep += 5;
        this.draw();
        return this;
    }
}
Pacman.BASE_X = 7;
Pacman.BASE_Y = 10;
Pacman.SIZE = {
    w: 24,
    h: 24
};
///<reference path='Tile.ts' />
///<reference path='Pacman.ts' />
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Gère le design des niveaux
 */
class Level {
    /**
     * Init
     *
     * @returns {Level}
     */
    init() {
        /* Les blocs avec cases */
        this.tiles = new Array(20);
        for (var i = 0, l = this.tiles.length; i < l; ++i) {
            this.tiles[i] = new Array(15);
            for (var j = 0, k = this.tiles[i].length; j < k; ++j) {
                this.tiles[i][j] = new Tile();
                this.tiles[i][j].setCoordinates(j, i);
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
            [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 10], [9, 11], [9, 12], [9, 13], [9, 14],
            [11, 0], [11, 1], [11, 2], [11, 3], [11, 5], [11, 6], [11, 7], [11, 8], [11, 9], [11, 11], [11, 12], [11, 13], [11, 14],
            [12, 3], [12, 7], [12, 11],
            [13, 1], [13, 3], [13, 5], [13, 7], [13, 9], [13, 11], [13, 13],
            [14, 3], [14, 5], [14, 7], [14, 9], [14, 11],
            [15, 1], [15, 5], [15, 9], [15, 13],
            [16, 1], [16, 2], [16, 3], [16, 4], [16, 5], [16, 7], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13],
            [17, 7],
            [18, 1], [18, 2], [18, 3], [18, 4], [18, 5], [18, 6], [18, 7], [18, 8], [18, 9], [18, 10], [18, 11], [18, 12], [18, 13]
        ];
        /* Le conteneur des fantomes */
        wallsCoordinates.push([9, 6]);
        wallsCoordinates.push([9, 7]);
        wallsCoordinates.push([9, 8]);
        /* Déclaration de tous les murs */
        for (i = 0, l = wallsCoordinates.length; i < l; ++i)
            this.tiles[wallsCoordinates[i][0]][wallsCoordinates[i][1]].isAWall(true);
        /* Sinon on met un point */
        for (i = 0, l = this.tiles.length; i < l; ++i) {
            for (j = 0, k = this.tiles[i].length; j < k; ++j) {
                /* Ajout du point */
                if (!this.tiles[i][j].isAWall())
                    this.tiles[i][j].setPacDot(new PacDot());
            }
        }
        /* Ajout des power pellet, y d'abord */
        this.tiles[2][1].setPacDot(new PowerPellet());
        this.tiles[2][13].setPacDot(new PowerPellet());
        this.tiles[12][2].setPacDot(new PowerPellet());
        this.tiles[12][12].setPacDot(new PowerPellet());
        /* Suppression de la case où y'a pacman */
        this.tiles[Pacman.BASE_Y][Pacman.BASE_X].setPacDot(null);
        return this;
    }
    /**
     * Retourne le tableau désiré
     *
     * @returns {Array<Array<Tile>>}
     */
    get() {
        return this.tiles;
    }
}
/**
 * Created by thiron on 03/07/2015.
 */
/**
 * Gère et dessine les niveaux
 */
class LevelManager {
    constructor() {
        this.level = new Level();
        this.pacDotNumber = 0;
        /* Listener food eaten */
        Jeu.ELEMENT.addEventListener('PacDotEaten', this.pacDotEaten.bind(this), false);
    }
    /**
     * Init
     *
     * @returns {LevelManager}
     */
    init() {
        this.level.init();
        return this;
    }
    /**
     * Dessine le niveau dans le canvas
     *
     * @param canvas
     */
    draw(canvas) {
        var tiles = this.getTiles();
        /* Réinitialisation du nombre de points */
        this.pacDotNumber = 0;
        /* Parcourt de chaque ligne */
        for (var i = 0, l = tiles.length; i < l; ++i) {
            var row = tiles[i];
            /* Parcourt de chaque case */
            for (var j = 0, k = row.length; j < k; ++j) {
                var tile = row[j];
                /* Détermination des bordures à supprimer */
                var leftTile = row[j - 1] || null;
                var rightTile = row[j + 1] || null;
                var upTile = tiles[i - 1] != null ? tiles[i - 1][j] : null;
                var downTile = tiles[i + 1] != null ? tiles[i + 1][j] : null;
                /* Suppression des bordures */
                tile.hasBorderLeft(leftTile != null && tile.isAWall() && !leftTile.isAWall());
                tile.hasBorderRight(rightTile != null && tile.isAWall() && !rightTile.isAWall());
                tile.hasBorderTop(upTile != null && tile.isAWall() && !upTile.isAWall());
                tile.hasBorderBottom(downTile != null && tile.isAWall() && !downTile.isAWall());
                /* Dessine la case courante et le point */
                this.drawTile(canvas, tile);
                if (tile.hasPacDot()) {
                    this.drawPacDot(canvas, tile);
                    /* Incrémentation du nombre de points */
                    this.pacDotNumber++;
                }
            }
        }
        /* Pour faire sortir les fantômes */
        this.pacDotNumberTotal = this.pacDotNumber;
        return this;
    }
    /**
     * Dessine la case courante
     *
     * @param canvas
     * @param tile
     */
    drawTile(canvas, tile) {
        var context = canvas.getContext();
        context.beginPath();
        context.strokeStyle = "#012EB6";
        context.lineWidth = 4;
        var j = Jeu.TOP_HEIGHT;
        var coordinates = tile.getCoordinates();
        if (tile.hasBorderLeft()) {
            context.moveTo(coordinates.x * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
            context.lineTo(coordinates.x * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
        }
        /* Bordure droite */
        if (tile.hasBorderRight()) {
            context.moveTo((coordinates.x + 1) * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
            context.lineTo((coordinates.x + 1) * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
        }
        /* Bordure haut */
        if (tile.hasBorderTop()) {
            context.moveTo(coordinates.x * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
            context.lineTo((coordinates.x + 1) * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
        }
        /* Bordure bas */
        if (tile.hasBorderBottom()) {
            context.moveTo(coordinates.x * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
            context.lineTo((coordinates.x + 1) * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
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
     * @param tile
     *
     * @returns {LevelManager}
     */
    drawPacDot(canvas, tile) {
        if (tile.hasPacDot()) {
            var context = canvas.getContext();
            var coordinates = tile.getCoordinates();
            var radius = tile.getPacDot() instanceof PowerPellet ? 6 : 3;
            var margin = Tile.TILE_WIDTH / 2;
            context.beginPath();
            context.arc(coordinates.x * Tile.TILE_WIDTH + margin, coordinates.y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT, radius, 0, 2 * Math.PI, false);
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
     * @returns {Array<Array<Tile>>}
     */
    getTiles() {
        return this.level.get();
    }
    /**
     * Lorsqu'un case a été mangée
     *
     * @param e
     *
     * @returns {LevelManager}
     */
    pacDotEaten(e) {
        /* Les coordonées de la case courante */
        var coords = e.detail;
        /* Récupération de la case courante */
        var tiles = this.getTiles();
        var tile = tiles[coords.y][coords.x];
        /* Décrémentation s'il y a un point */
        if (tile != void 0 && tile.hasPacDot() && !(tile.getPacDot() instanceof Fruit)) {
            this.pacDotNumber--;
            /* Si 30 points mangés, Inky sort */
            if (this.pacDotNumberTotal - this.pacDotNumber == GhostsManager.INKY_DOT_TO_GO) {
                var event = new CustomEvent('InkyCanGo');
                Jeu.ELEMENT.dispatchEvent(event);
            }
            /* Si un tier des points mangés, Clyde sort */
            if (this.pacDotNumberTotal - this.pacDotNumber == Math.round(this.pacDotNumberTotal / 3)) {
                var event = new CustomEvent('ClydeCanGo');
                Jeu.ELEMENT.dispatchEvent(event);
            }
        }
        var event = new CustomEvent('PacDotEatenProcessed', { detail: e.detail });
        Jeu.ELEMENT.dispatchEvent(event);
        /* Niveau terminé */
        if (this.pacDotNumber <= 0) {
            var event = new CustomEvent('LevelFinished');
            Jeu.ELEMENT.dispatchEvent(event);
        }
        return this;
    }
    /**
     * Récupère les gros points
     *
     * @returns {Array<Tile>}
     */
    getPowerPellet() {
        var tiles = this.getTiles();
        var tilesWithPowerPellet = [];
        for (var i = 0, l = tiles.length; i < l; ++i) {
            /* Parcourt de chaque case */
            for (var j = 0, k = tiles[i].length; j < k; ++j) {
                if (tiles[i][j].hasPowerPellet())
                    tilesWithPowerPellet.push(tiles[i][j]);
            }
        }
        return tilesWithPowerPellet;
    }
}
/**
 * Created by thiron on 03/07/2015.
 */
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
(new Jeu()).init();
/**
 * Created by mac pro on 13/03/2017.
 */
class PathFinder {
    constructor() {
        /* La prochaine case où le fantôme ira */
        this.nextTile = null;
    }
    /**
     * @returns {number}
     */
    getDistance() {
        return this.distance;
    }
    /**
     * @returns {Point}
     */
    getNextTile() {
        return this.nextTile;
    }
    /**
     * Détermine le meilleur chemin
     *
     * @param fromCoords
     * @param toCoords
     * @param checkCollisionCB
     * @param hasToGoBackwardsCB
     *
     * @returns {PathFinder}
     */
    findPath(fromCoords, toCoords, checkCollisionCB, hasToGoBackwardsCB) {
        /* La liste principale, initialisée avec la case, contient toutes les cases permettant de tracer le chemin */
        var mainList = [{
                x: fromCoords.x,
                y: fromCoords.y,
                i: 0,
                parent: null
            }];
        /* Récupération des cases où il peut aller */
        var currentAdjacentTiles = TileFunctions.getAdjacentTiles(fromCoords);
        /* Mélange des cases pour faire un chemin aléatoire quand il y aura plusieurs possibilités */
        Functions.shuffle(currentAdjacentTiles);
        for (var i = 0; i < currentAdjacentTiles.length; ++i) {
            var collisionDetected = checkCollisionCB(currentAdjacentTiles[i].x, currentAdjacentTiles[i].y);
            if (!collisionDetected && !hasToGoBackwardsCB(fromCoords, currentAdjacentTiles[i])) {
                /* Si case juste à côté, pas besoin de faire des calculs pour rien */
                if (currentAdjacentTiles[i].x == toCoords.x && currentAdjacentTiles[i].y == toCoords.y) {
                    if (!hasToGoBackwardsCB(fromCoords, currentAdjacentTiles[i])) {
                        this.distance = 1;
                        this.nextTile = currentAdjacentTiles[i];
                        mainList = [];
                        break;
                    }
                }
                /* Ajoute à la liste si trop loin */
                mainList.push({
                    x: currentAdjacentTiles[i].x,
                    y: currentAdjacentTiles[i].y,
                    i: 1,
                    parent: currentAdjacentTiles[i]
                });
            }
        }
        /* Pour chaque élément de la liste principale, on part des cases où il est possible d'aller directement */
        for (i = 1; i < mainList.length; ++i) {
            /* Récupération des 4 cases autour */
            var adjacentTiles = TileFunctions.getAdjacentTiles({
                x: mainList[i].x,
                y: mainList[i].y
            });
            /* Parcourt des 4 cases trouvées */
            for (var j = 0; j < 4; ++j) {
                /* Collision */
                var collisionDetected = checkCollisionCB(adjacentTiles[j].x, adjacentTiles[j].y);
                /* La case a déjà été ajoutée */
                var alreadyAdded = false;
                /* Vérification si case a déjà été ajoutée (même coords et index inférieur ou égal) */
                for (var k = 0, l = mainList.length; k < l; ++k) {
                    /* Si la case a les mêmes coordonées et le même parent et index inférieur */
                    if (mainList[k].x == adjacentTiles[j].x && mainList[k].y == adjacentTiles[j].y && mainList[k].i <= i &&
                        (mainList[k].parent == null ||
                            mainList[k].parent.x == mainList[i].parent.x && mainList[k].parent.y == mainList[i].parent.y)) {
                        alreadyAdded = true;
                        break;
                    }
                }
                /* Pas de collision et pas déjà ajoutée, ajout dans la liste principale */
                if (!collisionDetected && !alreadyAdded) {
                    mainList.push({
                        x: adjacentTiles[j].x,
                        y: adjacentTiles[j].y,
                        i: mainList[i].i + 1,
                        parent: mainList[i].parent
                    });
                }
                /* Arrêt de la boucle si la case de destination a été trouvée et qu'il faut pas faire demi-tour, i > 2 si jamais le fantôme est sur la case de destination */
                if (adjacentTiles[j].x == toCoords.x && adjacentTiles[j].y == toCoords.y && i > 2) {
                    this.distance = mainList[i].i;
                    this.nextTile = mainList[i].parent;
                    break;
                }
            }
            /* Stop boucle, chemin trouvé */
            if (this.nextTile != null)
                break;
        }
        return this;
    }
}
/**
 * Created by thiron on 09/03/2017.
 */
/**
 * Classe avec des méthodes statiques traiter les cases
 */
class TileFunctions {
    /**
     * Renvoie les 4 cases autour de la case courante
     *
     * @param tileCoords
     *
     * @returns {Point[]}
     */
    static getAdjacentTiles(tileCoords) {
        return [
            /* Gauche */
            {
                x: tileCoords.x - 1,
                y: tileCoords.y
            },
            /* Droite */
            {
                x: tileCoords.x + 1,
                y: tileCoords.y
            },
            /* Haut */
            {
                x: tileCoords.x,
                y: tileCoords.y - 1
            },
            /* Bas */
            {
                x: tileCoords.x,
                y: tileCoords.y + 1
            }
        ];
    }
    /**
     * Renvoie la case dont le param est le centre
     *
     * @param center
     *
     * @returns {{x: number, y: number}}
     */
    static getTileCoordinates(center) {
        var moduloX = center.x % Tile.TILE_WIDTH;
        var moduloY = center.y % Tile.TILE_WIDTH;
        /* Suppression pour avoir la case */
        return {
            x: (center.x - moduloX) / Tile.TILE_WIDTH,
            y: (center.y - moduloY) / Tile.TILE_WIDTH
        };
    }
}
/**
 * Created by mac pro on 25/03/2017.
 */
class Tunnel {
    /**
     * Gère l'entrée dans le tunnel
     *
     * @returns {Tunnel}
     */
    static checkEntry(object, context, margin) {
        var isGhost = object instanceof Ghost;
        var canvas = object.getCanvasElem();
        var coords = object.getCoordinates();
        /* Vers la droite */
        var toTheRight = coords.x >= 14 * Tile.TILE_WIDTH && coords.y == 10 * Tile.TILE_WIDTH;
        var toTheLeft = coords.x <= 0 && coords.y == 10 * Tile.TILE_WIDTH;
        /* Si bien rentré */
        if (toTheLeft || toTheRight) {
            var x = toTheRight ? coords.x - context.canvas.width : coords.x + context.canvas.width;
            /* Suppression puis dessin */
            if (toTheRight)
                context.clearRect(x, coords.y + margin + Jeu.TOP_HEIGHT, Pacman.SIZE.w + margin + 2, Tile.TILE_WIDTH - margin * 2);
            else
                context.clearRect(x + margin - 2, coords.y + margin + Jeu.TOP_HEIGHT, Pacman.SIZE.w + margin, Tile.TILE_WIDTH - margin * 2);
            context.drawImage(canvas, x + margin, coords.y + margin + Jeu.TOP_HEIGHT);
            /* Modification du x à la moitié du tunnel */
            if (toTheRight && x >= -Tile.TILE_WIDTH / 2 || toTheLeft && x <= 14 * Tile.TILE_WIDTH + Tile.TILE_WIDTH / 2)
                object.setX(x);
            /* Ralentissement/accélération si fantome */
            if (isGhost) {
                if (toTheRight && x <= -Tile.TILE_WIDTH || toTheLeft && x >= 15 * Tile.TILE_WIDTH)
                    object.speedUp();
                else
                    object.slow();
            }
        }
        return this;
    }
}
