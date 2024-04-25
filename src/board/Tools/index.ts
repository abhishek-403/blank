import { Pos } from "..";

export default interface Tools {
  stroke: number;
  fill?: boolean;
  strokeColor: string;
  draw(ctx: CanvasRenderingContext2D): void;
  update(pos:Pos): void;
}
