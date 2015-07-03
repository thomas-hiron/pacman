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
    cases[0][7].isAWall(true);
    cases[1][1].isAWall(true);
    cases[1][2].isAWall(true);
    cases[1][4].isAWall(true);
    cases[1][5].isAWall(true);
    cases[1][7].isAWall(true);
    cases[1][9].isAWall(true);
    cases[1][10].isAWall(true);
    cases[1][12].isAWall(true);
    cases[1][13].isAWall(true);
    cases[3][1].isAWall(true);
    cases[3][2].isAWall(true);
    cases[3][3].isAWall(true);
    cases[3][4].isAWall(true);
    cases[3][5].isAWall(true);
    cases[3][7].isAWall(true);
    cases[3][9].isAWall(true);
    cases[3][10].isAWall(true);
    cases[3][11].isAWall(true);
    cases[3][12].isAWall(true);
    cases[3][13].isAWall(true);
    cases[4][5].isAWall(true);
    cases[4][7].isAWall(true);
    cases[4][9].isAWall(true);
    cases[5][1].isAWall(true);
    cases[5][3].isAWall(true);
    cases[5][5].isAWall(true);
    cases[5][7].isAWall(true);
    cases[5][9].isAWall(true);
    cases[5][11].isAWall(true);
    cases[5][13].isAWall(true);
    cases[6][1].isAWall(true);
    cases[6][13].isAWall(true);
    cases[7][1].isAWall(true);
    cases[7][2].isAWall(true);
    cases[7][3].isAWall(true);
    cases[7][4].isAWall(true);
    cases[7][5].isAWall(true);
    cases[7][7].isAWall(true);
    cases[7][9].isAWall(true);
    cases[7][10].isAWall(true);
    cases[7][11].isAWall(true);
    cases[7][12].isAWall(true);
    cases[7][13].isAWall(true);
    cases[9][0].isAWall(true);
    cases[9][1].isAWall(true);
    cases[9][2].isAWall(true);
    cases[9][3].isAWall(true);
    cases[9][11].isAWall(true);
    cases[9][12].isAWall(true);
    cases[9][13].isAWall(true);
    cases[9][14].isAWall(true);
    cases[11][0].isAWall(true);
    cases[11][1].isAWall(true);
    cases[11][2].isAWall(true);
    cases[11][3].isAWall(true);
    cases[11][11].isAWall(true);
    cases[11][12].isAWall(true);
    cases[11][13].isAWall(true);
    cases[11][14].isAWall(true);
    cases[12][3].isAWall(true);
    cases[12][5].isAWall(true);
    cases[12][6].isAWall(true);
    cases[12][7].isAWall(true);
    cases[12][8].isAWall(true);
    cases[12][9].isAWall(true);
    cases[12][11].isAWall(true);
    cases[13][1].isAWall(true);
    cases[13][3].isAWall(true);
    cases[13][7].isAWall(true);
    cases[13][11].isAWall(true);
    cases[13][13].isAWall(true);
    cases[14][3].isAWall(true);
    cases[14][5].isAWall(true);
    cases[14][7].isAWall(true);
    cases[14][9].isAWall(true);
    cases[14][11].isAWall(true);
    cases[15][1].isAWall(true);
    cases[15][5].isAWall(true);
    cases[15][9].isAWall(true);
    cases[15][13].isAWall(true);
    cases[16][1].isAWall(true);
    cases[16][2].isAWall(true);
    cases[16][3].isAWall(true);
    cases[16][4].isAWall(true);
    cases[16][5].isAWall(true);
    cases[16][7].isAWall(true);
    cases[16][9].isAWall(true);
    cases[16][10].isAWall(true);
    cases[16][11].isAWall(true);
    cases[16][12].isAWall(true);
    cases[16][13].isAWall(true);
    cases[17][7].isAWall(true);
    cases[18][1].isAWall(true);
    cases[18][2].isAWall(true);
    cases[18][3].isAWall(true);
    cases[18][4].isAWall(true);
    cases[18][5].isAWall(true);
    cases[18][6].isAWall(true);
    cases[18][7].isAWall(true);
    cases[18][8].isAWall(true);
    cases[18][9].isAWall(true);
    cases[18][10].isAWall(true);
    cases[18][11].isAWall(true);
    cases[18][12].isAWall(true);
    cases[18][13].isAWall(true);

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