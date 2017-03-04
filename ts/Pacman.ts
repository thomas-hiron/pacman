/**
 * Created by thiron on 01/03/2017.
 */

/**
 * Le pacman, il gère tout seul le mouvement et l'animation pour manger
 */
class Pacman
{
  /**
   * Le canvas pour pacman
   */
  private canvas: Canvas;

  /**
   * La taille de pacman
   */
  private size: Size;

  /**
   * Les coordonnées de départ
   */
  private coordinates: Point;

  /**
   * La direction courante et la suivante
   */
  private direction: number;
  private nextDirection: number;

  /**
   * L'étape courante pour le dessin et le nombre d'animations
   */
  private currentStep: number;
  private stepNumber: number;

  /**
   * Le décalage en px lors du mouvement
   */
  private stepPx: number;

  /**
   * L'angle
   */
  private angle: number;

  /**
   * Pour détecter une collision (fonction dans Jeu)
   */
  private checkCollision: any;

  /**
   * @param callback
   *
   * @returns {Pacman}
   */
  public setCollideFunction(callback: any)
  {
    this.checkCollision = callback;
    return this;
  }

  /**
   * @returns {Size}
   */
  public getSize(): Size
  {
    return this.size;
  }

  /**
   * @returns {number}
   */
  public getX(): number
  {
    return this.coordinates.x;
  }

  /**
   * @returns {number}
   */
  public getY(): number
  {
    return this.coordinates.y;
  }

  /**
   * Renvoie le canvas de pacman pour pouvoir être dessiné dans le jeu
   *
   * @returns {HTMLCanvasElement}
   */
  public getCanvasElem(): HTMLCanvasElement
  {
    return this.canvas.getElement();
  }

  /**
   * Le constructeur qui initialise les variables
   */
  public constructor()
  {
    this.size = {
      w: 24,
      h: 24
    };

    this.coordinates = {
      x: 7 * Case.CASE_WIDTH,
      y: 11 * Case.CASE_WIDTH
    };

    this.currentStep = 0;
    this.stepNumber = 12;
    this.stepPx = 2;
    this.angle = 0;
  }

  /**
   * Initialisation
   *
   * @returns {Pacman}
   */
  public init(): Pacman
  {
    /* Création du canvas */
    this.canvas = new Canvas();

    /* Initialisation de la taille du canvas */
    this.canvas.setSize(this.size.w, this.size.h);

    /* Initialisation de la direction */
    this.direction = Directions.Right;
    this.nextDirection = this.direction;

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
  public rotate(e: KeyboardEvent): Pacman
  {
    e.preventDefault();

    /* Le code de la flèche touchée */
    var code: number = e.keyCode;

    /* Selon la flèche, on change le direction */
    switch (code)
    {
      case 37 :
        this.nextDirection = Directions.Left;
        break;
      case 38 :
        this.nextDirection = Directions.Up;
        break;
      case 39 :
        this.nextDirection = Directions.Right;
        break;
      case 40 :
        this.nextDirection = Directions.Down;
        break;
    }

    /* Retour de l'instance */
    return this;
  }

  /**
   * Anime le pacman et le dessine dans le canvas (methode draw)
   *
   * @returns {Pacman}
   */
  public animate(): Pacman
  {
    /* Augmentation de l'étape */
    this.currentStep++;

    /* Réinitialisation de l'étape si besoin */
    if (this.currentStep % this.stepNumber == 0)
      this.currentStep = 0;

    /* Dessin dans le canvas */
    this.draw();

    /* Retour de l'instance */
    return this;
  }

  /**
   * Modifie les coordonnées de pacman
   *
   * @returns {Pacman}
   */
  public move()
  {
    /* Largeur de la case */
    var caseWidth: number = Case.CASE_WIDTH;

    /* Pas de collision par défaut */
    var collisionWithNextDirection: boolean = false;
    var collisionWithCurrentDirection: boolean = false;

    /* Les nouvelles coordonnées */
    var newX: number = this.coordinates.x;
    var newY: number = this.coordinates.y;

    /* Si dans une case, on change de direction, si possible */
    if (this.coordinates.x % caseWidth == 0 && this.coordinates.y % caseWidth == 0)
    {
      /* Les cases suivantes en fonction de la direction courante et suivante */
      var nextCaseCoordsWithNextDirection: Point = this.getNextCaseCoords(this.nextDirection);
      var nextCaseCoordsWithCurrentDirection: Point = this.getNextCaseCoords(this.direction);

      /* Vérification que pas de collision */
      collisionWithNextDirection = this.checkCollision(nextCaseCoordsWithNextDirection.x, nextCaseCoordsWithNextDirection.y);
      collisionWithCurrentDirection = this.checkCollision(nextCaseCoordsWithCurrentDirection.x, nextCaseCoordsWithCurrentDirection.y);

      /* Changement de direction que si pas de collision avec la prochaine direction */
      if (!collisionWithNextDirection)
        this.direction = this.nextDirection;
    }
    else
    {
      /* Si on veut changer dans la direction opposée, faut le faire immédiatement */
      if (
        this.direction == Directions.Left && this.nextDirection == Directions.Right ||
        this.direction == Directions.Right && this.nextDirection == Directions.Left ||
        this.direction == Directions.Up && this.nextDirection == Directions.Down ||
        this.direction == Directions.Down && this.nextDirection == Directions.Up
      )
        this.direction = this.nextDirection
    }

    /* En fonction de la direction, modification des coords et de l'angle, si 15% dans la case, on supprime la bouffe */
    var percentInCase: number;
    switch (this.direction)
    {
      case Directions.Left:
        percentInCase = 100 - this.coordinates.x % caseWidth * 100 / caseWidth;
        newX -= this.stepPx;
        this.angle = 180;
        break;
      case Directions.Right:
        percentInCase = this.coordinates.x % caseWidth * 100 / caseWidth;
        newX += this.stepPx;
        this.angle = 0;
        break;
      case Directions.Up:
        percentInCase = 100 - this.coordinates.y % caseWidth * 100 / caseWidth;
        newY -= this.stepPx;
        this.angle = 270;
        break;
      case Directions.Down:
        percentInCase = this.coordinates.y % caseWidth * 100 / caseWidth;
        newY += this.stepPx;
        this.angle = 90;
        break;
    }

    /* Pas de collision, changement des coordonnées */
    if (!collisionWithNextDirection || !collisionWithCurrentDirection)
    {
      this.coordinates.x = newX;
      this.coordinates.y = newY;
    }

    /* Suppression du point */
    if (percentInCase == 15)
    {
      /* Les coordonées de la case */
      var nextCaseCoords: Point = this.getNextCaseCoords(this.direction);

      /* Round */
      nextCaseCoords.x = Math.abs(Math.round(nextCaseCoords.x));
      nextCaseCoords.y = Math.abs(Math.round(nextCaseCoords.y));

      var event: Event = new CustomEvent('FoodEaten', {'detail': nextCaseCoords});
      window.dispatchEvent(event);
    }

    /* Retour de l'instance */
    return this;
  }

  /**
   * Dessine le Pacman dans le canvas
   *
   * @returns {Pacman}
   */
  public draw(): Pacman
  {
    /* Le context du pacman */
    var ctx: CanvasRenderingContext2D = this.canvas.getContext();

    /* Taille */
    var size: Size = this.size;

    /* Largeur de la case */
    var caseWidth: number = Case.CASE_WIDTH;

    /* Suppression du context */
    ctx.clearRect(0, 0, size.w, size.h);

    /* Enregistrement du context */
    ctx.save();

    /* Translation */
    ctx.translate(size.w / 2, size.h / 2);

    /* Rotation */
    ctx.rotate(this.angle * Math.PI / 180);

    /* Translation inverse pour le remettre comme avant */
    ctx.translate(-size.w / 2, -size.h / 2);

    /* Couleur */
    ctx.fillStyle = "#FFFF00";

    /* Calcul pour le dessin */
    var inclinaison: number = this.currentStep * 0.25 / (this.stepNumber - 1);
    var inclinaison2: number = 1 - inclinaison;

    /* Dessin */
    ctx.beginPath();
    ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison * Math.PI, (inclinaison + 1) * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison2 * Math.PI, (inclinaison2 + 1) * Math.PI, false);
    ctx.fill();

    /* La marge */
    var margin: number = (caseWidth - size.w) / 2;

    /* Restauration du context */
    ctx.restore();

    /* Retour de l'instance */
    return this;
  }

  /**
   * Récupère les coordonnées de la case suivante en fonction d'une direction donnée
   *
   * @param direction
   *
   * @returns {Point}
   */
  private getNextCaseCoords(direction: number): Point
  {
    /* La case suivante avec la prochaine direction */
    var nextCaseCoords: Point = {
      x: this.coordinates.x / Case.CASE_WIDTH,
      y: this.coordinates.y / Case.CASE_WIDTH
    };

    /* Modification de la case suivante */
    switch (direction)
    {
      case Directions.Left:
        nextCaseCoords.x--;
        break;
      case Directions.Right:
        nextCaseCoords.x++;
        break;
      case Directions.Up:
        nextCaseCoords.y--;
        break;
      case Directions.Down:
        nextCaseCoords.y++;
        break;
    }

    return nextCaseCoords;
  }
}