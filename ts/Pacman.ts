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
    var angle = 0;

    /* Le context du pacman */
    var ctx = this.canvas.getContext();

    /* Les directions */
    var directions = Directions;

    /* Taille */
    var size = this.size;

    /* Suppression du context */
    ctx.clearRect(0, 0, size.w, size.h);

    /* Changement de l'angle en fonction de la direction */
    switch (this.direction)
    {
      case directions.Left:
        angle = 180;
        break;
      case directions.Up:
        angle = 270;
        break;
      case directions.Right:
        angle = 0;
        break;
      case directions.Down:
        angle = 90;
        break;
    }

    /* -- Dessin du pacman dans le context courant -- */

    /* Coordonnées */
    var x = this.coordinates.x;
    var y = this.coordinates.y;
    var newX = x;
    var newY = y;
    var currentDirection = this.direction;
    var caseWidth = Case.CASE_WIDTH;

    /* On peut changer de direction */
    if (x % caseWidth == 0 && y % caseWidth == 0)
      currentDirection = this.nextDirection;

    /* Selon la direction */
    switch (currentDirection)
    {
      case directions.Left  :
      case directions.Right :

        /* Y OK, on change le X */
        if (y % caseWidth == 0)
        {
          if (currentDirection == directions.Left)
            newX = x - this.stepPx;
          else
            newX = x + this.stepPx;

          /* Vérification de collision */
          var caseNumberX = parseInt(x / caseWidth);
          var caseNumberY = parseInt(y / caseWidth);

          if (currentDirection == directions.Right)
            ++caseNumberX;

          //var collide = jeu.checkCollision(caseNumberX, caseNumberY);
          //
          //if (!collide)
          this.coordinates.x = newX;

          /* Changement de la direction */
          if (currentDirection == directions.Left || currentDirection == directions.Right)
            this.direction = currentDirection;
        }

        /* Teste si sens inverse */
        if (this.direction == directions.Left && this.nextDirection == directions.Right ||
          this.direction == directions.Right && this.nextDirection == directions.Left)
          this.direction = this.nextDirection;

        break;

      case directions.Up    :
      case directions.Down  :

        /* X OK, on change le Y */
        if (x % caseWidth == 0)
        {
          if (currentDirection == directions.Up)
            newY = y - this.stepPx;
          else
            newY = y + this.stepPx;

          /* Vérification de collision */
          var caseNumberX = parseInt(x / caseWidth);
          var caseNumberY = parseInt(y / caseWidth);

          if (currentDirection == directions.Down)
            ++caseNumberY;

          //var collide = jeu.checkCollision(caseNumberX, caseNumberY);
          //
          //if (!collide)
          this.coordinates.y = newY;

          /* Changement de la direction */
          if (currentDirection == directions.Up || currentDirection == directions.Down)
            this.direction = currentDirection;
        }

        /* Teste si sens inverse */
        if (this.direction == directions.Up && this.nextDirection == directions.Down ||
          this.direction == directions.Down && this.nextDirection == directions.Up)
          this.direction = this.nextDirection;

        break;
    }

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
    var et           = this.currentStep,
        inclinaison  = et * 0.25 / (this.stepNumber - 1),
        inclinaison2 = 1 - inclinaison;

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
}