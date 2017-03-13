/**
 * Created by mac pro on 13/03/2017.
 */

class PathFinder
{
  /* La distance du chemin trouvé */
  private distance: number;

  /* La prochaine case où le fantôme ira */
  private nextTile: Point = null;

  /**
   * @returns {number}
   */
  public getDistance(): number
  {
    return this.distance;
  }

  /**
   * @returns {Point}
   */
  public getNextTile(): Point
  {
    return this.nextTile;
  }

  /**
   * Détermine le meilleur chemin
   *
   * @param fromCoords
   * @param toCoords
   * @param checkCollisionCB
   * @param hasToGoBackwardsCB
   *
   * @returns {PathFinder}
   */
  public findPath(fromCoords: Point, toCoords: Point, checkCollisionCB: any, hasToGoBackwardsCB: any): PathFinder
  {
    /* La liste principale, initialisée avec la case, contient toutes les cases permettant de tracer le chemin */
    var mainList: Array<PointIndexed> = [{
      x: fromCoords.x,
      y: fromCoords.y,
      i: 0,
      parent: null
    }];

    /* Récupération des cases où il peut aller */
    var currentAdjacentTiles: Array<Point> = TileFunctions.getAdjacentTiles(fromCoords);
    /* Mélange des cases pour faire un chemin aléatoire quand il y aura plusieurs possibilités */
    Functions.shuffle(currentAdjacentTiles);
    for (var i = 0 ; i < currentAdjacentTiles.length ; ++i)
    {
      var collisionDetected: boolean = checkCollisionCB(currentAdjacentTiles[i].x, currentAdjacentTiles[i].y);
      if (!collisionDetected && !hasToGoBackwardsCB(fromCoords, currentAdjacentTiles[i]))
      {
        /* Si case juste à côté, pas besoin de faire des calculs pour rien */
        if (currentAdjacentTiles[i].x == toCoords.x && currentAdjacentTiles[i].y == toCoords.y)
        {
          if (!hasToGoBackwardsCB(fromCoords, currentAdjacentTiles[i]))
          {
            this.distance = 1;
            this.nextTile = currentAdjacentTiles[i];
            mainList = [];
            break;
          }
        }

        /* Ajoute à la liste si trop loin */
        mainList.push({
          x: currentAdjacentTiles[i].x,
          y: currentAdjacentTiles[i].y,
          i: 1,
          parent: currentAdjacentTiles[i]
        });
      }
    }

    /* Pour chaque élément de la liste principale, on part des cases où il est possible d'aller directement */
    for (i = 1 ; i < mainList.length ; ++i)
    {
      /* Récupération des 4 cases autour */
      var adjacentTiles: Array<Point> = TileFunctions.getAdjacentTiles({
        x: mainList[i].x,
        y: mainList[i].y
      });

      /* Parcourt des 4 cases trouvées */
      for (var j = 0 ; j < 4 ; ++j)
      {
        /* Collision */
        var collisionDetected: boolean = checkCollisionCB(adjacentTiles[j].x, adjacentTiles[j].y);
        /* La case a déjà été ajoutée */
        var alreadyAdded: boolean = false;

        /* Vérification si case a déjà été ajoutée (même coords et index inférieur ou égal) */
        for (var k = 0, l = mainList.length ; k < l ; ++k)
        {
          /* Si la case a les mêmes coordonées et le même parent et index inférieur */
          if (
            mainList[k].x == adjacentTiles[j].x && mainList[k].y == adjacentTiles[j].y && mainList[k].i <= i &&
            (
              mainList[k].parent == null ||
              mainList[k].parent.x == mainList[i].parent.x && mainList[k].parent.y == mainList[i].parent.y
            )
          )
          {
            alreadyAdded = true;
            break;
          }
        }

        /* Pas de collision et pas déjà ajoutée, ajout dans la liste principale */
        if (!collisionDetected && !alreadyAdded)
        {
          mainList.push({
            x: adjacentTiles[j].x,
            y: adjacentTiles[j].y,
            i: mainList[i].i + 1,
            parent: mainList[i].parent
          });
        }

        /* Arrêt de la boucle si la case de destination a été trouvée et qu'il faut pas faire demi-tour, i > 2 si jamais le fantôme est sur la case de destination */
        if (adjacentTiles[j].x == toCoords.x && adjacentTiles[j].y == toCoords.y && i > 2)
        {
          this.distance = mainList[i].i;
          this.nextTile = mainList[i].parent;
          break;
        }
      }

      /* Stop boucle, chemin trouvé */
      if (this.nextTile != null)
        break;
    }

    return this;
  }
}