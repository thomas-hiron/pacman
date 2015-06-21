/**
 * Created by ThomasHiron on 29/08/2014.
 */

function Case()
{
  var isAWall = false;

  /**
   * Getter
   *
   * @returns {boolean}
   */
  this.isAWall = function() {
    return isAWall;
  }

  /**
   * Setter
   *
   * @param int param
   * @returns Case
   */
  this.setIsAWall = function(param) {
    isAWall = param;

    /* Retour de l'instance */
    return this;
  }
}