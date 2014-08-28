/**
 * Created by ThomasHiron on 28/08/2014.
 */

/* Ajout du listener window ready */
window.addEventListener("load", init, false);

/**
 * Chargement de la fenêtre, initialisation
 */
function init()
{
  new Jeu().init();
}

/* Fonctions */
!function(){window.log=Function.prototype.bind.call(console.log,console);}();

function bind(scope, fn) { return function() { return fn.apply(scope, arguments); } }

/* $("selector") --> querySelectorAll */
/**
 *
 * @param q Sélecteur
 * @param el Scope dans lequel effectuer la requête
 * @returns NodeList
 */
function $(q, el)
{
  return el ?
    el.querySelectorAll(q) :
    document.querySelectorAll(q);
}

/* RequestAnimationFrame */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();
