import Tools from ".";
import { Pos } from "..";

export default class Pencil implements Tools {
  stroke: number = 1;
  paths: Pos[][] = [];
  strokeColor: string = "black";
  mousePos: Pos={x: 0, y: 0};
  constructor() {
    
  }

  updateMousePos(pos:Pos){
    this.mousePos = pos;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    try {
      ctx.beginPath();
      for (const path of this.paths) {
        if (path.length > 0) {
          ctx.moveTo(path[0].x, path[0].y);

          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
          ctx.stroke();
        }
      }
    } catch (e: any) {
      console.log("tools/pencil draw", e);
    }
  }

  update(): void {
    try {
      this.paths[this.paths.length - 1] &&
        this.paths[this.paths.length - 1].push(this.mousePos);
    } catch (e: any) {
      console.log("tools/pencil update", e);
    }
  }
}
