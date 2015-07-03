/**
 * Created by thiron on 03/07/2015.
 */

window.addEventListener("load", init, false);

/**
 * Chargement de la fenêtre, initialisation
 */
function init()
{
  var jeu:Jeu = new Jeu();
}

/* RequestAnimationFrame */
var requestAnimFrame:(callback:() => void) => void = (function ()
{
  return window.requestAnimationFrame ||
    (<any>window).webkitRequestAnimationFrame ||
    (<any>window).mozRequestAnimationFrame ||
    (<any>window).oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback:any)
    {
      window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();