/**
 * Created by thiron on 03/07/2015.
 */

class Canvas
{
  private element: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  /**
   * Le constructeur
   * @param canvas
   */
  constructor(canvas: Element = null)
  {
    /* Init si null */
    if (canvas == null)
      canvas = document.createElement('CANVAS');

    this.element = <HTMLCanvasElement>canvas;

    /* Erreur */
    if (!this.element || !this.element.getContext)
      throw new Error("Le canvas n'est pas pris en charge par votre navigateur");

    /* Initialisation du context */
    this.context = this.element.getContext("2d");

    /* Erreur */
    if (!this.context)
      throw new Error("Le canvas n'est pas pris en charge par votre navigateur");

    /* Retour de l'instance */
    return this;
  }

  /**
   * Getter du contexte
   *
   * @returns {CanvasRenderingContext2D}
   */
  public getContext(): CanvasRenderingContext2D
  {
    return this.context;
  }

  /**
   * Getter de l'élément
   *
   * @returns {HTMLCanvasElement}
   */
  public getElement(): HTMLCanvasElement
  {
    return this.element;
  }

  /**
   * Initialise la taille
   *
   * @param width
   * @param height
   *
   * @returns {Canvas}
   */
  public setSize(width: number, height: number): Canvas
  {
    this.element.width = width;
    this.element.height = height;

    return this;
  }

  /**
   * Nettoie le canvas
   *
   * @returns {Canvas}
   */
  public clear(): Canvas
  {
    this.context.clearRect(0, 0, this.element.width, this.element.height);

    return this;
  }
}