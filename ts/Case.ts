/**
 * Created by thiron on 03/07/2015.
 */

class Case
{
  public static CASE_WIDTH = 40;

  private food: Food;
  private wall: boolean;
  private coordinates: Point;

  private borderLeft: boolean;
  private borderRight: boolean;
  private borderTop: boolean;
  private borderBottom: boolean;

  constructor()
  {
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
  public isAWall(isAWall: boolean = null): boolean
  {
    if (isAWall !== null)
      this.wall = isAWall;

    return this.wall;
  }

  /**
   * S'il y a une bordure à gauche
   */
  public hasBorderLeft(hasBorder: boolean = null): boolean
  {
    if (hasBorder !== null)
      this.borderLeft = hasBorder;

    return this.borderLeft;
  }

  /**
   * S'il y a une bordure à droite
   */
  public hasBorderRight(hasBorder: boolean = null): boolean
  {
    if (hasBorder !== null)
      this.borderRight = hasBorder;

    return this.borderRight;
  }

  /**
   * S'il y a une bordure en haut
   */
  public hasBorderTop(hasBorder: boolean = null): boolean
  {
    if (hasBorder !== null)
      this.borderTop = hasBorder;

    return this.borderTop;
  }

  /**
   * S'il y a une bordure en bas
   */
  public hasBorderBottom(hasBorder: boolean = null): boolean
  {
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
  public setCoordinates(i: number, j: number): void
  {
    this.coordinates.x = i;
    this.coordinates.y = j;
  }

  /**
   * Retourne les coordonnées
   *
   * @returns {Point}
   */
  getCoordinates(): Point
  {
    return this.coordinates;
  }

  /**
   * Ajoute la bouffe
   *
   * @param food
   * @returns {Case}
   */
  public setFood(food: Food): Case
  {
    this.food = food;

    return this;
  }

  /**
   * S'il y a de la grosse bouffe
   *
   * @returns {boolean}
   */
  public hasBigFood(): boolean
  {
    return this.food != null && this.food instanceof BigFood;
  }

  /**
   * S'il y a de la bouffe
   *
   * @returns {boolean}
   */
  public hasFood(): boolean
  {
    return this.food != null;
  }
}
