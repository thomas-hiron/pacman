/**
 * Created by ThomasHiron on 28/08/2014.
 */

/**
 * Le pacman du jeu
 *
 * @constructor
 */
function Pacman()
{
  /* Le jeu */
  var jeu = null;

  /* Le canvas (non présent dans le DOM) */
  var canvas = null;

  /* Taille du pacman */
  var size = {
    w: 30,
    h: 30
  };

  /* Les coordonnées */
  var coordonnees = {
    x: 7 * 40,
    y: 11 * 40
  };

  /* La direction courante */
  var direction = null;
  var nextDirection = null;

  /* L'étape courante pour le dessin */
  var etape = null;

  /* Nombre d'étapes d'animation */
  var nb_etapes = 6;

  /* L'interval pour le requestAnimationFrame */
  var interval = 40;

  /* Le pas de décalage de px */
  var pas = 2;

  /* Le temps courant */
  var time = null;

  /**
   * Getter
   *
   * @returns int
   */
  this.getPas = function() {
    return pas;
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
   * @returns int
   */
  this.getInterval = function() {
    return interval;
  }

  /**
   * Getter
   *
   * @returns int
   */
  this.getNbEtapes = function() {
    return nb_etapes;
  }

  /**
   * Getter
   *
   * @returns int
   */
  this.getEtape = function() {
    return etape;
  }

  /**
   * Setter
   *
   * @param int param
   * @returns Pacman
   */
  this.setEtape = function(param) {
    etape = param;

    /* Retour de l'instance */
    return this;
  }

  /**
   * Augmente l'étape
   *
   * @returns {Pacman}
   */
  this.augmenterEtape = function() {
    etape++;

    /* Retour de l'instance */
    return this;
  }

  /**
   * Getter
   *
   * @returns int
   */
  this.getDirection = function() {
    return direction;
  }

  /**
   * Setter
   *
   * @param int param
   * @returns Pacman
   */
  this.setDirection = function(param) {
    direction = param;

    /* Retour de l'instance */
    return this;
  }

  /**
   * Getter
   *
   * @returns int
   */
  this.getNextDirection = function() {
    return nextDirection;
  }

  /**
   * Setter
   *
   * @param int param
   * @returns Pacman
   */
  this.setNextDirection = function(param) {
    nextDirection = param;

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
   * @returns Pacman
   */
  this.setCanvas = function(param) {
    canvas = param;

    /* Retour de l'instance */
    return this;
  }

  /**
   * Getter
   *
   * @returns Object
   */
  this.getCoordonnes = function() {
    return coordonnees;
  }

  /**
   * Retourne la position X
   *
   * @returns {number}
   */
  this.getX = function() {
    return coordonnees.x;
  }

  /**
   * Retourne la position Y
   *
   * @returns {number}
   */
  this.getY = function() {
    return coordonnees.y;
  }

  /**
   * Set la position X
   *
   * @param int param
   * @returns {Pacman}
   */
  this.setX = function(param) {
    coordonnees.x = param;

    return this;
  }

  /**
   * Set la position Y
   *
   * @param int param
   * @returns {Pacman}
   */
  this.setY = function(param) {
    coordonnees.y = param;

    return this;
  }

  /**
   * Getter
   *
   * @returns Object
   */
  this.getSize = function() {
    return size;
  }

  /**
   * Getter
   *
   * @returns Jeu
   */
  this.getJeu = function() {
    return jeu;
  }

  /**
   * Setter
   *
   * @param Jeu param
   * @returns Pacman
   */
  this.setJeu = function(param) {
    jeu = param;

    /* Retour de l'instance */
    return this;
  }
}

/**
 * Le proto du pacman
 * @type {{}}
 */
Pacman.prototype = {

  /**
   * Initialisation du pacman
   *
   * @returns {Pacman}
   */
  init: function() {

    /* Le jeu */
    var jeu = this.getJeu();

    /* Création du canvas */
    this.setCanvas(new Canvas().init());

    /* Initialisation de la taille du canvas */
    var canvas = this.getCanvas().getElement();
    canvas.width = this.getSize().w;
    canvas.height= this.getSize().h;

    /* Initialisation de la direction */
    this.setNextDirection(jeu.getDirections().RIGHT);

    /* Ajout de l'event des flèches */
    window.addEventListener("keydown", this.rotate.bind(this), false);

    /* Retour de l'instance */
    return this;
  },

  /**
   * Démarre le requestAnimationFrame
   *
   * @returns {Pacman}
   */
  start: function() {

    /* Request anim frame */
    requestAnimFrame(this.animate.bind(this));

    /* Retour de l'instance */
    return this;
  },

  /**
   * Handler pour l'appui sur une flèche
   *
   * @param Event e
   * @returns {Pacman}
   */
  rotate: function(e) {

    e.preventDefault();

    /* Le code d la flèche touchée */
    var code = e.keyCode;

    /* Les directions */
    var directions = this.getJeu().getDirections();

    /* Selon la flèche, on change le direction */
    switch(code)
    {
      case 37 : this.setNextDirection(directions.LEFT);   break;
      case 38 : this.setNextDirection(directions.UP);     break;
      case 39 : this.setNextDirection(directions.RIGHT);  break;
      case 40 : this.setNextDirection(directions.DOWN);   break;
    }

    /* Retour de l'instance */
    return this;
  },

  /**
   * Anime le pacman
   *
   * @returns {Pacman}
   */
  animate: function() {

    /* Si l'interval a été atteind */
    if(+new Date() - this.getTime() > this.getInterval())
    {
      /* On augmente l'étape */
      this.augmenterEtape();

      /* Réinitialisation de l'étape si besoin */
      if(this.getEtape() % this.getNbEtapes() == 0) this.setEtape(0);

      /* Mise à jour du temps */
      this.setTime(+new Date());
    }

    /* Animation suivante */
    requestAnimFrame(this.animate.bind(this));

    /* Retour de l'instance */
    return this;
  },

  /**
   * Dessine le Pacman
   *
   * @returns {Pacman}
   */
  draw: function() {

    /* L'angle du dessin */
    var angle = 0;

    /* Le jeu */
    var jeu = this.getJeu();

    /* Le context du pacman */
    var ctx = this.getCanvas().getContext();

    /* Le context du canvas principal */
    var ctx_jeu = jeu.getCanvas().getContext();

    /* Les directions */
    var directions = jeu.getDirections();

    /* Taille */
    var size = this.getSize();

    /* Suppression du context */
    ctx.clearRect(0, 0, size.w, size.h);

    /* Changement de l'angle en fonction de la direction */
    switch(this.getDirection())
    {
      case directions.LEFT  : angle = 180;  break;
      case directions.UP    : angle = 270;  break;
      case directions.RIGHT : angle = 0;    break;
      case directions.DOWN  : angle = 90;   break;
    }

    /* -- Dessin du pacman dans le context courant -- */

    /* Coordonnées */
    var x = this.getCoordonnes().x;
    var y = this.getCoordonnes().y;
    var newX = x;
    var newY = y;
    var currentDirection = this.getDirection();
    var caseWidth = this.getJeu().getCaseWidth();

    /* On peut changer de direction */
    if(x % caseWidth == 0 && y % caseWidth == 0)
      currentDirection = this.getNextDirection();

    /* Selon la direction */
    switch(currentDirection)
    {
      case directions.LEFT  :
      case directions.RIGHT :

        /* Y OK, on change le X */
        if(y % caseWidth == 0)
        {
          if(currentDirection == directions.LEFT)
            this.setX(x - this.getPas());
          else
            this.setX(x + this.getPas());

          /* Changement de la direction */
          if(currentDirection == directions.LEFT || currentDirection == directions.RIGHT)
            this.setDirection(currentDirection);
        }

        /* Teste si sens inverse */
        if(this.getDirection() == directions.LEFT && this.getNextDirection() == directions.RIGHT ||
          this.getDirection() == directions.RIGHT && this.getNextDirection() == directions.LEFT)
          this.setDirection(this.getNextDirection());

        break;

      case directions.UP    :
      case directions.DOWN  :

        /* X OK, on change le Y */
        if(x % caseWidth == 0)
        {
          if(currentDirection == directions.UP)
            this.setY(y - this.getPas());
          else
            this.setY(y + this.getPas());

          /* Changement de la direction */
          if(currentDirection == directions.UP || currentDirection == directions.DOWN)
          this.setDirection(currentDirection);
        }

        /* Teste si sens inverse */
        if(this.getDirection() == directions.UP && this.getNextDirection() == directions.DOWN ||
          this.getDirection() == directions.DOWN && this.getNextDirection() == directions.UP)
          this.setDirection(this.getNextDirection());

        break;
    }

    /* Enregistrement du context */
    ctx.save();

    /* Translation */
    ctx.translate(size.w / 2, size.h / 2);

    /* Rotation */
    ctx.rotate(angle * Math.PI / 180);

    /* Translation inverse pour le remettre comme avant */
    ctx.translate(-size.w / 2, -size.h / 2);

    /* Couleur */
    ctx.fillStyle = "#FFFF00";

    /* Calcul pour le dessin */
    var et = this.getEtape(),
        inclinaison = et * 0.25 / (this.getNbEtapes() - 1),
        inclinaison2 = 1 - inclinaison;

    /* Dessin */
    ctx.beginPath();
    ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison * Math.PI, (inclinaison + 1) * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size.w / 2, size.h / 2, size.w / 2, inclinaison2 * Math.PI, (inclinaison2 + 1) * Math.PI, false);
    ctx.fill();

    /* Dessin dans le canvas du jeu */
    ctx_jeu.drawImage(ctx.canvas, this.getX(), this.getY());

    /* Restauration du context */
    ctx.restore();

    /* Retour de l'instance */
    return this;
  },
}