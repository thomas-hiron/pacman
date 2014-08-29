/**
 * Created by ThomasHiron on 28/08/2014.
 */

/**
 * Le canvas du jeu
 *
 * @constructor
 */
function Canvas()
{
  /* L'élement html */
  var element = null;
  
  /* Le context du canvas */
  var context = null;
  
  /**
   * Getter
   *
   * @returns Object
   */
  this.getContext = function() {
    return context;
  }
  
  /**
   * Setter
   *
   * @param Object param
   * @returns Canvas
   */
  this.setContext = function(param) {
    context = param;
  
    /* Retour de l'instance */
    return this;
  }  
  
  /**
   * Getter
   *
   * @returns HTMLElement
   */
  this.getElement = function() {
    return element;
  }
  
  /**
   * Setter
   *
   * @param Node param
   * @returns Canvas
   */
  this.setElement = function(param) {
    element = param;
  
    /* Retour de l'instance */
    return this;
  }
}

/**
 * Le protype du canvas
 *
 * @type {{}}
 */
Canvas.prototype = {

  /**
   * Initialisation du canvas et du contexte
   *
   * @returns {Canvas}
   */
  init: function() {

    /* Récupération de l'élément */
    var c = this.getElement();

    /* Canvas non spécifié pas le script l'ayant instancié, on le créé */
    if(c == null)
    {
      c = this.setElement(document.createElement("CANVAS"))
              .getElement();
    }

    /* Erreur */
    if(!c || !c.getContext)
      throw new Error("Le canvas n'est pas pris en charge par votre navigateur");

    /* Initialisation du context */
    this.setContext(c.getContext("2d"));

    /* Erreur */
    if(!this.getContext())
      throw new Error("Le canvas n'est pas pris en charge par votre navigateur");

    /* Retour de l'instance */
    return this;
  },
}
