///<reference path='Tile.ts' />
///<reference path='Pacman.ts' />
/**
 * Created by thiron on 03/07/2015.
 */

/**
 * Gère le design des niveaux
 */
class Level
{
  private tiles: Array<Array<Tile>>;

  /**
   * Init
   *
   * @returns {Level}
   */
  public init(): Level
  {
    /* Les blocs avec cases */
    this.tiles = new Array(20);

    for (var i: number = 0, l: number = this.tiles.length ; i < l ; ++i)
    {
      this.tiles[i] = new Array(15);

      for (var j = 0, k = this.tiles[i].length ; j < k ; ++j)
      {
        this.tiles[i][j] = new Tile();
        this.tiles[i][j].setCoordinates(j, i);
      }
    }

    /* On rempli toutes les cases murs */
    var wallsCoordinates: Array<Array<number>> = [
      [0, 7],
      [1, 1], [1, 2], [1, 4], [1, 5], [1, 7], [1, 9], [1, 10], [1, 12], [1, 13],
      [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 7], [3, 9], [3, 10], [3, 11], [3, 12], [3, 13],
      [4, 5], [4, 7], [4, 9],
      [5, 1], [5, 3], [5, 5], [5, 7], [5, 9], [5, 11], [5, 13],
      [6, 1], [6, 13],
      [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 7], [7, 9], [7, 10], [7, 11], [7, 12], [7, 13],
      [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 10], [9, 11], [9, 12], [9, 13], [9, 14],
      [11, 0], [11, 1], [11, 2], [11, 3], [11, 5], [11, 6], [11, 7], [11, 8], [11, 9], [11, 11], [11, 12], [11, 13], [11, 14],
      [12, 3], [12, 7], [12, 11],
      [13, 1], [13, 3], [13, 5], [13, 7], [13, 9], [13, 11], [13, 13],
      [14, 3], [14, 5], [14, 7], [14, 9], [14, 11],
      [15, 1], [15, 5], [15, 9], [15, 13],
      [16, 1], [16, 2], [16, 3], [16, 4], [16, 5], [16, 7], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13],
      [17, 7],
      [18, 1], [18, 2], [18, 3], [18, 4], [18, 5], [18, 6], [18, 7], [18, 8], [18, 9], [18, 10], [18, 11], [18, 12], [18, 13]
    ];

    /* Le conteneur des fantomes */
    wallsCoordinates.push([9, 6]);
    wallsCoordinates.push([9, 7]);
    wallsCoordinates.push([9, 8]);

    /* Déclaration de tous les murs */
    for (i = 0, l = wallsCoordinates.length ; i < l ; ++i)
      this.tiles[wallsCoordinates[i][0]][wallsCoordinates[i][1]].isAWall(true);

    /* Sinon on met un point */
    for (i = 0, l = this.tiles.length ; i < l ; ++i)
    {
      for (j = 0, k = this.tiles[i].length ; j < k ; ++j)
      {
        /* Ajout du point */
        if (!this.tiles[i][j].isAWall())
          this.tiles[i][j].setPacDot(new PacDot());
      }
    }

    /* Ajout des power pellet, y d'abord */
    this.tiles[2][1].setPacDot(new PowerPellet());
    this.tiles[2][13].setPacDot(new PowerPellet());
    this.tiles[12][2].setPacDot(new PowerPellet());
    this.tiles[12][12].setPacDot(new PowerPellet());

    /* Suppression de la case où y'a pacman */
    this.tiles[Pacman.BASE_Y][Pacman.BASE_X].setPacDot(null);

    return this;
  }

  /**
   * Retourne le tableau désiré
   *
   * @returns {Array<Array<Tile>>}
   */
  public get(): Array<Array<Tile>>
  {
    return this.tiles;
  }
}