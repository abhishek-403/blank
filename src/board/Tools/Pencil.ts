import Tools from ".";
import { Pos } from "..";

export default class Pencil {
  stroke: number = 1;
  paths: Pos[][] = [];
  strokeColor: string = "black";
  mousePos?: Pos = { x: 0, y: 0 };
  currLine: Pos[] = [];

  constructor() {}

  
}
