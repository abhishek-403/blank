import Tools from ".";
import { Pos } from "..";

export type RectangleProps = {
  pos: Pos;
  width: number;
  height: number;
  stroke?: number;
  strokeColor?: string;
};

export default class Rectangle {
  private startX: number;
  private startY: number;

  stroke: number = 1;
  strokeColor: string = "#000000";

  currentRect?: RectangleProps;
  rects: RectangleProps[] = [];
  context: CanvasRenderingContext2D | null = null;
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  constructor() {
    this.startX = 0;
    this.startY = 0;
  }

  setProperties(strokeColor?: string, stroke?: number) {
    if (strokeColor) {
      this.strokeColor = strokeColor;
    }
    if (stroke) {
      this.stroke = stroke;
    }
  }

  intiCanvas(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
  drawStoredRectangles() {
    this.rects.forEach((rectangle) => {
      if (!this.context) return;
      this.context.strokeStyle = rectangle.strokeColor || this.strokeColor;
      this.context.lineWidth = rectangle.stroke || this.stroke;
      this.context?.strokeRect(
        rectangle.pos.x,
        rectangle.pos.y,
        rectangle.width,
        rectangle.height
      );
    });
  }
  updateState(state: RectangleProps[]) {
    this.rects = state;
    this.drawStoredRectangles();
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
      stroke: this.stroke,
      strokeColor: this.strokeColor,
    };
    this.rects.push(newRectangle);
  }
  handleMouseMove(x: number, y: number) {
    if (!this.context) return;

    const width = x - this.startX;
    const height = y - this.startY;

    this.clearCanvas();
    this.context.strokeStyle = this.strokeColor;
    this.context.lineWidth = this.stroke;
    this.context.strokeRect(this.startX, this.startY, width, height);
  }

  clearCanvas() {
    this.context?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
  clean() {
    this.rects = [];
  }
}
