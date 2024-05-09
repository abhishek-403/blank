import Tools from ".";
import { Pos } from "..";

export type RectangleProps= {
  pos: Pos;
  width: number;
  height: number;
}

export default class Rectangle {
  stroke: number = 1;
  private startX: number;
  private startY: number;
  strokeColor: string = "black";
  currentRect?: RectangleProps;
  rects: RectangleProps[] = [];
  context: CanvasRenderingContext2D | null = null;

  constructor() {
    this.startX = 0;
    this.startY = 0;
  }
  updateState(state: RectangleProps[]) {
    this.rects= state;
   
    this.drawStoredRectangles();
  }
  drawStoredRectangles() {
    this.context?.beginPath();
    this.rects.forEach((rectangle) => {
      this.context?.rect(
        rectangle.pos.x,
        rectangle.pos.y,
        rectangle.width,
        rectangle.height
      );

      this.clearCanvas();
    });
    this.context?.stroke();
    this.context?.closePath();
  }
  handleMouseDown(x: number, y: number) {
    this.startX = x;
    this.startY = y;
  }

  handleMouseUp(x: number, y: number) {
    const width = x - this.startX;
    const height = y - this.startY;
    const newRectangle = {
      pos: {
        x: this.startX,
        y: this.startY,
      },
      width: width,
      height: height,
    };
    this.rects.push(newRectangle);
  }
  handleMouseMove(x: number, y: number) {
    if (!this.context) return;

    const width = x - this.startX;
    const height = y - this.startY;

    this.clearCanvas();
    this.drawStoredRectangles();
    this.context.strokeRect(this.startX, this.startY, width, height);
  }

  clearCanvas() {
    this.context?.clearRect(0, 0, 800, 600);
  }
}
