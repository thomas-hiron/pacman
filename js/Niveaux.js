/**
 * Created by ThomasHiron on 29/08/2014.
 *
 * Contient le templating de tous les niveaux
 */

/**
 * Objet Niveaux, permette d'obtenir le template des niveaux
 *
 * @constructor
 */
function Niveaux ()
{

}

/**
 * Prototype de Niveaux, chaque niveau est constitué de gauche à droite puis de haut en bas.
 * Le tracé d'un bloc commence dans le coin haut gauche et se dessine dans le sens des aiguilles d'une montre
 *
 * @type {{}}
 */
Niveaux.prototype = {

  /**
   * Le niveau 1
   *
   * @returns {[]}
   */
  niveau1: function ()
  {
    var blocs = [
      [
        [0, 0],
        [2, 0],
        [2, 1],
        [0, 1],
        {
          width: 2,
          height: 1,
          x: 1,
          y: 1
        }
      ],

      [
        [0, 0],
        [2, 0],
        [2, 1],
        [0, 1],
        {
          width: 2,
          height: 1,
          x: 4,
          y: 1
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 2],
        [0, 2],
        {
          width: 1,
          height: 2,
          x: 7,
          y: 0
        }
      ],

      [
        [0, 0],
        [2, 0],
        [2, 1],
        [0, 1],
        {
          width: 2,
          height: 1,
          x: 9,
          y: 1
        }
      ],

      [
        [0, 0],
        [2, 0],
        [2, 1],
        [0, 1],
        {
          width: 2,
          height: 1,
          x: 12,
          y: 1
        }
      ],

      [
        [0, 0],
        [5, 0],
        [5, 3],
        [4, 3],
        [4, 1],
        [0, 1],
        {
          width: 5,
          height: 3,
          x: 1,
          y: 3
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 3],
        [0, 3],
        {
          width: 1,
          height: 3,
          x: 7,
          y: 3
        }
      ],

      [
        [0, 0],
        [5, 0],
        [5, 1],
        [1, 1],
        [1, 3],
        [0, 3],
        {
          width: 5,
          height: 3,
          x: 9,
          y: 3
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 2],
        [5, 2],
        [5, 3],
        [0, 3],
        {
          width: 5,
          height: 3,
          x: 1,
          y: 5
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        {
          width: 1,
          height: 1,
          x: 3,
          y: 5
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        {
          width: 1,
          height: 1,
          x: 11,
          y: 5
        }
      ],

      [
        [0, 2],
        [4, 2],
        [4, 0],
        [5, 0],
        [5, 3],
        [0, 3],
        {
          width: 5,
          height: 3,
          x: 9,
          y: 5
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        {
          width: 1,
          height: 1,
          x: 7,
          y: 7
        }
      ],

      [
        [0, 0],
        [4, 0],
        [4, 1],
        [0, 1],
        {
          width: 4,
          height: 1,
          x: 0,
          y: 9
        }
      ],

      [
        [0, 0],
        [4, 0],
        [4, 1],
        [0, 1],
        {
          width: 4,
          height: 1,
          x: 11,
          y: 9
        }
      ],

      [
        [0, 0],
        [4, 0],
        [4, 4],
        [3, 4],
        [3, 1],
        [0, 1],
        {
          width: 4,
          height: 4,
          x: 0,
          y: 11
        }
      ],

      [
        [0, 0],
        [4, 0],
        [4, 1],
        [1, 1],
        [1, 4],
        [0, 4],
        {
          width: 4,
          height: 4,
          x: 11,
          y: 11
        }
      ],

      [
        [0, 0],
        [5, 0],
        [5, 1],
        [3, 1],
        [3, 3],
        [2, 3],
        [2, 1],
        [0, 1],
        {
          width: 5,
          height: 3,
          x: 5,
          y: 12
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        {
          width: 1,
          height: 1,
          x: 1,
          y: 13
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        {
          width: 1,
          height: 1,
          x: 13,
          y: 13
        }
      ],

      [
        [0, 1],
        [1, 1],
        [1, 2],
        [4, 2],
        [4, 0],
        [5, 0],
        [5, 3],
        [0, 3],
        {
          width: 5,
          height: 3,
          x: 1,
          y: 14
        }
      ],

      [
        [0, 0],
        [1, 0],
        [1, 2],
        [4, 2],
        [4, 1],
        [5, 1],
        [5, 3],
        [0, 3],
        {
          width: 5,
          height: 3,
          x: 9,
          y: 14
        }
      ],

      [
        [0, 2],
        [6, 2],
        [6, 0],
        [7, 0],
        [7, 2],
        [13, 2],
        [13, 3],
        [0, 3],
        {
          width: 13,
          height: 3,
          x: 1,
          y: 16
        }
      ],
    ];

    /* Les blocs avec cases */
    var cases = new Array (20);

    for (var i = 0, l = cases.length; i < l; ++i)
    {
      cases[i] = new Array (15);

      for(var j = 0, k = cases[i].length ; j < k ; ++j)
        cases[i][j] = new Case();
    }

    /* On rempli toutes les cases murs */
    cases[0][7].setIsAWall(true);
    cases[1][1].setIsAWall(true);
    cases[1][2].setIsAWall(true);
    cases[1][4].setIsAWall(true);
    cases[1][5].setIsAWall(true);
    cases[1][7].setIsAWall(true);
    cases[1][9].setIsAWall(true);
    cases[1][10].setIsAWall(true);
    cases[1][12].setIsAWall(true);
    cases[1][13].setIsAWall(true);
    cases[3][1].setIsAWall(true);
    cases[3][2].setIsAWall(true);
    cases[3][3].setIsAWall(true);
    cases[3][4].setIsAWall(true);
    cases[3][5].setIsAWall(true);
    cases[3][7].setIsAWall(true);
    cases[3][9].setIsAWall(true);
    cases[3][10].setIsAWall(true);
    cases[3][11].setIsAWall(true);
    cases[3][12].setIsAWall(true);
    cases[3][13].setIsAWall(true);
    cases[4][5].setIsAWall(true);
    cases[4][7].setIsAWall(true);
    cases[4][9].setIsAWall(true);
    cases[5][1].setIsAWall(true);
    cases[5][3].setIsAWall(true);
    cases[5][5].setIsAWall(true);
    cases[5][7].setIsAWall(true);
    cases[5][9].setIsAWall(true);
    cases[5][11].setIsAWall(true);
    cases[5][13].setIsAWall(true);
    cases[6][1].setIsAWall(true);
    cases[6][13].setIsAWall(true);
    cases[7][1].setIsAWall(true);
    cases[7][2].setIsAWall(true);
    cases[7][3].setIsAWall(true);
    cases[7][4].setIsAWall(true);
    cases[7][5].setIsAWall(true);
    cases[7][7].setIsAWall(true);
    cases[7][9].setIsAWall(true);
    cases[7][10].setIsAWall(true);
    cases[7][11].setIsAWall(true);
    cases[7][12].setIsAWall(true);
    cases[7][13].setIsAWall(true);
    cases[9][0].setIsAWall(true);
    cases[9][1].setIsAWall(true);
    cases[9][2].setIsAWall(true);
    cases[9][3].setIsAWall(true);
    cases[9][11].setIsAWall(true);
    cases[9][12].setIsAWall(true);
    cases[9][13].setIsAWall(true);
    cases[9][14].setIsAWall(true);
    cases[11][0].setIsAWall(true);
    cases[11][1].setIsAWall(true);
    cases[11][2].setIsAWall(true);
    cases[11][3].setIsAWall(true);
    cases[11][11].setIsAWall(true);
    cases[11][12].setIsAWall(true);
    cases[11][13].setIsAWall(true);
    cases[11][14].setIsAWall(true);
    cases[12][3].setIsAWall(true);
    cases[12][5].setIsAWall(true);
    cases[12][6].setIsAWall(true);
    cases[12][7].setIsAWall(true);
    cases[12][8].setIsAWall(true);
    cases[12][9].setIsAWall(true);
    cases[12][11].setIsAWall(true);
    cases[13][1].setIsAWall(true);
    cases[13][3].setIsAWall(true);
    cases[13][7].setIsAWall(true);
    cases[13][11].setIsAWall(true);
    cases[13][13].setIsAWall(true);
    cases[14][3].setIsAWall(true);
    cases[14][5].setIsAWall(true);
    cases[14][7].setIsAWall(true);
    cases[14][9].setIsAWall(true);
    cases[14][11].setIsAWall(true);
    cases[15][1].setIsAWall(true);
    cases[15][5].setIsAWall(true);
    cases[15][9].setIsAWall(true);
    cases[15][13].setIsAWall(true);
    cases[16][1].setIsAWall(true);
    cases[16][2].setIsAWall(true);
    cases[16][3].setIsAWall(true);
    cases[16][4].setIsAWall(true);
    cases[16][5].setIsAWall(true);
    cases[16][7].setIsAWall(true);
    cases[16][9].setIsAWall(true);
    cases[16][10].setIsAWall(true);
    cases[16][11].setIsAWall(true);
    cases[16][12].setIsAWall(true);
    cases[16][13].setIsAWall(true);
    cases[17][7].setIsAWall(true);
    cases[18][1].setIsAWall(true);
    cases[18][2].setIsAWall(true);
    cases[18][3].setIsAWall(true);
    cases[18][4].setIsAWall(true);
    cases[18][5].setIsAWall(true);
    cases[18][6].setIsAWall(true);
    cases[18][7].setIsAWall(true);
    cases[18][8].setIsAWall(true);
    cases[18][9].setIsAWall(true);
    cases[18][10].setIsAWall(true);
    cases[18][11].setIsAWall(true);
    cases[18][12].setIsAWall(true);
    cases[18][13].setIsAWall(true);

    /* Retour du tableau */
    return [blocs, cases];
  }

}