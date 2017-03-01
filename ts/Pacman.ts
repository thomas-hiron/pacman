/**
 * Created by thiron on 01/03/2017.
 */

class Pacman
{
  /**
   * Le canvas pour pacman
   */
  private canvas:Canvas;

  /**
   * Le canvas du jeu
   */
  private gameCanvas:Canvas;

  /**
   * La taille de pacman
   */
  private size:Size;

  /**
   * Les coordonnées de départ
   */
  private coordinates:Point;

  /**
   * La direction courante et la suivante
   */
  private direction:number;
  private nextDirection:number;

  /**
   * L'étape courante pour le dessin et le nombre d'animations
   */
  private currentStep:number;
  private stepNumber:number;

  /**
   * L'interval pour requestAnimationFrame
   */
  private interval:number;

  /**
   * Le décalage en px lors du mouvement
   */
  private stepPx:number;

  /**
   * Le timestamp courant pour pas faire trop d'animations
   */
  private time:number;

  /**
   * Le constructeur qui initialise les variables
   *
   * @param gameCanvas
   */
  public constructor(gameCanvas:Canvas)
  {
    this.size = {
      w: 30,
      h: 30
    };

    this.coordinates = {
      x: 7 * Case.CASE_WIDTH,
      y: 11 * Case.CASE_WIDTH
    };

    this.gameCanvas = gameCanvas;
    this.stepNumber = 6;
    this.interval = 40;
    this.stepPx = 2;
    this.time = +new Date();
  }

  /**
   * Initialisation
   *
   * @returns {Pacman}
   */
  public init()
  {
    /* Création du canvas */
    this.canvas = new Canvas(document.createElement('CANVAS'));
    this.canvas.init();

    /* Initialisation de la taille du canvas */
    var canvas = this.canvas.getElement();
    canvas.width = this.size.w;
    canvas.height = this.size.h;

    /* Initialisation de la direction */
    this.nextDirection = Directions.Right;

    /* Ajout de l'event des flèches */
    window.addEventListener("keydown", this.rotate.bind(this), false);

    /* Retour de l'instance */
    return this;
  }

  /**
   * Modifie la valeur de nextDirection, ne fait rien d'autre
   *
   * @param e:KeyboardEvent
   *
   * @returns {Pacman}
   */
  public rotate(e:KeyboardEvent)
  {
    e.preventDefault();

    /* Le code de la flèche touchée */
    var code = e.keyCode;

    /* Les directions */
    var directions = Directions;

    /* Selon la flèche, on change le direction */
    switch (code)
    {
      case 37 :
        this.nextDirection = directions.Left;
        break;
      case 38 :
        this.nextDirection = directions.Up;
        break;
      case 39 :
        this.nextDirection = directions.Right;
        break;
      case 40 :
        this.nextDirection = directions.Down;
        break;
    }

    /* Retour de l'instance */
    return this;
  }
}