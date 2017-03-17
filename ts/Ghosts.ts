/**
 * Created by mac pro on 06/03/2017.
 */

/**
 * Un fantôme
 */
abstract class Ghost
{
  public static SIZE: Size = {
    w: 24,
    h: 24
  };

  /* Les différentes vitesses */
  private static OUT_FROM_HOME = 1;
  private static NORMAL = 2;
  private static FRIGHTENED = 1;
  private static GOING_HOME = 4;

  /* La direction */
  protected direction: number;
  /* Le mode courant */
  protected mode: number;
  /* Les coordonnées du fantôme */
  protected coordinates: Point;
  /* Les coordonées des coins respectifs */
  protected cornerCoordinates: Point;
  /* La couleur du fantôme */
  protected color: string;
  protected frightenedColor: string = "#2121ff";

  /* Le canvas de chaque fantôme */
  private canvas: Canvas;
  /* Le décalage en px pour le mouvement */
  private stepPx: number = Ghost.NORMAL;
  /* L'étape courante d'animation */
  private stepNumber: number = 10;
  private currentStep: number = 0;

  /* La méthode de détection de collison */
  protected checkCollision: any;

  /**
   * Vise une case selon le caractère
   */
  protected abstract targetTile(pacmanCenter: PointAndDirection, blinkCoords: Point): Point;

  /**
   * @param callback
   *
   * @returns {Ghost}
   */
  public setCollideFunction(callback: any)
  {
    this.checkCollision = callback;

    return this;
  }

  /**
   * Initialise les fantômes
   * @returns {Ghost}
   */
  public init(): Ghost
  {
    this.canvas = new Canvas();
    this.canvas.setSize(Ghost.SIZE.w, Ghost.SIZE.h);

    /* Dessin */
    this.draw();

    /* Mode par défaut */
    this.mode = Modes.Idle;
    this.direction = null;

    /* Pour que blinky aille à gauche obligatoirement */
    if (this instanceof Blinky)
      this.direction = Directions.Right;

    return this;
  }

  /**
   * Dessine le fantôme
   *
   * @returns {Ghost}
   */
  private draw(): Ghost
  {
    var context: CanvasRenderingContext2D = this.canvas.getContext();
    context.globalCompositeOperation = 'source-over';
    context.beginPath();

    /* La tête */
    context.arc(Ghost.SIZE.w / 2, Ghost.SIZE.h / 2, Ghost.SIZE.w / 2, 0, 2 * Math.PI, false);

    /* Le corps */
    context.rect(0, Ghost.SIZE.h / 2, Ghost.SIZE.w, Ghost.SIZE.h / 2);

    /* Remplissage */
    context.fillStyle = this.mode == Modes.Frightened ? this.frightenedColor : this.color;
    context.fill();
    context.closePath();

    /* Les yeux */
    var x: number = 0;
    var y: number = 0;
    switch (this.direction)
    {
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
    if (this.mode == Modes.Frightened)
    {
      /* Petits yeux */
      context.arc(Ghost.SIZE.w / 2 - 4, Ghost.SIZE.h / 2 - 2, 2, 0, 2 * Math.PI, false);
      context.arc(Ghost.SIZE.w / 2 + 4, Ghost.SIZE.h / 2 - 2, 2, 0, 2 * Math.PI, false);
    }
    else
    {
      /* Yeux normaux */
      context.ellipse(Ghost.SIZE.w / 2 - 5 + x, Ghost.SIZE.h / 2 + y, 3, 4, 0, 2 * Math.PI, false);
      context.ellipse(Ghost.SIZE.w / 2 + 5 + x, Ghost.SIZE.h / 2 + y, 3, 4, 0, 2 * Math.PI, false);
    }

    /* Remplissage du blanc */
    context.fillStyle = 'white';
    context.fill();
    context.closePath();

    /* Les pupilles si pas apeuré */
    if (this.mode != Modes.Frightened)
    {
      context.beginPath();
      context.ellipse(Ghost.SIZE.w / 2 - 5 + x * 2, Ghost.SIZE.h / 2 + y * 2, 1, 2, 0, 2 * Math.PI, false);
      context.ellipse(Ghost.SIZE.w / 2 + 5 + x * 2, Ghost.SIZE.h / 2 + y * 2, 1, 2, 0, 2 * Math.PI, false);

      /* Remplissage de la pupille */
      context.fillStyle = 'black';
      context.fill();
      context.closePath();
    }
    /* Sinon il a une bouche */
    else
    {
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
      context.strokeStyle = 'white'
      context.stroke();
      context.closePath();
    }

    /* Changement de mode et ajout des pates */
    context.globalCompositeOperation = 'destination-out';

    /* Le nombre de pates */
    var legsNumber: number = this.currentStep >= this.stepNumber / 2 ? 3 : 4;
    var legWidth: number = Ghost.SIZE.w / legsNumber;
    var legHeight: number = 3;

    for (var i = 0 ; i < legsNumber ; ++i)
    {
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
  private findBestPath(destinationTileCoords: Point): number
  {
    /* Les coordonnées de la case courante */
    var currentTileCoords: Point = {
      x: this.coordinates.x / Tile.TILE_WIDTH,
      y: this.coordinates.y / Tile.TILE_WIDTH
    };

    /* Récupération du meilleur chemin */
    var pathFinder: PathFinder = new PathFinder();
    pathFinder.findPath(
      currentTileCoords, destinationTileCoords,
      this.checkCollision.bind(this), this.hasToGoBackwards.bind(this)
    );

    /* Récupération de la bonne direction, par défaut la courante */
    var direction: number = this.direction;
    var nextTile: Point = pathFinder.getNextTile();
    if (nextTile != null)
    {
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
   * Détermine si deux cases sont collées
   *
   * @param fromTile
   * @param toTile
   *
   * @returns {boolean}
   */
  private isNextTo(fromTile: Point, toTile: Point): boolean
  {
    return (
      Math.abs(fromTile.x - toTile.x) == 1 && fromTile.y == toTile.y ||
      Math.abs(fromTile.y - toTile.y) == 1 && fromTile.x == toTile.x
    );
  }

  /**
   * S'il doit faire demi-tour pour atteindre la case de destination
   *
   * @returns {boolean}
   */
  protected hasToGoBackwards(fromTile: Point, toTile: Point): boolean
  {
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
   * Déplace le fantôme
   *  Tout droit si dans une case
   *  Appelle targetTile et findBestPath si c'est un croisement
   *
   * @param pacmanCenter
   * @param blinkyCoords
   *
   * @returns {Ghost}
   */
  public move(pacmanCenter: PointAndDirection, blinkyCoords: Point = null): Ghost
  {
    /* Pas de déplacement si à l'arrêt */
    if (this.mode == Modes.Idle)
      return this;

    /* Si dans une case */
    if (this.coordinates.x % Tile.TILE_WIDTH == 0 && this.coordinates.y % Tile.TILE_WIDTH == 0)
    {
      switch (this.mode)
      {
        /* Dans le coin attribué */
        case Modes.Scatter :
          this.direction = this.findBestPath(this.cornerCoordinates);
          break;

        case Modes.Chase :

          /* Récupération de la bonne case */
          var target: Point = this.targetTile(pacmanCenter, blinkyCoords);
          this.direction = this.findBestPath(target);

          break;

        case Modes.Frightened :

          /* Une case aléatoire */
          var coords: Point = TileFunctions.getTileCoordinates({
            x: this.coordinates.x + Tile.TILE_WIDTH / 2,
            y: this.coordinates.y + Tile.TILE_WIDTH / 2
          });

          /* Toutes les cases autour et la case finale */
          var adjacentTiles: Array<Point> = TileFunctions.getAdjacentTiles(coords);
          var target: Point;

          /* Mélange des cases pour faire un chemin aléatoire quand il y aura plusieurs possibilités */
          Functions.shuffle(adjacentTiles);
          for (var i = 0 ; i < adjacentTiles.length ; ++i)
          {
            var collisionDetected: boolean = this.checkCollision(adjacentTiles[i].x, adjacentTiles[i].y);
            if (!collisionDetected && !this.hasToGoBackwards(coords, adjacentTiles[i]))
            {
              target = adjacentTiles[i];
              break;
            }
          }

          /* Changement de direction */
          this.direction = this.findBestPath(target);

          break;

        /* Sort de la maison */
        case Modes.OutFromHome :

          var coords: Point = {
            x: this.coordinates.x / Tile.TILE_WIDTH,
            y: this.coordinates.y / Tile.TILE_WIDTH
          };

          /* Case du milieu, sortie vers le haut */
          if (coords.x == 7 && coords.y == 9)
            this.direction = Directions.Up;
          /* Il est sorti */
          else if (coords.x == 7 && coords.y == 8)
          {
            /* Signaler au manager qu'il est sorti */
            var event = new CustomEvent('OutFromHome', {'detail': this});
            window.dispatchEvent(event);

            /* Vitesse normale */
            this.stepPx = Ghost.NORMAL;
          }
          /* Aller au milieu */
          else
          {
            if (coords.x == 6)
              this.direction = Directions.Right;
            else if (coords.x == 8)
              this.direction = Directions.Left;
          }

          break;
      }
    }

    /* Déplacement */
    switch (this.direction)
    {
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

    return this;
  }

  /**
   * Fait l'animation du fantôme dans le canvas
   *
   * @returns {Ghost}
   */
  public animate(): Ghost
  {
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
  public getOutFromHome(): Ghost
  {
    this.mode = Modes.OutFromHome;

    this.stepPx = Ghost.OUT_FROM_HOME;

    return this;
  }

  /**
   * Renvoie la direction pour
   *
   * @returns {number}
   */
  public getDirection(): number
  {
    return this.direction;
  }

  /**
   * Modifie le mode
   *
   * @param mode
   * @param force Si le mode doit être changé de force (pour quitter le mode iddle)
   * @returns {Ghost}
   */
  public changeMode(mode: number, force: boolean = false): Ghost
  {
    /* S'il était apeuré */
    var wasFrightened: number = this.mode == Modes.Frightened;

    /* S'il vient de sortir de la maison */
    if (this.mode == Modes.OutFromHome && mode == Modes.Scatter)
      this.direction = Directions.Right;
    else if (this.mode == Modes.OutFromHome && mode == Modes.Chase)
      this.direction = Directions.Left;
    if (this.mode != Modes.Idle || force)
      this.mode = mode;

    /* Si scatter, changement de direction (et si pas frightened juste avant) */
    if (!wasFrightened && this.mode == Modes.Scatter)
    {
      switch (this.direction)
      {
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
    /* Si frightened, réduction de la vitesse */
    else if (this.mode == Modes.Frightened)
      this.stepPx = Ghost.FRIGHTENED;
    /* Plus apeuré, vitesse normale */
    else if (wasFrightened && this.mode != Modes.Frightened)
      this.stepPx = Ghost.NORMAL;

    return this;
  }

  /**
   * Renvoie les coordonnées
   *
   * @returns {Point}
   */
  public getCoordinates(): Point
  {
    return this.coordinates;
  }

  /**
   * Renvoie le canvas
   *
   * @returns {Canvas}
   */
  public getCanvas(): Canvas
  {
    return this.canvas;
  }
}

/**
 * Fantôme rose
 *  Prend pacman en ambuscade (vise 4 cases devant pacman)
 *  Coin en haut à gauche
 *  Sort immédiatement
 */
class Pinky extends Ghost
{
  constructor()
  {
    super();

    this.mode = null;
    this.coordinates = {
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
  protected targetTile(pacmanCenter: PointAndDirection): Point
  {
    /* La case de pacman */
    var pacmanTile: Point = TileFunctions.getTileCoordinates(pacmanCenter);

    /* Viser 4 cases devant */
    switch (pacmanCenter.direction)
    {
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
class Blinky extends Ghost
{
  constructor()
  {
    super();

    this.mode = null;
    this.coordinates = {
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
  protected targetTile(pacmanCenter: PointAndDirection): Point
  {
    return TileFunctions.getTileCoordinates(pacmanCenter);
  }
}

/**
 * Fantôme bleu
 *  Vise 2 cases devant pacman et fait un calcul de vecteur en fonction de la position de Blinky
 *  Coin en bas à droite
 *  Sort dès qu'il y a 30 points mangés
 */
class Inky extends Ghost
{
  constructor()
  {
    super();

    this.mode = null;
    this.coordinates = {
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
  protected targetTile(pacmanCenter: PointAndDirection, blinkyCoords: Point): Point
  {
    /* La case de blinky */
    var a: Point = TileFunctions.getTileCoordinates({
      x: blinkyCoords.x + Tile.TILE_WIDTH / 2,
      y: blinkyCoords.y + Tile.TILE_WIDTH / 2
    });

    /* La case de pacman */
    var b: Point = TileFunctions.getTileCoordinates(pacmanCenter);

    /* Viser 2 cases devant */
    switch (pacmanCenter.direction)
    {
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
    var ab: Point = {
      x: b.x - a.x,
      y: b.y - a.y
    };

    /* La nouvelle case */
    var target: Point = {
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
class Clyde extends Ghost
{
  constructor()
  {
    super();

    this.mode = null;
    this.coordinates = {
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
  protected targetTile(pacmanCenter: PointAndDirection): Point
  {
    /* Pacman */
    var pacmanTileCoords: Point = TileFunctions.getTileCoordinates(pacmanCenter);

    /* La case courante */
    var currentTileCoords: Point = TileFunctions.getTileCoordinates({
      x: this.coordinates.x + Tile.TILE_WIDTH / 2,
      y: this.coordinates.y + Tile.TILE_WIDTH / 2
    });

    /* Le chemin */
    var pathFinder: PathFinder = new PathFinder();
    pathFinder.findPath(
      currentTileCoords, pacmanTileCoords,
      this.checkCollision.bind(this), this.hasToGoBackwards.bind(this)
    );

    /* Récupération de la distance */
    var distance: number = pathFinder.getDistance();

    /* Si supérieur à 8, il vise pacman, sinon retour au coin */
    return distance > 8 ? pacmanTileCoords : this.cornerCoordinates;
  }
}