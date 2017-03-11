/**
 * Created by mac pro on 06/03/2017.
 */

class GhostsManager
{
  /* Les intervalles */
  private chaseInterval: number;
  private scatterInterval: number;
  private frightenInterval: number;

  /* Les fantômes */
  private pinky: Pinky;
  private blinky: Blinky;
  private inky: Inky;
  private clyde: Clyde;

  /* Pour gérer l'intervalle */
  private time: number;

  /* Gère le numéro de la vague */
  private waveNumber: number;

  /* Le mode courant */
  private mode: number;

  constructor()
  {
    /* Initialisation des intervalles et autres */
    this.chaseInterval = 20000;
    this.scatterInterval = 7000;
    this.frightenInterval = 7000;
    this.waveNumber = 1;
    this.mode = Modes.Scatter;

    /* Instanciation des fantômes */
    this.pinky = new Pinky();
    this.blinky = new Blinky();
    this.inky = new Inky();
    this.clyde = new Clyde();
  }

  /**
   * @param callback
   *
   * @returns {GhostsManager}
   */
  public setCollideFunction(callback: any)
  {
    this.pinky.setCollideFunction(callback);
    this.blinky.setCollideFunction(callback);
    this.inky.setCollideFunction(callback);
    this.clyde.setCollideFunction(callback);

    return this;
  }

  /**
   * Initialise tous les fantômes
   *
   * @returns {GhostsManager}
   */
  public init(): GhostsManager
  {
    /* Initialisation des fantômes et des canvas */
    this.pinky.init();
    this.blinky.init();
    this.inky.init();
    this.clyde.init();

    /* Changement des modes */
    this.pinky.changeMode(this.mode);
    this.blinky.changeMode(this.mode);
    this.inky.changeMode(this.mode);
    this.clyde.changeMode(this.mode);

    return this;
  }

  /**
   * Démarrage du chrono
   * @returns {GhostsManager}
   */
  public start(): GhostsManager
  {
    this.time = +new Date();

    return this;
  }

  /**
   * Change de mode si besoin et déplace les fantômes
   *
   * @param pacmanCenter
   *
   * @returns {GhostsManager}
   */
  public moveGhosts(pacmanCenter: Point): GhostsManager
  {
    /* Vérification du chrono */
    switch (this.mode)
    {
      case Modes.Chase:

        if (+new Date() - this.time > this.chaseInterval)
          this.changeMode(Modes.Scatter);

        break;

      case Modes.Scatter:

        if (+new Date() - this.time > this.scatterInterval)
          this.changeMode(Modes.Chase);

        break;
    }

    this.blinky.move(pacmanCenter);

    return this;
  }

  /**
   * Anime les fantômes dans leur canvas
   *
   * @returns {GhostsManager}
   */
  public animateGhosts(): GhostsManager
  {
    /* Changement de mode si intervalle dépassé */
    this.blinky.animate();

    return this;
  }

  /**
   * Change le mode et le numéro de la vague si besoin lorsque l'intervalle est atteint
   *
   * @returns {GhostsManager}
   */
  private changeMode(mode: number): GhostsManager
  {
    this.mode = mode;

    /* Changement pour les fantômes */
    this.pinky.changeMode(this.mode);
    this.blinky.changeMode(this.mode);
    this.inky.changeMode(this.mode);
    this.clyde.changeMode(this.mode);

    /* Réinitialisation du chrono */
    this.time = +new Date();

    return this;
  }

  /**
   * Renvoie les coordonnées des fantômes
   *
   * @returns {Array}
   */
  public getGhostsCoords(): Array<Point>
  {
    return [{
      x: 0,
      y: 0
    }];
  }

  /**
   * Retourne la position des fantômes et leur canvas pour les redissiner
   *
   * @returns {{canvas: Canvas, coords: Point}[]}
   */
  public getGhostsCoordsAndCanvas(): Array<CanvasAndCoords>
  {
    return [
      {
        'canvas': this.pinky.getCanvas(),
        'coords': this.pinky.getCoordinates()
      },
      {
        'canvas': this.blinky.getCanvas(),
        'coords': this.blinky.getCoordinates()
      },
      {
        'canvas': this.inky.getCanvas(),
        'coords': this.inky.getCoordinates()
      },
      {
        'canvas': this.clyde.getCanvas(),
        'coords': this.clyde.getCoordinates()
      },
    ];
  }
}