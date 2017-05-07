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
class Jeu
{
  /* Interval du request animation frame */
  private static INTERVAL: number = 1;
  private static EATEN_INTERVAL: number = 10;
  /* Hauteur du panneau supérieur */
  public static TOP_HEIGHT: number = 40;

  /* L'élément pour les events */
  public static ELEMENT: HTMLElement = document.createElement('DIV');

  private canvas: Canvas;
  private pacman: Pacman;
  private frames: number;
  private levelManager: LevelManager;
  private fruitsManager: FruitsManager;
  private ghostsManager: GhostsManager;
  private score: Score;
  private powerPelletTiles: Array<Tile>;
  private pacmanEaten: boolean;
  private playing: boolean;
  private level: number;

  public constructor()
  {
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
  public init(newGame: boolean = true): Jeu
  {
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
    var coords: Point = this.pacman.getCoordinates();
    var margin: number = (Tile.TILE_WIDTH - Pacman.SIZE.w) / 2;
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
  private addListeners(): Jeu
  {
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
  private play(): Jeu
  {
    (<HTMLElement>document.querySelector('.jouer')).style.display = "none";
    (<HTMLElement>document.querySelector('.continuer')).style.display = "none";

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
  private draw(): Jeu
  {
    var interval: number = this.pacmanEaten ? Jeu.EATEN_INTERVAL : Jeu.INTERVAL;

    /* Si l'interval a été atteint */
    if (this.canvas != null && this.frames >= interval)
    {
      if (!this.pacmanEaten)
      {
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
      /* Mangé */
      else
      {
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
  private clearAll(): Jeu
  {
    var context: CanvasRenderingContext2D = this.canvas.getContext();
    var pacman: number = (Tile.TILE_WIDTH - Ghost.SIZE.w) / 2;
    var ghost: number = (Tile.TILE_WIDTH - Ghost.SIZE.w) / 2;
    var coords: Point = this.pacman.getCoordinates();

    /* Suppression de pacman */
    context.clearRect(coords.x + pacman, coords.y + pacman + Jeu.TOP_HEIGHT, Pacman.SIZE.w, Pacman.SIZE.h);

    /* Suppression des fantômes */
    var ghosts: Array<Ghost> = this.ghostsManager.getGhosts();
    for (var i = 0, l = ghosts.length ; i < l ; ++i)
    {
      var obj: Ghost = ghosts[i];
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
  private animatePacman(): Jeu
  {
    var pacman: Pacman = this.pacman;
    var coords: Point = pacman.getCoordinates();
    /* Pour centrer dans la case */
    var margin: number = (Tile.TILE_WIDTH - Pacman.SIZE.w) / 2;
    var context = this.canvas.getContext();

    /* Instruction de modification des coordonées */
    if (!this.pacmanEaten)
    {
      pacman.move();

      /* Instruction d'animation */
      pacman.animate();

      /* Dessine la case courante si le point a pas été mangé pour pas le couper */
      this.drawCurrentPacDot(pacman.getPreviousTileCoords());
    }
    /* Pacman meurt */
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
  private animateGhosts(): Jeu
  {
    var context: CanvasRenderingContext2D = this.canvas.getContext();
    var margin: number = (Tile.TILE_WIDTH - Ghost.SIZE.w) / 2;
    var ghosts: Array<Ghost> = this.ghostsManager.getGhosts();
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
    for (var i = 0, l = ghosts.length ; i < l ; ++i)
    {
      var obj: Ghost = ghosts[i];

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
  private drawCurrentPacDot(coords: Point, removeOnly: boolean = false): Jeu
  {
    /* La case de pacman */
    var margin: number = 5;

    /* Récupération de la case courante */
    var tiles: Array<Array<Tile>> = this.levelManager.getTiles();
    var currentTile: Tile = tiles[coords.y] != void 0 ? tiles[coords.y][coords.x] : null;

    /* Tile ok */
    if (currentTile != null && currentTile.hasPacDot())
    {
      /* Dessin que si pacdot */
      if (!(currentTile.getPacDot() instanceof Fruit) && !(currentTile.getPacDot() instanceof PowerPellet))
      {
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
  private drawTop(): Jeu
  {
    var context: CanvasRenderingContext2D = this.canvas.getContext();

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
  private drawScore(): Jeu
  {
    var context: CanvasRenderingContext2D = this.canvas.getContext();

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
  private drawEscapeDoor(): Jeu
  {
    var context: CanvasRenderingContext2D = this.canvas.getContext();

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
  private flashPowerPellet(): Jeu
  {
    var date: Date = new Date();
    var context: CanvasRenderingContext2D = this.canvas.getContext();
    var margin: number = 10;

    /* Suppression dans les deux cas */
    for (var i = 0, l = this.powerPelletTiles.length ; i < l ; ++i)
    {
      context.clearRect(
        this.powerPelletTiles[i].getCoordinates().x * Tile.TILE_WIDTH + margin,
        this.powerPelletTiles[i].getCoordinates().y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT,
        Tile.TILE_WIDTH / 2,
        Tile.TILE_WIDTH / 2
      );
    }

    /* Redessin */
    if (date.getMilliseconds() >= 500)
    {
      /* Dessin */
      for (var i = 0, l = this.powerPelletTiles.length ; i < l ; ++i)
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
  private checkCollision(x: number, y: number): boolean
  {
    var tiles: Array<Array<Tile>> = this.levelManager.getTiles();

    return tiles[y] == void 0 || tiles[y][x] === void 0 || tiles[y][x].isAWall();
  }

  /**
   * Mange le point, après avoir été traité par le levelManager pour libérer un fantôme
   *
   * @returns {Jeu}
   */
  private onPacDotEaten(e: CustomEvent): Jeu
  {
    /* Les coordonées de la case courante */
    var coords: Point = e.detail;

    /* Récupération de la case courante */
    var tiles: Array<Array<Tile>> = this.levelManager.getTiles();
    var currentTile: Tile = tiles[coords.y][coords.x];

    /* Augmentation du score */
    if (currentTile != void 0)
    {
      this.score.update(currentTile);

      /* Si c'est un fruit, on recommence le compteur */
      if (currentTile.getPacDot() instanceof Fruit)
        this.fruitsManager.init();
      /* Si power pellet, on informe le ghostManager */
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
  private onLevelFinished(): Jeu
  {
    /* Niveau suivant */
    this.level++;

    /* Redessin du haut avec le nouveau niveau */
    this.canvas.getContext().clearRect(0, 0, this.canvas.getElement().width, Jeu.TOP_HEIGHT);
    this.drawTop();

    /* Bouton continuer */
    (<HTMLElement>document.querySelector('.continuer')).style.display = 'block';

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
  private onNewFruit(e: CustomEvent): Jeu
  {
    /* Récupération de la case du milieu */
    var tiles: Array<Array<Tile>> = this.levelManager.getTiles();
    var middleTile: Tile = tiles[Pacman.BASE_Y][Pacman.BASE_X];

    /* Le fruit */
    var fruit: Fruit = e === null ? middleTile.getPacDot() : e.detail;

    /* Ajout du fruit */
    if (e !== null || fruit !== null)
    {
      /* Nettoyage de la case au cas où */
      this.onRemoveFruit(false);

      var fruitWidth: number = Fruit.WIDTH;
      var margin: number = (Tile.TILE_WIDTH - fruitWidth) / 2;
      var index: number = 0;

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

      var img: HTMLImageElement = <HTMLImageElement>document.querySelector('img');
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
        fruitWidth, fruitWidth
      );
    }

    return this;
  }

  /**
   * Quand un fruit a été supprimé parce que pas mangé
   *
   * @returns {Jeu}
   */
  private onRemoveFruit(removeFromTile: boolean = true): Jeu
  {
    var fruitWidth: number = Fruit.WIDTH;
    var margin: number = (Tile.TILE_WIDTH - fruitWidth) / 2;

    /* Suppression dans le canvas */
    this.canvas.getContext().clearRect(
      Pacman.BASE_X * Tile.TILE_WIDTH + margin, Pacman.BASE_Y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT,
      fruitWidth, fruitWidth
    );

    /* Récupération de la case du milieu et suppression du fruit */
    if (removeFromTile !== false)
    {
      var tiles: Array<Array<Tile>> = this.levelManager.getTiles();
      var middleTile: Tile = tiles[Pacman.BASE_Y][Pacman.BASE_X];
      middleTile.setPacDot(null);
    }

    return this;
  }

  /**
   * Pacman mangé !
   *
   * @returns {Jeu}
   */
  private onPacmanEaten(): Jeu
  {
    this.pacmanEaten = true;

    return this;
  }

  /**
   * Pacman est mort
   *
   * @returns {Jeu}
   */
  private onPacmanDead(): Jeu
  {
    /* Suppression de tous les events */
    (<HTMLElement>document.querySelector('.jouer')).style.display = "block";

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
  private onGhostEaten(e: CustomEvent): Jeu
  {
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
  private onKeyDown(e: KeyboardEvent): Jeu
  {
    /* Entrée ou espace */
    if (!this.playing && (e.keyCode == 32 || e.keyCode == 13))
      this.play();

    return this;
  }
}