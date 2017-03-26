/**
 * Created by mac pro on 06/03/2017.
 */

class GhostsManager
{
  /* Le nombre de point que pacman doit manger pour que certains fantômes sortent */
  public static INKY_DOT_TO_GO = 30;

  /* Les intervalles */
  private chaseInterval: number;
  private scatterInterval: number;
  private frightenedInterval: number;

  /* Les fantômes */
  private pinky: Pinky;
  private blinky: Blinky;
  private inky: Inky;
  private clyde: Clyde;

  /* Pour gérer l'intervalle */
  private frames: number;
  private frightenedFrames: number;
  private areFrightened: boolean;
  private numberEaten: number;

  /* Gère le numéro de la vague */
  private waveNumber: number;

  /* Le mode courant */
  private mode: number;

  constructor()
  {
    /* Initialisation des intervalles et autres */
    this.chaseInterval = 20 * 60;
    this.scatterInterval = 7 * 60;
    this.frightenedInterval = 7 * 60;

    /* Instanciation des fantômes */
    this.pinky = new Pinky();
    this.blinky = new Blinky();
    this.inky = new Inky();
    this.clyde = new Clyde();

    /* Listener sorti de la maison */
    Jeu.ELEMENT.addEventListener('OutFromHome', this.ghostGotOut.bind(this), false);
    Jeu.ELEMENT.addEventListener('InkyCanGo', this.inkyCanGo.bind(this), false);
    Jeu.ELEMENT.addEventListener('ClydeCanGo', this.clydeCanGo.bind(this), false);
    Jeu.ELEMENT.addEventListener('GhostEaten', this.ghostEaten.bind(this), false);
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
    this.waveNumber = 1;
    this.mode = Modes.Scatter;
    this.areFrightened = false;

    /* Initialisation des fantômes et des canvas */
    this.pinky.init();
    this.blinky.init();
    this.inky.init();
    this.clyde.init();

    this.frames = 0;
    this.frightenedFrames = 0;
    this.numberEaten = 0;

    /* Changement du mode */
    this.changeMode(this.mode);

    /* Pinky doit sortir immédiatement */
    this.pinky.getOutFromHome();

    return this;
  }

  /**
   * Change de mode si besoin et déplace les fantômes
   *
   * @param pacmanCenter
   *
   * @returns {GhostsManager}
   */
  public moveGhosts(pacmanCenter: PointAndDirection): GhostsManager
  {
    if (!this.areFrightened)
      this.frames++;
    else
      this.frightenedFrames++;

    /* Gestion du mode frightened */
    var mode: number = this.areFrightened ? Modes.Frightened : this.mode;

    /* Vérification du chrono */
    switch (mode)
    {
      case Modes.Chase:

        /* Si intervalle atteint et 4e vague pas dépassée */
        if (this.frames > this.chaseInterval && this.waveNumber < 4)
        {
          this.changeMode(Modes.Scatter);

          /* Modification de la vague */
          this.waveNumber++;

          /* Diminution des intervalles */
          if (this.waveNumber > 2)
            this.scatterInterval = 5 * 60;

          /* Réinitialisation du chrono */
          this.frames = 0;
        }

        break;

      case Modes.Scatter:

        if (this.frames > this.scatterInterval)
        {
          this.changeMode(Modes.Chase);

          /* Réinitialisation du chrono */
          this.frames = 0;
        }

        break;

      case Modes.Frightened:

        if (this.frightenedFrames > this.frightenedInterval)
        {
          /* Comme si on avait stoppé le timer précédent */
          this.areFrightened = false;
          this.numberEaten = 0;

          /* Suppression du mode alternatif */
          this.changeAlternativeMode(null);
        }
        /* S'il reste moins de 2 secondes */
        else if (this.frightenedFrames > this.frightenedInterval - 2 * 60)
          this.flashGhosts();

        break;
    }

    /* Déplacements */
    this.pinky.move(pacmanCenter);
    this.blinky.move(pacmanCenter);
    this.inky.move(pacmanCenter, this.blinky.getCoordinates());
    this.clyde.move(pacmanCenter);

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
    this.pinky.animate();
    this.blinky.animate();
    this.inky.animate();
    this.clyde.animate();

    return this;
  }

  /**
   * Change le mode et le numéro de la vague si besoin lorsque l'intervalle est atteint
   *
   * @param mode
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

    return this;
  }

  /**
   * Change le mode alternatif
   *
   * @param mode
   *
   * @returns {GhostsManager}
   */
  private changeAlternativeMode(mode: number): GhostsManager
  {
    /* Changement pour les fantômes */
    this.pinky.changeAlternativeMode(mode);
    this.blinky.changeAlternativeMode(mode);
    this.inky.changeAlternativeMode(mode);
    this.clyde.changeAlternativeMode(mode);

    return this;
  }

  /**
   * Fait flasher les fantômes
   *
   * @returns {GhostsManager}
   */
  private flashGhosts(state: boolean = true): GhostsManager
  {
    this.pinky.flash(state);
    this.blinky.flash(state);
    this.inky.flash(state);
    this.clyde.flash(state);

    return this;
  }

  /**
   * Retourne la position des fantômes et leur canvas pour les redissiner
   *
   * @returns {{canvas: Canvas, coords: Point}[]}
   */
  public getGhosts(): Array<Ghost>
  {
    return [
      this.pinky,
      this.blinky,
      this.inky,
      this.clyde
    ];
  }

  /**
   * Un fantôme est sorti
   *
   * @returns {GhostsManager}
   */
  private ghostGotOut(e: CustomEvent): GhostsManager
  {
    e.detail.changeMode(this.mode);

    return this;
  }

  /**
   * Inky peut sortir de la maison
   *
   * @returns {GhostsManager}
   */
  private inkyCanGo(): GhostsManager
  {
    this.inky.getOutFromHome();

    return this;
  }

  /**
   * Clyde peut sortir de la maison
   *
   * @returns {GhostsManager}
   */
  private clydeCanGo(): GhostsManager
  {
    this.clyde.getOutFromHome();

    return this;
  }

  /**
   * Change de mode
   *
   * @returns {GhostsManager}
   */
  public goToFrightenedMode(): GhostsManager
  {
    /* Réinit des frames */
    this.frightenedFrames = 0;

    /* Changement si pas déjà dans le mode */
    this.changeAlternativeMode(Modes.Frightened);

    this.areFrightened = true;

    /* Ils ne clignottent plus */
    this.flashGhosts(false);

    return this;
  }

  /**
   * Un fantôme a été mangé
   *
   * @returns {GhostsManager}
   */
  private ghostEaten(): GhostsManager
  {
    this.numberEaten++;

    /* Information de jeu pour augmenter le score */
    var event: CustomEvent = new CustomEvent('UpdateScoreAfterGhostEaten', {'detail': this.numberEaten})
    Jeu.ELEMENT.dispatchEvent(event);

    return this;
  }
}