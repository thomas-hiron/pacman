/**
 * Created by mac pro on 05/03/2017.
 */

/**
 * Gère tous les fruits
 */
class FruitsManager
{
  /* Durée d'un fruit */
  private static APPEARANCE_DURATION = 10 * 60;

  private frames: number;
  private hasFruit: boolean;

  public constructor()
  {
    /* Pour ajouter un fruit */
    Jeu.ELEMENT.addEventListener('AddNewFruit', this.newFruit.bind(this), false);
  }

  /**
   * Démarrage
   * @returns {FruitsManager}
   */
  public init(): FruitsManager
  {
    this.hasFruit = false;
    this.frames = 0;

    return this;
  }

  /**
   * Appelé à chaque nouvelle frame du jeu
   *
   * @returns {FruitsManager}
   */
  public onRequestAnimFrame(): FruitsManager
  {
    this.frames++;

    /* Suppression du fruit */
    if (this.hasFruit && this.frames > FruitsManager.APPEARANCE_DURATION)
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
    /* Redémarrage du compteur */
    this.frames = 0;
    this.hasFruit = true;

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
    Jeu.ELEMENT.dispatchEvent(event);

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
    this.init();

    /* Dispatch event */
    var event: CustomEvent = new CustomEvent('RemoveFruit');
    Jeu.ELEMENT.dispatchEvent(event);

    return this;
  }
}