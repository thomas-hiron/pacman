/**
 * Created by thiron on 03/07/2015.
 */

class Case
{
  public static CASE_WIDTH = 40;

  private wall:boolean;
  private coordinates:Point;

  private borderLeft:boolean;
  private borderRight:boolean;
  private borderTop:boolean;
  private borderBottom:boolean;

  constructor()
  {
    this.wall = false;

    this.coordinates = {
      x: 0,
      y: 0
    }

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
  public isAWall(isAWall:boolean = null):boolean
  {
    if (isAWall !== null)
      this.wall = isAWall;

    return this.wall;
  }

  /**
   * S'il y a une bordure à gauche
   */
  hasBorderLeft(hasBorder:boolean = null):boolean
  {
    if (hasBorder !== null)
      this.borderLeft = hasBorder;

    return this.borderLeft;
  }

  /**
   * S'il y a une bordure à droite
   */
  hasBorderRight(hasBorder:boolean = null):boolean
  {
    if (hasBorder !== null)
      this.borderRight = hasBorder;

    return this.borderRight;
  }

  /**
   * S'il y a une bordure en haut
   */
  hasBorderTop(hasBorder:boolean = null):boolean
  {
    if (hasBorder !== null)
      this.borderTop = hasBorder;

    return this.borderTop;
  }

  /**
   * S'il y a une bordure en bas
   */
  hasBorderBottom(hasBorder:boolean = null):boolean
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
  setCoordinates(i:number, j:number):void
  {
    this.coordinates.x = i;
    this.coordinates.y = j;
  }

  /**
   * Retourne les coordonnées
   *
   * @returns {Point}
   */
  getCoordinates():Point
  {
    return this.coordinates;
  }
}
