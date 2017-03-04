/**
 * Created by thiron on 03/07/2015.
 */

/**
 * Initialise le jeu, créer les niveaux, lance pacman, les fantomes,...
 */
class Jeu
{
  private static INTERVAL: number = 10;

  private canvas: Canvas;
  private pacman: Pacman;
  private time: number;
  private levelsManager: LevelsManager;

  public constructor()
  {
    this.time = +new Date();
  }

  /**
   * Initialise le jeu
   */
  public init(): Jeu
  {
    try
    {
      /* Initialisation du canvas */
      this.canvas = new Canvas(document.querySelector("canvas"));
    }
    catch (e)
    {
      /* Une erreur s'est produite, alert puis redirection */
      alert(e.message);
      window.location.href = "http://www.thomas-hiron.com";

      /* Retour de l'instance pour ne pas continuer le temps de la redirection */
      return this;
    }

    /* Le canvas pour dessiner les niveau */
    var canvasLevel: Canvas = new Canvas();
    canvasLevel.setSize(this.canvas.getElement().width, this.canvas.getElement().height);

    /* Les niveaux */
    this.levelsManager = new LevelsManager();
    this.levelsManager.draw(canvasLevel);

    /* Dessin du niveau */
    this.canvas.getContext().drawImage(canvasLevel.getElement(), 0, 0);

    /* Pacman */
    this.pacman = new Pacman();
    this.pacman.setCollideFunction(this.checkCollision.bind(this));
    this.pacman.init();

    /* Listener pour la nourriture mangée */
    window.addEventListener('FoodEaten', this.foodEaten.bind(this), false);

    /* RequestAnimationFrame pour le pacman, les fantomes */
    requestAnimFrame(this.draw.bind(this));

    return this;
  }

  /**
   * Dessine les différents éléments du jeu
   *
   * @returns {Jeu}
   */
  public draw(): Jeu
  {
    /* Si l'interval a été atteint */
    if (+new Date() - this.time > Jeu.INTERVAL)
    {
      /* Dessine la case courante si le point a pas été mangé pour pas le couper */
      this.drawCurrentFood();

      /* Animation de pacman */
      this.animatePacman();

      /* Mise à jour du temps */
      this.time = +new Date();
    }

    /* Animation suivante */
    requestAnimFrame(this.draw.bind(this));

    return this;
  }

  /**
   * Anime pacman et donne les instructions
   *
   * @returns {Jeu}
   */
  private animatePacman(): Jeu
  {
    var pacman: Pacman = this.pacman;
    /* Pour centrer dans la case */
    var margin: number = (Case.CASE_WIDTH - pacman.getSize().w) / 2;
    var ctx = this.canvas.getContext();

    /* Suppression du pacman courant */
    ctx.clearRect(pacman.getX() + margin, pacman.getY() + margin, pacman.getSize().w, pacman.getSize().h);

    /* Instruction de modification des coordonées */
    pacman.move();

    /* Instruction d'animation */
    pacman.animate();

    /* Dessin dans le canvas principal */
    ctx.drawImage(pacman.getCanvasElem(), pacman.getX() + margin, pacman.getY() + margin);

    return this;
  }

  /**
   * Dessine la nourriture si elle a pas été mangée
   *
   * @returns {Jeu}
   */
  private drawCurrentFood()
  {
    /* La case de pacman */
    var coords: Point = this.pacman.getPreviousCaseCoords();
    var margin: number = 5;

    /* Récupération de la case courante */
    var currentCasesLevel: Array<Array<Case>> = this.levelsManager.getCurrentCasesLevel();
    var currentCase: Case = currentCasesLevel[coords.y][coords.x];

    /* Case ok */
    if (currentCase != null && currentCase.hasFood())
    {
      var canvas: Canvas = new Canvas();
      canvas.setSize(this.canvas.getElement().width, this.canvas.getElement().height);

      /* Dessin */
      this.levelsManager.drawFood(canvas, currentCase);

      /* Dessin de la nourriture et suppression de l'ancienne */
      this.canvas.getContext().clearRect(coords.x * Case.CASE_WIDTH + margin, coords.y * Case.CASE_WIDTH + margin, 30, 30);
      this.canvas.getContext().drawImage(canvas.getElement(), 0, 0);
    }

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
  public checkCollision(x: number, y: number): boolean
  {
    var currentCasesLevel: Array<Array<Case>> = this.levelsManager.getCurrentCasesLevel();

    return currentCasesLevel[y] == void 0 || currentCasesLevel[y][x] === void 0 || currentCasesLevel[y][x].isAWall();
  }

  /**
   * Mange la nourriture
   *
   * @returns {Jeu}
   */
  public foodEaten(e: CustomEvent): Jeu
  {
    /* Les coordonées de la case courante */
    var coords: Point = e.detail;

    /* Récupération de la case courante */
    var currentCasesLevel: Array<Array<Case>> = this.levelsManager.getCurrentCasesLevel();
    var currentCase: Case = currentCasesLevel[coords.y][coords.x];

    /* Suppression de la nourriture */
    currentCase.setFood(null);

    return this;
  }
}