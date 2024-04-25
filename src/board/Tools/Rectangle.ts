import Tools from ".";
import { Pos } from "..";

interface RectangleProps {
  pos: Pos;
  width: number;
  height: number;
}

export default class Rectangle implements Tools {
  stroke: number = 1;
  strokeColor: string = "black";
  pos?: Pos;
  mousePos: Pos = { x: 0, y: 0 };
  isDrawing?: boolean = false;
  isMouseDown?: boolean = false;
  currentRectangle?: RectangleProps;
  rects: RectangleProps[] = [];

  constructor() {}

  updateMousePosition(pos: Pos) {
    this.mousePos = pos;
  }
  draw(ctx: CanvasRenderingContext2D): void {
    try {
      ctx.beginPath();
      for (let i = 0; i < this.rects.length; i++) {
        let rect = this.rects[i];
        ctx.rect(rect.pos.x, rect.pos.y, rect.width, rect.height);
      }

      if (this.currentRectangle) {
        ctx.rect(
          this.currentRectangle.pos.x,
          this.currentRectangle.pos.y,
          this.currentRectangle.width,
          this.currentRectangle.height
        );
      }
      ctx.stroke();
      ctx.closePath();
    } catch (e) {
      console.log("rect draw", e);
    }
  }
  update(): void {
    try {
      if (this.currentRectangle) {
        this.currentRectangle.width =
          this.mousePos.x - this.currentRectangle.pos.x;
        this.currentRectangle.height =
          this.mousePos.y - this.currentRectangle.pos.y;
      }
    } catch (e) {
      console.log("rect draw", e);
    }
  }
}
