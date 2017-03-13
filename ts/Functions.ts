/**
 * Created by thiron on 13/03/2017.
 */

class Functions
{
  /**
   * Tri un tableau
   *
   * @param a
   */
  public static shuffle(a: Array<any>)
  {
    var j: number;
    var x: number;
    for (var i = a.length ; i ; i--)
    {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }
}