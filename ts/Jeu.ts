/**
 * Created by thiron on 03/07/2015.
 */

class Jeu
{
  private static INTERVAL:number = 10;

  private canvas:Canvas;
  private pacman:Pacman;
  private time:number;
  private levelsManager:LevelsManager;

  public constructor()
  {
    this.time = +new Date();
  }

  /**
   * Initialise le jeu
   */
  public init():Jeu
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
    this.pacman = new Pacman();
    this.pacman.setCollideFunction(this.checkCollision.bind(this));
    this.pacman.init();

    /* TMP - démarrage du jeu */
    this.pacman.start();
    /* RequestAnimationFrame pour le pacman, les fantomes */
    requestAnimFrame(this.draw.bind(this));

    return this;
  }

  /**
   * Dessine les différents éléments du jeu
   *
   * @returns {Jeu}
   */
  public draw():Jeu
  {
    /* Si l'interval a été atteint */
    if (+new Date() - this.time > Jeu.INTERVAL)
    {
      var pacman:Pacman = this.pacman;
      var margin:number = (Case.CASE_WIDTH - pacman.getSize().w) / 2;

      /* Suppression puis dessin du pacman */
      this.canvas.getContext().clearRect(pacman.getX() + margin, pacman.getY() + margin, pacman.getSize().w, pacman.getSize().h);
      pacman.draw(this.canvas.getContext());

      /* Mise à jour du temps */
      this.time = +new Date();
    }

    /* Animation suivante */
    requestAnimFrame(this.draw.bind(this));

    return this;
  }

  /**
   * Vérifie qu'il n'y a pas de collision
   *
   * @param x
   * @param y
   *
   * @returns {boolean}
   */
  public checkCollision(x:number, y:number):boolean
  {
    var currentCasesLevel:Array<Array<Case>> = this.levelsManager.getCurrentCasesLevel();

    return currentCasesLevel[y] == void 0 || currentCasesLevel[y][x] === void 0 || currentCasesLevel[y][x].isAWall();
  }
}