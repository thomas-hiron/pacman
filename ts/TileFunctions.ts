/**
 * Created by thiron on 09/03/2017.
 */

/**
 * Classe avec des méthodes statiques traiter les cases
 */
class TileFunctions
{
  /**
   * Renvoie les 4 cases autour de la case courante
   *
   * @param tileCoords
   *
   * @returns {Point[]}
   */
  public static getAdjacentTiles(tileCoords: Point)
  {
    return [
      /* Gauche */
      {
        x: tileCoords.x - 1,
        y: tileCoords.y
      },
      /* Droite */
      {
        x: tileCoords.x + 1,
        y: tileCoords.y
      },
      /* Haut */
      {
        x: tileCoords.x,
        y: tileCoords.y - 1
      },
      /* Bas */
      {
        x: tileCoords.x,
        y: tileCoords.y + 1
      }
    ];
  }
}