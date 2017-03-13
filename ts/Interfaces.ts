/**
 * Created by thiron on 03/07/2015.
 */

interface Point
{
  x:number;
  y:number;
}

interface PointAndDirection
{
  x: number;
  y:number;
  direction: number;
}

interface PointIndexed
{
  x:number;
  y:number;
  i:number;
  parent: Point;
}

interface Size
{
  w: number;
  h: number;
}

interface CanvasAndCoords
{
  canvas: Canvas;
  coords: Point;
}

interface CanvasRenderingContext2D {
  ellipse: any
}