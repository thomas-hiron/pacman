/**
 * Created by mac pro on 05/03/2017.
 */

/**
 * Gère le score
 */
class Score
{
  private score: number = 0;

  /**
   * @returns {string}
   */
  public toString(): string
  {
    return 'Score : ' + this.score;
  }
}