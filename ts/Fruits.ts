/**
 * Created by mac pro on 05/03/2017.
 */
///<reference path='PacDot.ts' />
abstract class Fruit extends PacDot
{
  public static WIDTH = 20;
}

/* Les fruits */
class Cherry extends Fruit
{
  public static SCORE_VALUE = 100;
  protected scoreValue: number = Cherry.SCORE_VALUE;
}

class Strawberry extends Fruit
{
  public static SCORE_VALUE = 300;
  protected scoreValue: number = Strawberry.SCORE_VALUE;
}

class Orange extends Fruit
{
  public static SCORE_VALUE = 500;
  protected scoreValue: number = Orange.SCORE_VALUE;
}

class Apple extends Fruit
{
  public static SCORE_VALUE = 700;
  protected scoreValue: number = Apple.SCORE_VALUE;
}

class Melon extends Fruit
{
  public static SCORE_VALUE = 1000;
  protected scoreValue: number = Melon.SCORE_VALUE;
}

class Galaxian extends Fruit
{
  public static SCORE_VALUE = 2000;
  protected scoreValue: number = Galaxian.SCORE_VALUE;
}

class Bell extends Fruit
{
  public static SCORE_VALUE = 3000;
  protected scoreValue: number = Bell.SCORE_VALUE;
}

class Key extends Fruit
{
  public static SCORE_VALUE = 5000;
  protected scoreValue: number = Key.SCORE_VALUE;
}

