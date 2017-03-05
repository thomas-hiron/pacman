/**
 * Created by mac pro on 04/03/2017.
 */

/**
 * De la bouffe normale
 */
class PacDot
{
  public static SCORE_VALUE = 10;
  protected scoreValue: number = PacDot.SCORE_VALUE;

  public getScoreValue(): number
  {
    return this.scoreValue;
  }
}

/**
 * De la bouffe qui permet de manger les fantômes
 */
class PowerPellet extends PacDot
{
  public static SCORE_VALUE = 50;
  protected scoreValue:number = PowerPellet.SCORE_VALUE;
}