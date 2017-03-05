/**
 * Created by mac pro on 05/03/2017.
 */

/**
 * Gère tous les fruits
 */
class FruitsManager
{
  /* Chaque fois qu'un fruit apparait */
  private static APPEARANCE_INTEVERVAL = 1000;

  private startTime: number;

  /**
   * Démarrage
   * @returns {FruitsManager}
   */
  public start(): FruitsManager
  {
    this.startTime = +new Date();

    return this;
  }

  /**
   * Appelé à chaque nouvelle frame du jeu
   *
   * @returns {FruitsManager}
   */
  public onRequestAnimFrame(): FruitsManager
  {
    /* Un nouveau fruit au bout de 30 secondes */
    if (this.startTime != null && +new Date() - this.startTime > FruitsManager.APPEARANCE_INTEVERVAL)
      this.newFruit();

    return this;
  }

  /**
   * Ajoute un fruit
   *
   * @returns {FruitsManager}
   */
  private newFruit(): FruitsManager
  {
    /* Suppression du startTime */
    this.startTime = null;

    // TODO : ajouter un fruit au hasard

    return this;
  }
}