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
  public static shuffle(a: Array)
  {
    var j, x, i;
    for (i = a.length ; i ; i--)
    {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }
}