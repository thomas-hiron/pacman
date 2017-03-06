/**
 * Created by mac pro on 06/03/2017.
 */

/**
 * Un fantôme
 */
abstract class Ghost
{
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

  /**
   * Vise une case selon le caractère
   */
  protected abstract targetTile(): Tile;

  /**
   * Renvoie la direction à prendre pour arriver le plus rapidement à la case ciblée
   *
   * @returns {number}
   */
  private findBestPath(): number
  {
    return 0;
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
      x: 0,
      y: 0
    };
    this.cornerCoordinates = {
      x: 0,
      y: 0
    };
    this.color = '#000000';
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
      x: 0,
      y: 0
    };
    this.cornerCoordinates = {
      x: 0,
      y: 0
    };
    this.color = '#000000';
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
      x: 0,
      y: 0
    };
    this.cornerCoordinates = {
      x: 0,
      y: 0
    };
    this.color = '#000000';
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
      x: 0,
      y: 0
    };
    this.cornerCoordinates = {
      x: 0,
      y: 0
    };
    this.color = '#000000';
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