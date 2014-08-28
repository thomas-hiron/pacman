/**
 * Created by ThomasHiron on 28/08/2014.
 */

/**
 * Gère le déroulement de la partie
 *
 * @constructor
 */
function Jeu()
{
  /* Le canvas du jeu */
  var canvas = null;

  /* Le pacman */
  var pacman = null;

  /* Les directions des touches */
  var directions = {
    LEFT: -1,
    RIGHT: 1,
    UP: 2,
    DOWN: -2
  };

  /* Le temps courant */
  var time = null;

  /* L'interval pour le requestAnimationFrame */
  var interval = 15;

  /**
   * Getter
   *
   * @returns int
   */
  this.getInterval = function() {
    return interval;
  }

  /**
   * Setter
   *
   * @param int param
   * @returns Jeu
   */
  this.setInterval = function(param) {
    interval = param;

    /* Retour de l'instance */
    return this;
  }

  /**
   * Getter
   *
   * @returns int
   */
  this.getTime = function() {
    return time;
  }

  /**
   * Setter
   *
   * @param int param
   * @returns Jeu
   */
  this.setTime = function(param) {
    time = param;

    /* Retour de l'instance */
    return this;
  }

  /**
   * Getter
   *
   * @returns Object
   */
  this.getDirections = function() {
    return directions;
  }

  /**
   * Getter
   *
   * @returns Pacman
   */
  this.getPacman = function() {
    return pacman;
  }

  /**
   * Setter
   *
   * @param Pacman param
   * @returns Jeu
   */
  this.setPacman = function(param) {
    pacman = param;

    /* Retour de l'instance */
    return this;
  }

  /**
   * Getter
   *
   * @returns Canvas
   */
  this.getCanvas = function() {
    return canvas;
  }

  /**
   * Setter
   *
   * @param Canvas param
   * @returns Jeu
   */
  this.setCanvas = function(param) {
    canvas = param;

    /* Retour de l'instance */
    return this;
  }
}

/**
 * Prototype du jeu
 *
 * @type {{}}
 */
Jeu.prototype = {

  /**
   * Initialisation du jeu
   *
   * @returns {Jeu}
   */
  init: function() {

    try {

      /* Initialisation du canvas */
      this.setCanvas(
        new Canvas()
          .setElement($("canvas")[0])
          .init()
      );
    }
    catch(e) {

      /* Une erreur s'est produite, alert puis redirection */
      alert(e.message);
      window.location.href = "http://www.thomas-hiron.com";

      /* Retour de l'instance pour ne pas continuer le temps de la redirection */
      return this;
    }

    /* On continue */

    /* Initialisation du pacman */
    this.setPacman(
      new Pacman()
        .setJeu(this)
        .init()
    );

    /* Démarrage - TMP */
    this.demarrer();

    /* Retour de l'instance */
    return this;
  },

  /**
   * Démarrage du jeu
   *
   * @returns {Jeu}
   */
  demarrer: function() {

    /* Changement de la date */
    this.setTime(+new Date());

    /* On lance l'animFrame de Pacman */
    this.getPacman().start();

    /* RequestAnimationFrame pour le pacman, les fantomes */
    requestAnimFrame(bind(this, this.draw));

    /* Retour de l'instance */
    return this;
  },

  /**
   * RequestAnimationFrame, dessin de tous les éléments
   *
   * @returns {Jeu}
   */
  draw: function() {

    /* Si l'interval a été atteind */
    if(+new Date() - this.getTime() > this.getInterval())
    {
      var pacman = this.getPacman();

      /* Suppression puis dessin du pacman */
      this.getCanvas().getContext().clearRect(pacman.getX(), pacman.getY(), pacman.getSize().w, pacman.getSize().h);
      this.getPacman().draw();

      /* Mise à jour du temps */
      this.setTime(+new Date());
    }

    /* Animation suivante */
    requestAnimFrame(bind(this, this.draw));

    /* Retour de l'instance */
    return this;
  }
}