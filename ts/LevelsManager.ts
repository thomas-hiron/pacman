/**
 * Created by thiron on 03/07/2015.
 */

/**
 * Gère et dessine les niveaux
 */
class LevelsManager
{
  private currentLevel:number = 1;
  private levels:Levels;

  constructor()
  {
    this.levels = new Levels();
  }

  /**
   * Dessine le niveau dans le canvas
   *
   * @param canvas
   */
  public draw(canvas:Canvas):LevelsManager
  {
    var currentLevel:Array<Array<Case>> = this.levels.get(this.currentLevel);

    /* Prévention de bug */
    if (currentLevel == null)
      return this;

    /* Parcourt de chaque ligne */
    for (var i:number = 0, l:number = currentLevel.length; i < l; ++i)
    {
      var row:Array<Case> = currentLevel[i];

      /* Parcourt de chaque case */
      for (var j:number = 0, k:number = row.length; j < k; ++j)
      {
        var currentCase:Case = row[j];

        /* Détermination des bordures à supprimer */
        var leftCase:Case = row[j - 1] || null;
        var rightCase:Case = row[j + 1] || null;
        var upCase:Case = currentLevel[i - 1] != null ? currentLevel[i - 1][j] : null;
        var downCase:Case = currentLevel[i + 1] != null ? currentLevel[i + 1][j] : null;

        /* Suppression des bordures */
        currentCase.hasBorderLeft(leftCase != null && currentCase.isAWall() && !leftCase.isAWall());
        currentCase.hasBorderRight(rightCase != null && currentCase.isAWall() && !rightCase.isAWall());
        currentCase.hasBorderTop(upCase != null && currentCase.isAWall() && !upCase.isAWall());
        currentCase.hasBorderBottom(downCase != null && currentCase.isAWall() && !downCase.isAWall());

        /* Dessine la case courante */
        this.drawCase(canvas, currentCase);
      }
    }

    return this;
  }

  /**
   * Dessine la case courante
   *
   * @param currentCase
   */
  private drawCase(canvas:Canvas, currentCase:Case):LevelsManager
  {
    var context:CanvasRenderingContext2D = canvas.getContext();

    context.strokeStyle = "#012EB6";
    context.lineWidth = 4;

    var coordinates:Point = currentCase.getCoordinates();

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
   * Récupère toutes les cases du niveau courant
   *
   * @returns {Array<Array<Case>>}
   */
  public getCurrentCasesLevel():Array<Array<Case>>
  {
    return this.levels.get(this.currentLevel);
  }
}