/**
 * Created by mac pro on 25/03/2017.
 */

class Tunnel
{
  /**
   * Gère l'entrée dans le tunnel
   *
   * @returns {Tunnel}
   */
  public static checkEntry(object: any, context: CanvasRenderingContext2D, margin: number): Tunnel
  {
    var isGhost: boolean = object instanceof Ghost;
    var canvas: HTMLCanvasElement = object.getCanvasElem();
    var coords: Point = object.getCoordinates();

    /* Vers la droite */
    var toTheRight: boolean = coords.x >= 14 * Tile.TILE_WIDTH && coords.y == 10 * Tile.TILE_WIDTH;
    var toTheLeft: boolean = coords.x <= 0 && coords.y == 10 * Tile.TILE_WIDTH;

    /* Si bien rentré */
    if (toTheLeft || toTheRight)
    {
      var x: number = toTheRight ? coords.x - context.canvas.width : coords.x + context.canvas.width;

      /* Suppression puis dessin */
      if (toTheRight)
        context.clearRect(x, coords.y + margin + Jeu.TOP_HEIGHT, Pacman.SIZE.w + margin + 2, Tile.TILE_WIDTH - margin * 2);
      else
        context.clearRect(x + margin - 2, coords.y + margin + Jeu.TOP_HEIGHT, Pacman.SIZE.w + margin, Tile.TILE_WIDTH - margin * 2);
      context.drawImage(canvas, x + margin, coords.y + margin + Jeu.TOP_HEIGHT);

      /* Modification du x à la moitié du tunnel */
      if (toTheRight && x >= -Tile.TILE_WIDTH / 2 || toTheLeft && x <= 14 * Tile.TILE_WIDTH + Tile.TILE_WIDTH / 2)
        object.setX(x);

      if (!isGhost && (toTheRight && x > -10 || toTheLeft && x <= 14 * Tile.TILE_WIDTH + 10))
      {
        /* Point mangé */
        var event: CustomEvent = new CustomEvent('PacDotEaten', {detail: {x: toTheRight ? 0 : 14, y: 10}});
        Jeu.ELEMENT.dispatchEvent(event);
      }
      /* Ralentissement si fantome */
      else if (isGhost)
      {
        if (toTheRight && x <= -Tile.TILE_WIDTH || toTheLeft && x >= 15 * Tile.TILE_WIDTH)
          object.speedUp();
        else
          object.slow();
      }
    }

    return this;
  }
}