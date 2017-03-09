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
  private stepPx: number = 2;
  /* L'étape courante d'animation */
  private currentStep: number = 0;

  /* La méthode de détection de collison */
  private checkCollision: any;

  /**
   * Vise une case selon le caractère
   */
  protected abstract targetTile(): Tile;

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

    /* TMP, dessin d'un rectangle */
    var context: CanvasRenderingContext2D = this.canvas.getContext();
    context.fillStyle = this.color;
    context.rect(0, 0, Ghost.SIZE.w, Ghost.SIZE.h);
    context.fill();

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

          break;

        case Modes.Frightened :

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
    return this;
  }

  /**
   * Sort le fantôme de la maison
   *
   * @returns {Ghost}
   */
  public getOutFromHome(): Ghost
  {
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
   *
   * @returns {Ghost}
   */
  public changeMode(mode: number): Ghost
  {
    this.mode = mode;

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

    this.direction = Directions.Left;
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
   * @returns {null}
   */
  protected targetTile(): Tile
  {
    return null;
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

    this.direction = Directions.Left;
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
   * @returns {null}
   */
  protected targetTile(): Tile
  {
    return null;
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

    this.direction = Directions.Left;
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
   * @returns {null}
   */
  protected targetTile(): Tile
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

    this.direction = Directions.Left;
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
   * @returns {null}
   */
  protected targetTile(): Tile
  {
    return null;
  }
}