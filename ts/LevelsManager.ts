/**
 * Created by thiron on 03/07/2015.
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
  private drawCase(canvas:Canvas, currentCase:Case):void
  {
    var context:CanvasRenderingContext2D = canvas.getContext();

    context.strokeStyle = "#012EB6";
    context.fillStyle = "#012EB6";
    context.lineJoin = "round";
    context.lineWidth = 2;

    var coordinates:Point = currentCase.getCoordinates();

    if (currentCase.hasBorderLeft())
    {
      /* Démarrage du tracé */
      context.beginPath();

      context.moveTo(coordinates.x * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
      context.lineTo(coordinates.x * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);

      context.stroke();
      context.closePath();
    }

    if (currentCase.hasBorderRight())
    {
      /* Démarrage du tracé */
      context.beginPath();

      context.moveTo((coordinates.x + 1) * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
      context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);

      context.stroke();
      context.closePath();
    }

    if (currentCase.hasBorderTop())
    {
      /* Démarrage du tracé */
      context.beginPath();

      context.moveTo(coordinates.x * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);
      context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, coordinates.y * Case.CASE_WIDTH);

      context.stroke();
      context.closePath();
    }

    if (currentCase.hasBorderBottom())
    {
      /* Démarrage du tracé */
      context.beginPath();

      context.moveTo(coordinates.x * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);
      context.lineTo((coordinates.x + 1) * Case.CASE_WIDTH, (coordinates.y + 1) * Case.CASE_WIDTH);

      context.stroke();
      context.closePath();
    }
  }
}