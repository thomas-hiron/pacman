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
  var interval = 50;

  /* La taille d'une seule case */
  var caseWidth = 40;

  /* Les niveaux */
  var levels = new Niveaux();
  var currentLevel = null;
  var currentCasesLevel = null;

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

  /**
   * Getter
   *
   * @returns {Niveaux}
   */
  this.getLevels = function() {
    return levels;
  }

  /**
   * Getter
   *
   * @returns {Niveaux}
   */
  this.getCurrentLevel = function() {
    return currentLevel;
  }

  /**
   * Setter
   *
   * @returns {Jeu}
   */
  this.setCurrentLevel = function(param) {
    currentLevel = param;

    return this;
  }

  /**
   * Getter
   *
   * @returns {Niveaux}
   */
  this.getCurrentCasesLevel = function() {
    return currentCasesLevel;
  }

  /**
   * Setter
   *
   * @returns {Jeu}
   */
  this.setCurrentCasesLevel = function(param) {
    currentCasesLevel = param;

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

    /* Dessin du premier niveau */
    var level1 = this.getLevels().niveau1();
    this.setCurrentLevel(level1[0]);
    this.setCurrentCasesLevel(level1[1]);
    this.drawLevel();

    /* Retour de l'instance */
    return this;
  },

  drawLevel: function() {

    var level = this.getCurrentLevel();

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

    /* Remplissage des cases */
    var blocs = new Array(20);
    for(var i = 0, l = blocs.length ; i < l ; ++i)
    {
      blocs[i] = new Array(15);

      for(var j = 0, k = blocs[i].length ; j < k ; ++j)
        blocs[i][j] = new Case();
    }

    /* Chaque bloc */
    for(i = 0, l = level.length ; i < l ; ++i)
    {
      /* Le bloc courant */
      bloc = level[i];

      /* On prend la dernière case qui contient les dimensions */
      taille = bloc[bloc.length - 1];
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
      for(j = 0, k = bloc.length ; j < k ; ++j)
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

    //console.log(blocs);

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
      var margin = this.getCaseWidth() - pacman.getSize().w;

      /* Suppression puis dessin du pacman */
      this.getCanvas().getContext().clearRect(pacman.getX() + margin, pacman.getY() + margin, pacman.getSize().w, pacman.getSize().h);
      this.getPacman().draw();

      /* Mise à jour du temps */
      this.setTime(+new Date());
    }

    /* Animation suivante */
    requestAnimFrame(this.draw.bind(this));

    /* Retour de l'instance */
    return this;
  },

  /**
   * Vérifie qu'il n'y a pas de collision
   *
   * @param x
   * @param y
   *
   * @returns {boolean}
   */
  checkCollision: function(x, y)
  {
    var currentCasesLevel = this.getCurrentCasesLevel();

    return currentCasesLevel[y][x].isAWall();
  }
}