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

  /**
   * Renvoie la case dont le param est le centre
   *
   * @param center
   *
   * @returns {{x: number, y: number}}
   */
  public static getTileCoordinates(center: Point): Point
  {
    var moduloX: number = center.x % Tile.TILE_WIDTH;
    var moduloY: number = center.y % Tile.TILE_WIDTH;

    /* Suppression pour avoir la case */
    return {
      x: (center.x - moduloX) / Tile.TILE_WIDTH,
      y: (center.y - moduloY) / Tile.TILE_WIDTH
    };
  }
}