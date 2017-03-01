/**
 * Created by thiron on 03/07/2015.
 */

class Levels
{
  private levels:Array<Array<Array<Case>>>;

  constructor()
  {
    this.levels = [];

    this.constructLevel1();
  }

  /**
   * Niveau 1
   */
  private constructLevel1():void
  {
    /* Les blocs avec cases */
    var cases:Array<Array<Case>> = new Array(20);

    for (var i = 0, l = cases.length; i < l; ++i)
    {
      cases[i] = new Array(15);

      for (var j = 0, k = cases[i].length; j < k; ++j)
      {
        cases[i][j] = new Case();
        cases[i][j].setCoordinates(j, i);
      }
    }

    /* On rempli toutes les cases murs */
    var casesCoords:Array<Array> = [
      [0, 7],
      [1, 1], [1, 2], [1, 4], [1, 5], [1, 7], [1, 9], [1, 10], [1, 12], [1, 13],
      [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 7], [3, 9], [3, 10], [3, 11], [3, 12], [3, 13],
      [4, 5], [4, 7], [4, 9],
      [5, 1], [5, 3], [5, 5], [5, 7], [5, 9], [5, 11], [5, 13],
      [6, 1], [6, 13],
      [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 7], [7, 9], [7, 10], [7, 11], [7, 12], [7, 13],
      [9, 0], [9, 1], [9, 2], [9, 3], [9, 11], [9, 12], [9, 13], [9, 14],
      [11, 0], [11, 1], [11, 2], [11, 3], [11, 11], [11, 12], [11, 13], [11, 14],
      [12, 3], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 11],
      [13, 1], [13, 3], [13, 7], [13, 11], [13, 13],
      [14, 3], [14, 5], [14, 7], [14, 9], [14, 11],
      [15, 1], [15, 5], [15, 9], [15, 13],
      [16, 1], [16, 2], [16, 3], [16, 4], [16, 5], [16, 7], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13],
      [17, 7],
      [18, 1], [18, 2], [18, 3], [18, 4], [18, 5], [18, 6], [18, 7], [18, 8], [18, 9], [18, 10], [18, 11], [18, 12], [18, 13]
    ];

    /* Déclaration de tous les murs */
    for (i = 0, l = casesCoords.length; i < l; ++i)
      cases[casesCoords[i][0]][casesCoords[i][1]].isAWall(true);

    /* Ajout des cases */
    this.levels.push(cases);
  }

  /**
   * Retourne le tableau désiré
   *
   * @param currentLevel
   */
  get(currentLevel:number):Array<Array<Case>>
  {
    var level:Array<Array<Case>> = this.levels[currentLevel - 1] || null;

    return level;
  }
}