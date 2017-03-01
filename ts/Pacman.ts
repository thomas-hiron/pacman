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
  private size:Object;

  /**
   * Les coordonnées de départ
   */
  private coordinates:Object;

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
   */
  public constructor(canvas:Canvas)
  {
    this.size = {
      w: 30,
      h: 30
    };

    this.coordinates = {
      x: 7 * Case.CASE_WIDTH,
      y: 11 * Case.CASE_WIDTH
    };

    this.canvas = canvas;
    this.stepNumber = 6;
    this.interval = 40;
    this.stepPx = 2;
    this.time = +new Date();
  }
}