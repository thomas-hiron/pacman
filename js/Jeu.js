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
  var interval = 100;

  /* La taille d'une seule case */
  var caseWidth = 40;

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

  /**
   * Getter
   *
   * @returns {number}
   */
  this.getCaseWidth = function() {
    return caseWidth;
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

    /* TMP */
    this.tracer_niveau1();

    /* Retour de l'instance */
    return this;
  },

  tracer_niveau1: function() {

    var niveau1 = new Niveaux().niveau1();

    /* Context global */
    var ctx = this.getCanvas().getContext();

    var width = this.getCaseWidth();

    var bloc = null;
    var ligne = null;
    var taille = null;

    var canvas_object = new Canvas();
    var canvas_tmp = canvas_object
      .init()
      .getElement();
    var ctx_tmp = null;

    /* Chaque bloc */
    for(var i = 0, l = niveau1.length ; i < l ; ++i)
    {
      /* Le bloc courant */
      bloc = niveau1[i];

      /* On prend la dernière case qui contient les dimensions */
      taille = bloc.pop();
      canvas_tmp.width = taille.width * width + 10;
      canvas_tmp.height = taille.height * width + 10;

      /* Récupération du context */
      ctx_tmp = canvas_object.getContext();

      /* Translation pour ne pas couper les bordures */
      ctx_tmp.translate(5, 5);

      /* Propriété du context */
      ctx_tmp.strokeStyle = "#012EB6";
      ctx_tmp.fillStyle = "#012EB6";
      ctx_tmp.lineJoin = "round";
      ctx_tmp.lineWidth = 2;

      /* Démarrage du tracé */
      ctx_tmp.beginPath();

      /* Chaque ligne d'un bloc */
      for(var j = 0, k = bloc.length ; j < k ; ++j)
      {
        /* Ligne courante */
        ligne = bloc[j];

        /* Nouvelle ligne */
        ctx_tmp.lineTo(ligne[0] * width, ligne[1] * width);
      }

      /* On ferme le tracé */
      ctx_tmp.lineTo(bloc[0][0] * width, bloc[0][1] * width);

      /* Remplissage */
      ctx_tmp.stroke();

      /* Dessin dans le canvas de base */
      ctx.drawImage(canvas_tmp, taille.x * width, taille.y * width);
    }

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
    requestAnimFrame(this.draw.bind(this));

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
    requestAnimFrame(this.draw.bind(this));

    /* Retour de l'instance */
    return this;
  }
}