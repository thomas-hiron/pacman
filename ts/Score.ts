/**
 * Created by mac pro on 05/03/2017.
 */

/**
 * Gère le score
 */
class Score
{
  private score: number;

  /**
   * Init
   *
   * @returns {Score}
   */
  public init(): Score
  {
    this.score = 0;

    return this;
  }

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

  /**
   * Met à jour le score
   *
   * @param ghostEatenNumber
   *
   * @returns {Score}
   */
  public updateWithGhost(ghostEatenNumber: number): Score
  {
    switch (ghostEatenNumber)
    {
      case 1:
        this.score += 200;
        break;
      case 2:
        this.score += 400;
        break;
      case 3:
        this.score += 800;
        break;
      case 4:
        this.score += 1600;
        break;
    }

    return this;
  }
}