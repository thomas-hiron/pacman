/**
 * Created by thiron on 01/03/2017.
 */

/**
 * Le pacman, il gère tout seul le mouvement et l'animation pour manger
 */
class Pacman
{
  public static BASE_X: number = 7;
  public static BASE_Y: number = 10;
  public static SIZE: Size = {
    w: 24,
    h: 24
  };

  /**
   * Le canvas pour pacman
   */
  private canvas: Canvas;

  /**
   * Les coordonnées de départ
   */
  private coordinates: Point;

  /**
   * La direction courante et la suivante
   */
  private direction: number;
  private nextDirection: number;

  /**
   * L'étape courante pour le dessin et le nombre d'animations
   */
  private currentStep: number;
  private stepNumber: number;

  /**
   * Le décalage en px lors du mouvement
   */
  private stepPx: number;

  /**
   * L'angle
   */
  private angle: number;

  /**
   * Pour détecter une collision (fonction dans Jeu)
   */
  private checkCollision: any;

  /**
   * @param callback
   *
   * @returns {Pacman}
   */
  public setCollideFunction(callback: any)
  {
    this.checkCollision = callback;
    return this;
  }

  /**
   * @param x
   *
   * @returns {Pacman}
   */
  public setX(x: number): Pacman
  {
    this.coordinates.x = x;

    return this;
  }

  /**
   * @returns {Point}
   */
  public getCoordinates(): Point
  {
    return this.coordinates;
  }

  /**
   * Renvoie le canvas de pacman pour pouvoir être dessiné dans le jeu
   *
   * @returns {HTMLCanvasElement}
   */
  public getCanvasElem(): HTMLCanvasElement
  {
    return this.canvas.getElement();
  }

  /**
   * Renvoie la direction
   *
   * @returns {number}
   */
  public getDirection(): number
  {
    return this.direction;
  }

  /**
   * Le constructeur qui initialise les variables
   */
  public constructor()
  {
    /* Ajout de l'event des flèches */
    window.addEventListener("keydown", this.rotate.bind(this), false);
  }

  /**
   * Initialisation
   *
   * @returns {Pacman}
   */
  public init(): Pacman
  {
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
  public rotate(e: KeyboardEvent): Pacman
  {
    /* Le code de la flèche touchée */
    var code: number = e.keyCode;

    /* Selon la flèche, on change le direction */
    switch (code)
    {
      case 37 :
        e.preventDefault();
        this.nextDirection = Directions.Left;
        break;
      case 38 :
        e.preventDefault();
        this.nextDirection = Directions.Up;
        break;
      case 39 :
        e.preventDefault();
        this.nextDirection = Directions.Right;
        break;
      case 40 :
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
  public animate(): Pacman
  {
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
  public move()
  {
    /* Largeur de la case */
    var tileWidth: number = Tile.TILE_WIDTH;

    /* Pas de collision par défaut */
    var collisionWithNextDirection: boolean = false;
    var collisionWithCurrentDirection: boolean = false;

    /* Les nouvelles coordonnées */
    var newX: number = this.coordinates.x;
    var newY: number = this.coordinates.y;

    /* Si dans une case, on change de direction, si possible */
    if (this.coordinates.x % tileWidth == 0 && this.coordinates.y % tileWidth == 0)
    {
      /* Les cases suivantes en fonction de la direction courante et suivante */
      var nextTileCoordsWithNextDirection: Point = this.getNextTileCoords(this.nextDirection);
      var nextTileCoordsWithCurrentDirection: Point = this.getNextTileCoords(this.direction);

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
    else
    {
      /* Si on veut changer dans la direction opposée, faut le faire immédiatement */
      if (
        this.direction == Directions.Left && this.nextDirection == Directions.Right ||
        this.direction == Directions.Right && this.nextDirection == Directions.Left ||
        this.direction == Directions.Up && this.nextDirection == Directions.Down ||
        this.direction == Directions.Down && this.nextDirection == Directions.Up
      )
        this.direction = this.nextDirection
    }

    /* En fonction de la direction, modification des coords et de l'angle, si 15% dans la case, on supprime le point */
    var percentInTile: number;
    switch (this.direction)
    {
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
    if (!collisionWithNextDirection || !collisionWithCurrentDirection)
    {
      this.coordinates.x = newX;
      this.coordinates.y = newY;
    }

    /* Suppression du point */
    if (percentInTile == 75)
    {
      /* Les coordonées de la case */
      var currentTileCoords: Point = this.getCurrentTileCoords();

      var event: Event = new CustomEvent('PacDotEaten', {'detail': currentTileCoords});
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
  public draw(): Pacman
  {
    /* Le context du pacman */
    var ctx: CanvasRenderingContext2D = this.canvas.getContext();

    /* Taille */
    var size: Size = Pacman.SIZE;

    /* Largeur de la case */
    var tileWidth: number = Tile.TILE_WIDTH;

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
    var inclinaison: number = this.currentStep * 0.25 / (this.stepNumber - 1);
    var inclinaison2: number = 1 - inclinaison;

    var startAngle: number = (inclinaison2 + 1) * Math.PI;
    var endAngle: number = inclinaison * Math.PI;

    if (startAngle < Math.PI)
    {
      startAngle = 0;
      endAngle = 0;

      /* Event terminé */
      var event: Event = new Event('PacmanDied');
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
  private getNextTileCoords(direction: number): Point
  {
    /* La case suivante avec la prochaine direction */
    var nextTileCoords: Point = this.getCurrentTileCoords();

    /* Modification de la case suivante */
    switch (direction)
    {
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
  private getCurrentTileCoords()
  {
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
  public getPreviousTileCoords()
  {
    var coords = this.getCurrentTileCoords();

    /* Suivant la direction, c'est pas forcément la bonne case */
    switch (this.direction)
    {
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
  public die(): Pacman
  {
    /* Augmentation de l'étape */
    this.currentStep += 5;

    this.draw();

    return this;
  }
}