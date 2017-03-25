/**
 * Created by thiron on 03/07/2015.
 */

/**
 * Gère et dessine les niveaux
 */
class LevelManager
{
  private level: Level;

  /* Nombre de points */
  private pacDotNumber: number;
  private pacDotNumberTotal: number;

  constructor()
  {
    this.level = new Level();
    this.pacDotNumber = 0;

    /* Listener food eaten */
    Jeu.ELEMENT.addEventListener('PacDotEaten', this.pacDotEaten.bind(this), false);
  }

  /**
   * Init
   *
   * @returns {LevelManager}
   */
  public init(): LevelManager
  {
    this.level.init();

    return this;
  }

  /**
   * Dessine le niveau dans le canvas
   *
   * @param canvas
   */
  public draw(canvas: Canvas): LevelManager
  {
    var tiles: Array<Array<Tile>> = this.getTiles();

    /* Réinitialisation du nombre de points */
    this.pacDotNumber = 0;

    /* Parcourt de chaque ligne */
    for (var i: number = 0, l: number = tiles.length ; i < l ; ++i)
    {
      var row: Array<Tile> = tiles[i];

      /* Parcourt de chaque case */
      for (var j: number = 0, k: number = row.length ; j < k ; ++j)
      {
        var tile: Tile = row[j];

        /* Détermination des bordures à supprimer */
        var leftTile: Tile = row[j - 1] || null;
        var rightTile: Tile = row[j + 1] || null;
        var upTile: Tile = tiles[i - 1] != null ? tiles[i - 1][j] : null;
        var downTile: Tile = tiles[i + 1] != null ? tiles[i + 1][j] : null;

        /* Suppression des bordures */
        tile.hasBorderLeft(leftTile != null && tile.isAWall() && !leftTile.isAWall());
        tile.hasBorderRight(rightTile != null && tile.isAWall() && !rightTile.isAWall());
        tile.hasBorderTop(upTile != null && tile.isAWall() && !upTile.isAWall());
        tile.hasBorderBottom(downTile != null && tile.isAWall() && !downTile.isAWall());

        /* Dessine la case courante et le point */
        this.drawTile(canvas, tile);
        if (tile.hasPacDot())
        {
          this.drawPacDot(canvas, tile);

          /* Incrémentation du nombre de points */
          this.pacDotNumber++;
        }
      }
    }

    /* Pour faire sortir les fantômes */
    this.pacDotNumberTotal = this.pacDotNumber;

    return this;
  }

  /**
   * Dessine la case courante
   *
   * @param canvas
   * @param tile
   */
  private drawTile(canvas: Canvas, tile: Tile): LevelManager
  {
    var context: CanvasRenderingContext2D = canvas.getContext();

    context.beginPath();
    context.strokeStyle = "#012EB6";
    context.lineWidth = 4;
    var j: number = Jeu.TOP_HEIGHT;

    var coordinates: Point = tile.getCoordinates();

    if (tile.hasBorderLeft())
    {
      context.moveTo(coordinates.x * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
      context.lineTo(coordinates.x * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
    }

    /* Bordure droite */
    if (tile.hasBorderRight())
    {
      context.moveTo((coordinates.x + 1) * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
      context.lineTo((coordinates.x + 1) * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
    }

    /* Bordure haut */
    if (tile.hasBorderTop())
    {
      context.moveTo(coordinates.x * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
      context.lineTo((coordinates.x + 1) * Tile.TILE_WIDTH, coordinates.y * Tile.TILE_WIDTH + j);
    }

    /* Bordure bas */
    if (tile.hasBorderBottom())
    {
      context.moveTo(coordinates.x * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
      context.lineTo((coordinates.x + 1) * Tile.TILE_WIDTH, (coordinates.y + 1) * Tile.TILE_WIDTH + j);
    }

    /* Bordure */
    context.stroke();

    /* Pour faire la bordure double */
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 2;
    context.stroke();

    /* Le contexte par défaut */
    context.globalCompositeOperation = 'source-over';

    /* Fermeture du path */
    context.closePath();

    return this;
  }

  /**
   * Dessine le point
   *
   * @param canvas
   * @param tile
   *
   * @returns {LevelManager}
   */
  public drawPacDot(canvas: Canvas, tile: Tile): LevelManager
  {
    if (tile.hasPacDot())
    {
      var context: CanvasRenderingContext2D = canvas.getContext();
      var coordinates: Point = tile.getCoordinates();

      var radius: number = tile.getPacDot() instanceof PowerPellet ? 6 : 3;
      var margin: number = Tile.TILE_WIDTH / 2;

      context.beginPath();
      context.arc(coordinates.x * Tile.TILE_WIDTH + margin, coordinates.y * Tile.TILE_WIDTH + margin + Jeu.TOP_HEIGHT, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'white';
      context.strokeStyle = 'white';
      context.lineWidth = 0;
      context.fill();
      context.closePath();
    }

    return this;
  }

  /**
   * Récupère toutes les cases du niveau courant
   *
   * @returns {Array<Array<Tile>>}
   */
  public getTiles(): Array<Array<Tile>>
  {
    return this.level.get();
  }

  /**
   * Lorsqu'un case a été mangée
   *
   * @param e
   *
   * @returns {LevelManager}
   */
  private pacDotEaten(e: CustomEvent): LevelManager
  {
    /* Les coordonées de la case courante */
    var coords: Point = e.detail;

    /* Récupération de la case courante */
    var tiles: Array<Array<Tile>> = this.getTiles();
    var tile: Tile = tiles[coords.y][coords.x];

    /* Décrémentation s'il y a un point */
    if (tile != void 0 && tile.hasPacDot() && !(tile.getPacDot() instanceof Fruit))
    {
      this.pacDotNumber--;

      /* Si 30 points mangés, Inky sort */
      if (this.pacDotNumberTotal - this.pacDotNumber == GhostsManager.INKY_DOT_TO_GO)
      {
        var event = new CustomEvent('InkyCanGo');
        Jeu.ELEMENT.dispatchEvent(event);
      }
      /* Si un tier des points mangés, Clyde sort */
      if (this.pacDotNumberTotal - this.pacDotNumber == Math.round(this.pacDotNumberTotal / 3))
      {
        var event = new CustomEvent('ClydeCanGo');
        Jeu.ELEMENT.dispatchEvent(event);
      }
    }

    /* Niveau terminé */
    if (this.pacDotNumber <= 0)
    {
      var event: CustomEvent = new CustomEvent('LevelFinished');
      Jeu.ELEMENT.dispatchEvent(event);
    }

    return this;
  }

  /**
   * Récupère les gros points
   *
   * @returns {Array<Tile>}
   */
  public getPowerPellet()
  {
    var tiles: Array<Array<Tile>> = this.getTiles();
    var tilesWithPowerPellet: Array<Tile> = [];

    for (var i: number = 0, l: number = tiles.length ; i < l ; ++i)
    {
      /* Parcourt de chaque case */
      for (var j: number = 0, k: number = tiles[i].length ; j < k ; ++j)
      {
        if (tiles[i][j].hasPowerPellet())
          tilesWithPowerPellet.push(tiles[i][j]);
      }
    }

    return tilesWithPowerPellet;
  }
}