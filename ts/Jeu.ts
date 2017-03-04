/**
 * Created by thiron on 03/07/2015.
 */

/**
 * Initialise le jeu, créer les niveaux, lance pacman, les fantomes,...
 */
class Jeu
{
  /* Interval du request animation frame */
  private static INTERVAL: number = 10;
  /* Hauteur du panneau supérieur */
  private static TOP_HEIGHT: number = 40;

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
    this.canvas.getContext().drawImage(canvasLevel.getElement(), 0, Jeu.TOP_HEIGHT);

    /* Dessin du haut */
    this.drawTop();

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
  private draw(): Jeu
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
    ctx.clearRect(pacman.getX() + margin, pacman.getY() + margin + Jeu.TOP_HEIGHT, pacman.getSize().w, pacman.getSize().h);

    /* Instruction de modification des coordonées */
    pacman.move();

    /* Instruction d'animation */
    pacman.animate();

    /* Dessin dans le canvas principal */
    ctx.drawImage(pacman.getCanvasElem(), pacman.getX() + margin, pacman.getY() + margin + Jeu.TOP_HEIGHT);

    return this;
  }

  /**
   * Dessine la nourriture si elle a pas été mangée
   *
   * @returns {Jeu}
   */
  private drawCurrentFood(): Jeu
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
      this.canvas.getContext().clearRect(coords.x * Case.CASE_WIDTH + margin, coords.y * Case.CASE_WIDTH + margin + Jeu.TOP_HEIGHT, 30, 30);
      this.canvas.getContext().drawImage(canvas.getElement(), 0, Jeu.TOP_HEIGHT);
    }

    return this;
  }

  /**
   * Dessine le haut
   *
   * @returns {Jeu}
   */
  private drawTop(): Jeu
  {
    var context: CanvasRenderingContext2D = this.canvas.getContext();

    context.beginPath();
    context.strokeStyle = "#012EB6";
    context.lineWidth = 4;

    /* Toute la bordure */
    context.moveTo(0, Jeu.TOP_HEIGHT);
    context.lineTo(this.canvas.getElement().width, Jeu.TOP_HEIGHT);
    context.lineTo(this.canvas.getElement().width, this.canvas.getElement().height);
    context.lineTo(0, this.canvas.getElement().height);
    context.lineTo(0, Jeu.TOP_HEIGHT);

    /* Bordure */
    context.stroke();

    /* Pour faire la bordure double */
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 2;
    context.stroke();

    /* Le contexte par défaut */
    context.globalCompositeOperation = 'source-over';

    /* Fermeture du path */
    context.closePath();

    /* Propriété des fonts */
    context.fillStyle = 'white';
    context.font = "16px Arial";

    /* Affichage du score */
    context.fillText("Score : 0", 10, Jeu.TOP_HEIGHT / 2 + 5);

    /* Affichage du titre */
    context.textAlign = 'center';
    context.fillText("Pacman", this.canvas.getElement().width / 2, Jeu.TOP_HEIGHT / 2 + 5);

    /* Affichage du niveau */
    context.textAlign = 'right';
    context.fillText("Niveau 1", this.canvas.getElement().width - 10, Jeu.TOP_HEIGHT / 2 + 5);

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
  private checkCollision(x: number, y: number): boolean
  {
    var currentCasesLevel: Array<Array<Case>> = this.levelsManager.getCurrentCasesLevel();

    return currentCasesLevel[y] == void 0 || currentCasesLevel[y][x] === void 0 || currentCasesLevel[y][x].isAWall();
  }

  /**
   * Mange la nourriture
   *
   * @returns {Jeu}
   */
  private foodEaten(e: CustomEvent): Jeu
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