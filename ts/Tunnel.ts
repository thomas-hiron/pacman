/**
 * Created by mac pro on 25/03/2017.
 */

class Tunnel
{
  /**
   * Gère l'entrée dans le tunnel
   * @returns {Tunnel}
   */
  public static checkEntry(coords, context, margin, pacman): Tunnel
  {
    /* Gestion du tunnel à droite */
    if (coords.x >= 14 * Tile.TILE_WIDTH && coords.y == 10 * Tile.TILE_WIDTH)
    {
      var x: number = coords.x - context.canvas.width;
      context.clearRect(x, coords.y + margin + Jeu.TOP_HEIGHT, Pacman.SIZE.w + margin + 2, Tile.TILE_WIDTH - margin * 2);
      context.drawImage(pacman.getCanvasElem(), x + margin, coords.y + margin + Jeu.TOP_HEIGHT);

      /* Terminé */
      pacman.setX(x);
      if (x > -10)
      {
        /* Point mangé */
        var event: CustomEvent = new CustomEvent('PacDotEaten', {detail: {x: 0, y: 10}});
        Jeu.ELEMENT.dispatchEvent(event);
      }
    }
    /* A gauche */
    else if (coords.x <= 0 && coords.y == 10 * Tile.TILE_WIDTH)
    {
      var x: number = coords.x + context.canvas.width;
      context.clearRect(x + margin - 2, coords.y + margin + Jeu.TOP_HEIGHT, Pacman.SIZE.w + margin, Tile.TILE_WIDTH - margin * 2);
      context.drawImage(pacman.getCanvasElem(), x + margin, coords.y + margin + Jeu.TOP_HEIGHT);

      pacman.setX(x);

      /* Point mangé */
      if (x > 14 * Tile.TILE_WIDTH + 10)
      {
        var event: CustomEvent = new CustomEvent('PacDotEaten', {detail: {x: 14, y: 10}});
        Jeu.ELEMENT.dispatchEvent(event);
      }
    }

    return this;
  }
}