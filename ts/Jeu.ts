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
  private static INTERVAL: number = 10;
  /* Hauteur du panneau supérieur */
  private static TOP_HEIGHT: number = 40;

  private canvas: Canvas;
  private pacman: Pacman;
  private time: number;
  private levelManager: LevelManager;
  private fruitsManager: FruitsManager;
  private score: Score;
  private powerPelletTiles: Array<Tile>;

  public constructor()
  {
    this.time = +new Date();
  }

  /**
   * Initialise le jeu
   */
  public init(): Jeu
  {
    try
    {
      /* Initialisation du canvas */
      this.canvas = new Canvas(document.querySelector("canvas"));
    }
    catch (e)
    {
      /* Une erreur s'est produite, alert puis redirection */
      alert(e.message);
      window.location.href = "http://www.thomas-hiron.com";

      /* Retour de l'instance pour ne pas continuer le temps de la redirection */
      return this;
    }

    /* Le canvas pour dessiner les niveau */
    var canvasLevel: Canvas = new Canvas();
    canvasLevel.setSize(this.canvas.getElement().width, this.canvas.getElement().height);

    /* Les niveaux */
    this.levelManager = new LevelManager();
    this.levelManager.draw(canvasLevel);

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

    /* Ajout des listeners */
    this.addListeners();

    /* Démarrage du jeu */
    this.start();

    return this;
  }

  private addListeners(): Jeu
  {
    /* Listener pour un point mangée */
    window.addEventListener('PacDotEaten', this.onPacDotEaten.bind(this), false);

    /* Listener pour niveau terminé */
    window.addEventListener('LevelFinished', this.onLevelFinished.bind(this), false);

    /* Listener pour un nouveau fruit */
    window.addEventListener('NewFruit', this.onNewFruit.bind(this), false);

    /* Listener pour un fruit supprimé (pas mangé) */
    window.addEventListener('RemoveFruit', this.onRemoveFruit.bind(this), false);

    return this;
  }

  /**
   * Démarre le jeu, appelé à chaque nouveau niveau
   *
   * @returns {Jeu}
   */
  private start(): Jeu
  {
    /* Récupération de toutes les power pellet pour les faire clignoter */
    this.powerPelletTiles = this.levelManager.getPowerPellet();

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
  private draw(): Jeu
  {
    /* Si l'interval a été atteint */
    if (+new Date() - this.time > Jeu.INTERVAL)
    {
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
  private animatePacman(): Jeu
  {
    var pacman: Pacman = this.pacman;
    /* Pour centrer dans la case */
    var margin: number = (Tile.TILE_WIDTH - pacman.getSize().w) / 2;
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
  private drawCurrentPacDot(): Jeu
  {
    /* La case de pacman */
    var coords: Point = this.pacman.getPreviousTileCoords();
    var margin: number = 5;

    /* Récupération de la case courante */
    var tiles: Array<Array<Tile>> = this.levelManager.getTiles();
    var currentTile: Tile = tiles[coords.y][coords.x];

    /* Tile ok */
    if (currentTile != null && currentTile.hasPacDot())
    {
      /* Si c'est un fruit, c'est Jeu qui redessine */
      if (currentTile.getPacDot() instanceof Fruit)
        this.onNewFruit(null);
      else
      {
        var canvas: Canvas = new Canvas();
        canvas.setSize(this.canvas.getElement().width, this.canvas.getElement().height);

        /* Dessin */
        this.levelManager.drawPacDot(canvas, currentTile);

        /* Dessin du point et suppression de l'ancien */
        this.canvas.getContext().clearRect(coords.x * Tile.TILE_WIDTH + margin, coords.y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT, 30, 30);
        this.canvas.getContext().drawImage(canvas.getElement(), 0, Jeu.TOP_HEIGHT);
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
    for (var i = 0, l = this.powerPelletTiles.length; i < l; ++i)
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
      var canvas: Canvas = new Canvas();
      canvas.setSize(this.canvas.getElement().width, this.canvas.getElement().height);

      /* Dessin */
      for (var i = 0, l = this.powerPelletTiles.length; i < l; ++i)
        this.levelManager.drawPacDot(canvas, this.powerPelletTiles[i]);

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
  private checkCollision(x: number, y: number): boolean
  {
    var tiles: Array<Array<Tile>> = this.levelManager.getTiles();

    return tiles[y] == void 0 || tiles[y][x] === void 0 || tiles[y][x].isAWall();
  }

  /**
   * Mange le point
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
    this.score.update(currentTile);

    /* Si c'est un fruit, on recommence le compteur */
    if (currentTile.getPacDot() instanceof Fruit)
      this.fruitsManager.start();

    /* Suppression du point */
    currentTile.setPacDot(null);

    return this;
  }

  /**
   * Niveau terminé !
   *
   * @returns {Jeu}
   */
  private onLevelFinished(): Jeu
  {
    console.log('Todo : Niveau terminé');

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
    /* Nettoyage de la case au cas où */
    this.onRemoveFruit(false);

    /* Récupération de la case du milieu */
    var tiles: Array<Array<Tile>> = this.levelManager.getTiles();
    var middleTile: Tile = tiles[Pacman.PACMAN_BASE_Y][Pacman.PACMAN_BASE_X];

    var fruit: Fruit = e === null ? middleTile.getPacDot() : e.detail;
    var fruitWidth: number = Fruit.WIDTH;
    var margin: number = (Tile.TILE_WIDTH - fruitWidth) / 2;
    var index: number = 0;

    /* Ajout du fruit */
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
      Pacman.PACMAN_BASE_X * Tile.TILE_WIDTH + margin, Pacman.PACMAN_BASE_Y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT,
      fruitWidth, fruitWidth
    );

    /* Récupération de la case du milieu et suppression du fruit */
    if (removeFromTile !== false)
    {
      var tiles: Array<Array<Tile>> = this.levelManager.getTiles();
      var middleTile: Tile = tiles[Pacman.PACMAN_BASE_Y][Pacman.PACMAN_BASE_X];
      middleTile.setPacDot(null);
    }

    return this;
  }
}