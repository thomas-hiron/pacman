/**
 * Created by mac pro on 05/03/2017.
 */

/**
 * Gère le score
 */
class Score
{
  private score: number = 0;

  /* Constantes de score */
  private static FOOD = 10;
  private static BIG_FOOD = 50;

  /**
   * @returns {string}
   */
  public toString(): string
  {
    return 'Score : ' + this.score;
  }

  /**
   * Augmente le score en fonction de la case
   *
   * @param currentCase
   *
   * @returns {Score}
   */
  public update(currentCase: Case)
  {
    if (currentCase.hasBigFood())
      this.score += Score.BIG_FOOD;
    else if (currentCase.hasFood())
      this.score += Score.FOOD;

    return this;
  }
}