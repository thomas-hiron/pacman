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
   * Pour détecter une collision (fonction dans Jeu)
   */
  private checkCollision;

  /**
   * @param callback
   *
   * @returns {Pacman}
   */
  public setCollideFunction(callback)
  {
    this.checkCollision = callback;
    return this;
  }

  /**
   * @returns {Size}
   */
  public getSize()
  {
    return this.size;
  }

  /**
   * @returns {number}
   */
  public getX()
  {
    return this.coordinates.x;
  }

  /**
   * @returns {number}
   */
  public getY()
  {
    return this.coordinates.y;
  }

  /**
   * Le constructeur qui initialise les variables
   *
   * @param gameCanvas
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

  /**
   * Démarre le requestAnimationFrame
   *
   * @returns {Pacman}
   */
  public start()
  {
    /* Animation suivante */
    requestAnimFrame(this.animate.bind(this));

    return this;
  }

  /**
   * Anime le pacman
   *
   * @returns {Pacman}
   */
  public animate()
  {
    /* Si l'interval a été atteind */
    if (+new Date() - this.time > this.interval)
    {
      /* On augmente l'étape */
      this.currentStep++;

      /* Réinitialisation de l'étape si besoin */
      if (this.currentStep % this.stepNumber == 0)
        this.currentStep = 0;

      /* Mise à jour du temps */
      this.time = +new Date();
    }

    /* Animation suivante */
    requestAnimFrame(this.animate.bind(this));

    /* Retour de l'instance */
    return this;
  }

  /**
   * Dessine le Pacman
   *
   * @returns {Pacman}
   */
  public draw(gameCtx:CanvasRenderingContext2D)
  {
    /* L'angle du dessin */
    var angle:number = 0;

    /* Le context du pacman */
    var ctx:CanvasRenderingContext2D = this.canvas.getContext();

    /* Taille */
    var size:Size = this.size;

    /* Largeur de la case */
    var caseWidth:number = Case.CASE_WIDTH;

    /* Pas de collision par défaut */
    var collisionWithNextDirection:boolean = false;
    var collisionWithCurrentDirection:boolean = false;

    /* Les nouvelles coordonnées */
    var newX = this.coordinates.x;
    var newY = this.coordinates.y;

    /* Si dans une case, on change de direction, si possible */
    if (this.coordinates.x % caseWidth == 0 && this.coordinates.y % caseWidth == 0)
    {
      /* Les cases suivantes en fonction de la direction courante et suivante */
      var nextCaseCoordsWithNextDirection:Point = this.getNextCaseCoords(this.nextDirection);
      var nextCaseCoordsWithCurrentDirection:Point = this.getNextCaseCoords(this.direction);

      /* Vérification que pas de collision */
      collisionWithNextDirection = this.checkCollision(nextCaseCoordsWithNextDirection.x, nextCaseCoordsWithNextDirection.y);
      collisionWithCurrentDirection = this.checkCollision(nextCaseCoordsWithCurrentDirection.x, nextCaseCoordsWithCurrentDirection.y);

      /* Changement de direction que si pas de collision avec la prochaine direction */
      if (!collisionWithNextDirection)
        this.direction = this.nextDirection;
    }

    /* En fonction de la direction, modification des coords et de l'angle */
    switch (this.direction)
    {
      case Directions.Left:
        newX -= this.stepPx;
        angle = 180;
        break;
      case Directions.Right:
        newX += this.stepPx;
        angle = 0;
        break;
      case Directions.Up:
        newY -= this.stepPx;
        angle = 270;
        break;
      case Directions.Down:
        newY += this.stepPx;
        angle = 90;
        break;
    }

    /* Pas de collision, changement des coordonnées */
    if (!collisionWithNextDirection || !collisionWithCurrentDirection)
    {
      this.coordinates.x = newX;
      this.coordinates.y = newY;
    }

    /* Suppression du context */
    ctx.clearRect(0, 0, size.w, size.h);

    /* Enregistrement du context */
    ctx.save();

    /* Translation */
    ctx.translate(size.w / 2, size.h / 2);

    /* Rotation */
    ctx.rotate(angle * Math.PI / 180);

    /* Translation inverse pour le remettre comme avant */
    ctx.translate(-size.w / 2, -size.h / 2);

    /* Couleur */
    ctx.fillStyle = "#FFFF00";

    /* Calcul pour le dessin */
    var inclinaison:number = this.currentStep * 0.25 / (this.stepNumber - 1);
    var inclinaison2:number = 1 - inclinaison;

    /* Dessin */
    ctx.beginPath();
    ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison * Math.PI, (inclinaison + 1) * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison2 * Math.PI, (inclinaison2 + 1) * Math.PI, false);
    ctx.fill();

    /* La marge */
    var margin = (caseWidth - size.w) / 2;

    /* Dessin dans le canvas du jeu */
    gameCtx.drawImage(ctx.canvas, this.getX() + margin, this.getY() + margin);

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
  private getNextCaseCoords(direction:number)
  {
    /* La case suivante avec la prochaine direction */
    var nextCaseCoords:Point = {
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