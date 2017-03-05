/**
 * Created by mac pro on 05/03/2017.
 */

/**
 * Gère tous les fruits
 */
class FruitsManager
{
  /* Chaque fois qu'un fruit apparait */
  private static APPEARANCE_INTEVERVAL = 30000;
  private static APPEARANCE_DURATION = 10000;

  /* Démarrage du conteur d'ajout de fruit */
  private startTime: number;
  /* Démarrage du conteur de suppression de fruit */
  private addTime: number;

  /**
   * Démarrage
   * @returns {FruitsManager}
   */
  public start(): FruitsManager
  {
    this.startTime = +new Date();
    this.addTime = null;

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
    else if (this.addTime != null && +new Date() - this.addTime > FruitsManager.APPEARANCE_DURATION)
      this.removeFruit();

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

    /* Ajout du addTime */
    this.addTime = +new Date();

    /* Les proba de chaque fruit, en se basant à 1 seule chance pour la clé */
    var keyProbability: number = 1;
    var bellProbability: number = keyProbability + Key.SCORE_VALUE / Bell.SCORE_VALUE;
    var galaxianProbability: number = bellProbability + Key.SCORE_VALUE / Galaxian.SCORE_VALUE;
    var melonProbability: number = galaxianProbability + Key.SCORE_VALUE / Melon.SCORE_VALUE;
    var appleProbability: number = melonProbability + Key.SCORE_VALUE / Apple.SCORE_VALUE;
    var orangeProbability: number = appleProbability + Key.SCORE_VALUE / Orange.SCORE_VALUE;
    var strawberryProbability: number = orangeProbability + Key.SCORE_VALUE / Strawberry.SCORE_VALUE;
    var cherryProbability: number = strawberryProbability + Key.SCORE_VALUE / Cherry.SCORE_VALUE;

    /* Récupération dans l'interval trouvé */
    var random: number = Math.round(Math.random() * (cherryProbability - keyProbability) + keyProbability);
    var fruit: Fruit;

    /* Instanciation du bon fruit */
    if (random <= keyProbability)
      fruit = new Key();
    else if (random <= bellProbability)
      fruit = new Bell();
    else if (random <= galaxianProbability)
      fruit = new Galaxian();
    else if (random <= melonProbability)
      fruit = new Melon();
    else if (random <= appleProbability)
      fruit = new Apple();
    else if (random <= orangeProbability)
      fruit = new Orange();
    else if (random <= strawberryProbability)
      fruit = new Strawberry();
    else
      fruit = new Cherry();

    /* Dispatch event pour que le jeu l'ajoute */
    var event: CustomEvent = new CustomEvent('NewFruit', {'detail': fruit});
    window.dispatchEvent(event);

    return this;
  }

  /**
   * Supprime un fruit
   *
   * @returns {FruitsManager}
   */
  private removeFruit(): FruitsManager
  {
    /* Démarrage */
    this.start();

    /* Dispatch event */
    var event: CustomEvent = new CustomEvent('RemoveFruit');
    window.dispatchEvent(event);

    return this;
  }
}