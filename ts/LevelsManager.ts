/**
 * Created by thiron on 03/07/2015.
 */

class LevelsManager
{
  private currentLevel:number = 1;
  private levels:Levels;

  constructor()
  {
    this.levels = new Levels();
  }

  /**
   * Dessine le niveau dans le canvas
   *
   * @param canvas
   */
  public draw(canvas:Canvas):LevelsManager
  {


    return this;
  }
}