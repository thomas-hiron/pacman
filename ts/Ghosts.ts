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

  /* Le canvas de chaque fantôme */
  private canvas: Canvas;
  /* Le décalage en px pour le mouvement */
  private stepPx: number = Ghost.NORMAL;
  /* L'étape courante d'animation */
  private stepNumber: number = 10;
  private currentStep: number = 0;

  /* La méthode de détection de collison */
  private checkCollision: any;

  /**
   * Vise une case selon le caractère
   */
  protected abstract targetTile(pacmanCenter: Point): Point;

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
    context.fillStyle = this.color;
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
    context.ellipse(Ghost.SIZE.w / 2 - 5 + x, Ghost.SIZE.h / 2 + y, 3, 4, 0, 2 * Math.PI, false);
    context.ellipse(Ghost.SIZE.w / 2 + 5 + x, Ghost.SIZE.h / 2 + y, 3, 4, 0, 2 * Math.PI, false);

    /* Remplissage du blanc */
    context.fillStyle = 'white';
    context.fill();
    context.closePath();

    context.beginPath();
    context.ellipse(Ghost.SIZE.w / 2 - 5 + x * 2, Ghost.SIZE.h / 2 + y * 2, 1, 2, 0, 2 * Math.PI, false);
    context.ellipse(Ghost.SIZE.w / 2 + 5 + x * 2, Ghost.SIZE.h / 2 + y * 2, 1, 2, 0, 2 * Math.PI, false);

    /* Remplissage de la pupille*/
    context.fillStyle = 'black';
    context.fill();
    context.closePath();

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
   * @param tileCoords La case à aller
   * @see https://en.wikipedia.org/wiki/Pathfinding
   *
   * @returns {number}
   */
  private findBestPath(tileCoords: Point): number
  {
    /* Les coordonnées de la case courante */
    var currentTileCoords: Point = {
      x: this.coordinates.x / Tile.TILE_WIDTH,
      y: this.coordinates.y / Tile.TILE_WIDTH
    };

    /* La liste principale, initialisée avec la case, contient toutes les cases permettant de tracer le chemin */
    var mainList: Array<PointIndexed> = [{
      x: tileCoords.x,
      y: tileCoords.y,
      i: 0
    }];

    /* Pour chaque élément de la liste principale */
    var destinationTile: Point = null;
    for (var i = 0 ; i < mainList.length ; ++i)
    {
      /* Récupération des 4 cases autour */
      var adjacentTiles: Array<Point> = TileFunctions.getAdjacentTiles({
        x: mainList[i].x,
        y: mainList[i].y
      });

      /* Parcourt des 4 cases trouvées */
      for (var j = 0 ; j < 4 ; ++j)
      {
        /* Collision */
        var collisionDetected: boolean = this.checkCollision(adjacentTiles[j].x, adjacentTiles[j].y);
        /* La case a déjà été ajoutée */
        var alreadyAdded: boolean = false;

        /* Vérification si case a déjà été ajoutée (même coords et index inférieur ou égal) */
        for (var k = 0, l = mainList.length ; k < l ; ++k)
        {
          if (mainList[k].x == adjacentTiles[j].x && mainList[k].y == adjacentTiles[j].y && mainList[k].i <= i)
          {
            alreadyAdded = true;
            break;
          }
        }

        /* Arrêt de la boucle si la case de destination a été trouvée et qu'il faut pas faire demi-tour */
        if (adjacentTiles[j].x == currentTileCoords.x && adjacentTiles[j].y == currentTileCoords.y)
        {
          /* Toutes les cases qui représentent un chemin possible */
          var nextCases: Array<Point> = [];

          /* On vérifie qu'il faut pas faire demi-tour */
          for (k = mainList.length - 1 ; k >= 0 ; --k)
          {
            /* Le compteur précédent */
            if (mainList[k].i == mainList[i].i)
            {
              /* Si c'est bien collé */
              if (this.isNextTo(currentTileCoords, mainList[k]))
              {
                /* Et pas de demi-tour, alors ajout */
                if (!this.hasToGoBackwards(currentTileCoords, mainList[k]))
                  nextCases.push(mainList[k]);
              }
            }
            /* Pour ne pas parcourir les entrées inutilement */
            else if (mainList[k].i < mainList[i].i)
              break;
          }

          /* Récupération d'une des cases possibles */
          var random: number = Math.floor(Math.random() * nextCases.length);
          destinationTile = nextCases[random];

          break;
        }
        /* Pas de collision et pas déjà ajoutée, ajout dans la liste principale */
        else if (!collisionDetected && !alreadyAdded)
        {
          mainList.push({
            x: adjacentTiles[j].x,
            y: adjacentTiles[j].y,
            i: mainList[i].i + 1
          });
        }
      }

      /* Stop boucle, chemin trouvé */
      if (destinationTile != null)
        break;
    }

    /* Récupération de la bonne direction, par défaut la courante */
    var direction: number = this.direction;
    if (destinationTile != null)
    {
      /* Gauche */
      if (currentTileCoords.x == destinationTile.x + 1)
        direction = Directions.Left;
      /* Droite */
      if (currentTileCoords.x == destinationTile.x - 1)
        direction = Directions.Right;
      /* Haut */
      if (currentTileCoords.y == destinationTile.y + 1)
        direction = Directions.Up;
      /* Bas */
      if (currentTileCoords.y == destinationTile.y - 1)
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
  private hasToGoBackwards(fromTile: Point, toTile: Point): boolean
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
   *
   * @returns {Ghost}
   */
  public move(pacmanCenter: Point): Ghost
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
          var target: Point = this.targetTile(pacmanCenter);
          this.direction = this.findBestPath(target);

          break;

        case Modes.Frightened :

          break;

        /* Sort de la maison */
        case Modes.OutFromHome :

          /* Si case sur les côtés, il doit aller au milieu */
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
            this.direction = this.findBestPath({
              x: 7,
              y: 9
            });
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
    /* S'il vient de sortir de la maison */
    if (this.mode == Modes.OutFromHome && mode == Modes.Scatter)
      this.direction = Directions.Right;
    else if (this.mode == Modes.OutFromHome && mode == Modes.Chase)
      this.direction = Directions.Left;
    if (this.mode != Modes.Idle || force)
      this.mode = mode;

    /* Si scatter, changement de direction */
    if (this.mode == Modes.Scatter)
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
  protected targetTile(pacmanCenter: Point): Point
  {
    // TODO : Faire le bon calcul
    return TileFunctions.getTileCoordinates(pacmanCenter);
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
  protected targetTile(pacmanCenter: Point): Point
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
   *
   * @returns {null}
   */
  protected targetTile(pacmanCenter: Point): Point
  {
    return null;
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
  protected targetTile(pacmanCenter: Point): Point
  {
    return null;
  }
}