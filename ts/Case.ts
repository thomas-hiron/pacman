/**
 * Created by thiron on 03/07/2015.
 */

class Case
{
  private wall:boolean;

  constructor()
  {
    this.wall = false;
  }

  /**
   * Getter/Setter
   *
   * @returns {boolean}
   */
  public isAWall(isAWall?:boolean):boolean
  {
    if (isAWall !== null)
      this.wall = isAWall;

    return this.wall;
  }
}
