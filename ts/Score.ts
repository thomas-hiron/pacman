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
  private static PAC_DOT = 10;
  private static POWER_PELLET = 50;

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
   * @param tile
   *
   * @returns {Score}
   */
  public update(tile: Tile)
  {
    if (tile.getPacDot() instanceof PacDot)
      this.score += tile.getPacDot().getScoreValue();

    return this;
  }
}