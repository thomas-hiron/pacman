/**
 * Created by thiron on 03/07/2015.
 */

/**
 * Gère et dessine les niveaux
 */
class LevelManager
{
  private level: Level;

  /* Nombre de points */
  private pacDotNumber: number;

  constructor()
  {
    this.level = new Level();
    this.pacDotNumber = 0;

    /* Listener food eaten */
    window.addEventListener('PacDotEaten', this.pacDotEaten.bind(this), false);
  }

  /**
   * Dessine le niveau dans le canvas
   *
   * @param canvas
   */
  public draw(canvas: Canvas): LevelManager
  {
    var cases: Array<Array<Case>> = this.getCases();

    /* Réinitialisation du nombre de points */
    this.pacDotNumber = 0;

    /* Parcourt de chaque ligne */
    for (var i: number = 0, l: number = cases.length; i < l; ++i)
    {
      var row: Array<Case> = cases[i];

      /* Parcourt de chaque case */
      for (var j: number = 0, k: number = row.length; j < k; ++j)
      {
        var currentCase: Case = row[j];

        /* Détermination des bordures à supprimer */
        var leftCase: Case = row[j - 1] || null;
        var rightCase: Case = row[j + 1] || null;
        var upCase: Case = cases[i - 1] != null ? cases[i - 1][j] : null;
        var downCase: Case = cases[i + 1] != null ? cases[i + 1][j] : null;

        /* Suppression des bordures */
        currentCase.hasBorderLeft(leftCase != null && currentCase.isAWall() && !leftCase.isAWall());
        currentCase.hasBorderRight(rightCase != null && currentCase.isAWall() && !rightCase.isAWall());
        currentCase.hasBorderTop(upCase != null && currentCase.isAWall() && !upCase.isAWall());
        currentCase.hasBorderBottom(downCase != null && currentCase.isAWall() && !downCase.isAWall());

        /* Dessine la case courante et le point */
        this.drawCase(canvas, currentCase);
        if (currentCase.hasPacDot())
        {
          this.drawPacDot(canvas, currentCase);

          /* Incrémentation du nombre de points */
          this.pacDotNumber++;
        }
      }
    }

    return this;
  }

  /**
   * Dessine la case courante
   *
   * @param canvas
   * @param currentCase
   */
  private drawCase(canvas: Canvas, currentCase: Case): LevelManager
  {
    var context: CanvasRenderingContext2D = canvas.getContext();

    context.beginPath();
    context.strokeStyle = "#012EB6";
    context.lineWidth = 4;

    var coordinates: Point = currentCase.getCoordinates();

    if (currentCase.hasBorderLeft())
    {
      context.moveTo(coordinates.x * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
      context.lineTo(coordinates.x * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
    }

    /* Bordure droite */
    if (currentCase.hasBorderRight())
    {
      context.moveTo((coordinates.x + 1) * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
      context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
    }

    /* Bordure haut */
    if (currentCase.hasBorderTop())
    {
      context.moveTo(coordinates.x * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
      context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
    }

    /* Bordure bas */
    if (currentCase.hasBorderBottom())
    {
      context.moveTo(coordinates.x * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
      context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
    }

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

    return this;
  }

  /**
   * Dessine le point
   *
   * @param canvas
   * @param currentCase
   *
   * @returns {LevelManager}
   */
  public drawPacDot(canvas: Canvas, currentCase: Case): LevelManager
  {
    if (currentCase.hasPacDot())
    {
      var context: CanvasRenderingContext2D = canvas.getContext();
      var coordinates: Point = currentCase.getCoordinates();

      var radius: number = currentCase.getPacDot() instanceof PowerPellet ? 6 : 3;
      var margin: number = Case.CASE_WIDTH / 2;

      context.beginPath();
      context.arc(coordinates.x * Case.CASE_WIDTH + margin, coordinates.y * Case.CASE_WIDTH + margin, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'white';
      context.strokeStyle = 'white';
      context.lineWidth = 0;
      context.fill();
      context.closePath();
    }

    return this;
  }

  /**
   * Récupère toutes les cases du niveau courant
   *
   * @returns {Array<Array<Case>>}
   */
  public getCases(): Array<Array<Case>>
  {
    return this.level.get();
  }

  /**
   * Lorsqu'un case a été mangée
   *
   * @param e
   *
   * @returns {LevelManager}
   */
  private pacDotEaten(e: CustomEvent): LevelManager
  {
    /* Les coordonées de la case courante */
    var coords: Point = e.detail;

    /* Récupération de la case courante */
    var cases: Array<Array<Case>> = this.getCases();
    var currentCase: Case = cases[coords.y][coords.x];

    /* Décrémentation s'il y a un point */
    if (currentCase.hasPacDot())
      this.pacDotNumber--;

    /* Niveau terminé */
    if (this.pacDotNumber <= 0)
    {
      var event: Event = new CustomEvent('LevelFinished');
      window.dispatchEvent(event);
    }

    return this;
  }

  /**
   * Récupère les gros points
   *
   * @returns {Array<Case>}
   */
  public getPowerPellet()
  {
    var cases: Array<Array<Case>> = this.getCases();
    var casesWithPowerPellet: Array<Case> = [];

    for (var i: number = 0, l: number = cases.length; i < l; ++i)
    {
      /* Parcourt de chaque case */
      for (var j: number = 0, k: number = cases[i].length; j < k; ++j)
      {
        if (cases[i][j].hasPowerPellet())
          casesWithPowerPellet.push(cases[i][j]);
      }
    }

    return casesWithPowerPellet;
  }
}