/**
 * Created by thiron on 03/07/2015.
 */

class Jeu
{
  private static INTERVAL = 50;

  private canvas:Canvas;
  private pacman:Object;
  private time:number;
  private levelsManager:LevelsManager;

  /**
   * Initialise le jeu
   */
  public init()
  {
    try
    {
      /* Initialisation du canvas */
      this.canvas = new Canvas(document.querySelector("canvas"));
      this.canvas.init();
    }
    catch (e)
    {
      /* Une erreur s'est produite, alert puis redirection */
      alert(e.message);
      window.location.href = "http://www.thomas-hiron.com";

      /* Retour de l'instance pour ne pas continuer le temps de la redirection */
      return this;
    }

    /* Les niveaux */
    this.levelsManager = new LevelsManager();
    this.levelsManager.draw(this.canvas);

    /* Pacman */
    var pacman:Pacman = new Pacman(this.canvas);
    pacman.init();

    /* TMP - démarrage du jeu */
    pacman.start();
  }
}