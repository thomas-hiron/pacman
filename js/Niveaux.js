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
function Niveaux()
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
  niveau1: function() {

    var blocs = [

      [
        [0,0],
        [2,0],
        [2,1],
        [0,1],
        {
          width: 2,
          height: 1,
          x: 1,
          y: 1
        }
      ],

      [
        [0,0],
        [2,0],
        [2,1],
        [0,1],
        {
          width: 2,
          height: 1,
          x: 4,
          y: 1
        }
      ],

      [
        [0,0],
        [1,0],
        [1,2],
        [0,2],
        {
          width: 1,
          height: 2,
          x: 7,
          y: 0
        }
      ],

      [
        [0,0],
        [2,0],
        [2,1],
        [0,1],
        {
          width: 2,
          height: 1,
          x: 9,
          y: 1
        }
      ],

      [
        [0,0],
        [2,0],
        [2,1],
        [0,1],
        {
          width: 2,
          height: 1,
          x: 12,
          y: 1
        }
      ],

      [
        [0,0],
        [5,0],
        [5,3],
        [4,3],
        [4,1],
        [0,1],
        {
          width: 5,
          height: 3,
          x: 1,
          y: 3
        }
      ],

      [
        [0,0],
        [1,0],
        [1,3],
        [0,3],
        {
          width: 1,
          height: 3,
          x: 7,
          y: 3
        }
      ],

      [
        [0,0],
        [5,0],
        [5,1],
        [1,1],
        [1,3],
        [0,3],
        {
          width: 5,
          height: 3,
          x: 9,
          y: 3
        }
      ],

      [
        [0,0],
        [1,0],
        [1,2],
        [5,2],
        [5,3],
        [0,3],
        {
          width: 5,
          height: 3,
          x: 1,
          y: 5
        }
      ],

      [
        [0,0],
        [1,0],
        [1,1],
        [0,1],
        {
          width: 1,
          height: 1,
          x: 3,
          y: 5
        }
      ],

      [
        [0,0],
        [1,0],
        [1,1],
        [0,1],
        {
          width: 1,
          height: 1,
          x: 11,
          y: 5
        }
      ],

      [
          [0,2],
          [4,2],
          [4,0],
          [5,0],
          [5,3],
          [0,3],
        {
          width: 5,
          height: 3,
          x: 9,
          y: 5
        }
      ],

      [
        [0,0],
        [1,0],
        [1,1],
        [0,1],
        {
          width: 1,
          height: 1,
          x: 7,
          y: 7
        }
      ],

      [
        [0,0],
        [4,0],
        [4,1],
        [0,1],
        {
          width: 4,
          height: 1,
          x: 0,
          y: 9
        }
      ],

      [
        [0,0],
        [4,0],
        [4,1],
        [0,1],
        {
          width: 4,
          height: 1,
          x: 11,
          y: 9
        }
      ],

      [
        [0,0],
        [4,0],
        [4,4],
        [3,4],
        [3,1],
        [0,1],
        {
          width: 4,
          height: 4,
          x: 0,
          y: 11
        }
      ],

      [
        [0,0],
        [4,0],
        [4,1],
        [1,1],
        [1,4],
        [0,4],
        {
          width: 4,
          height: 4,
          x: 11,
          y: 11
        }
      ],

      [
        [0,0],
        [5,0],
        [5,1],
        [3,1],
        [3,3],
        [2,3],
        [2,1],
        [0,1],
        {
          width: 5,
          height: 3,
          x: 5,
          y: 12
        }
      ],

      [
        [0,0],
        [1,0],
        [1,1],
        [0,1],
        {
          width: 1,
          height: 1,
          x: 1,
          y: 13
        }
      ],

      [
        [0,0],
        [1,0],
        [1,1],
        [0,1],
        {
          width: 1,
          height: 1,
          x: 13,
          y: 13
        }
      ],

      [
        [0,1],
        [1,1],
        [1,2],
        [4,2],
        [4,0],
        [5,0],
        [5,3],
        [0,3],
        {
          width: 5,
          height: 3,
          x: 1,
          y: 14
        }
      ],

      [
        [0,0],
        [1,0],
        [1,2],
        [4,2],
        [4,1],
        [5,1],
        [5,3],
        [0,3],
        {
          width: 5,
          height: 3,
          x: 9,
          y: 14
        }
      ],

      [
        [0,2],
        [6,2],
        [6,0],
        [7,0],
        [7,2],
        [13,2],
        [13,3],
        [0,3],
        {
          width: 13,
          height: 3,
          x: 1,
          y: 16
        }
      ],
    ];

    /* Retour du tableau */
    return blocs;
  }

}