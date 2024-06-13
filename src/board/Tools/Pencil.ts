import { Pos } from "..";

export default class Pencil {
  paths: Pos[][] = [];

  strokeColor: string = "#000000";
  stroke: number = 5;

  currLine: Pos[] = [];
  context: CanvasRenderingContext2D | null = null;
  private startX: number;
  private startY: number;
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
  drawStoredLines() {
    for (const path of this.paths) {
      if (path.length > 0 && this.context) {
        for (let i = 0; i < path.length - 1; i++) {
          this.drawLine(
            path[i].x,
            path[i].y,
            path[i + 1].x,
            path[i + 1].y,
            path[i].stroke,
            path[i].strokeColor
          );
        }
      }
    }
  }
  updateState(state: Pos[][]) {
    // this.clean();
    this.paths = state;
    this.drawStoredLines();
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stroke?: number,
    strokeColor?: string
  ) {
    if (!this.context) return;

    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.lineCap = "round";
    this.context.lineJoin = "round";
    this.context.strokeStyle = strokeColor || this.strokeColor;
    this.context.lineWidth = stroke || this.stroke;
    this.context.stroke();
    this.context.closePath();
  }

  drawingOnBoard(state: any) {
    if (!state) return;

    for (let i = 0; i < state.pencil.length - 1; i++) {
      let path = state.pencil;

      this.drawLine(
        path[i].x,
        path[i].y,
        path[i + 1].x,
        path[i + 1].y,
        path.stroke,
        path.strokeColor
      );
    }
  }

  handleMouseDown(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    this.currLine.push({
      x,
      y,
      stroke: this.stroke,
      strokeColor: this.strokeColor,
    });
  }

  handleMouseUp() {
    this.paths.push(this.currLine);
    this.currLine = [];
  }
  handleMouseMove(x: number, y: number) {
    this.drawLine(this.startX, this.startY, x, y);
    this.startX = x;
    this.startY = y;
    this.currLine.push({
      x,
      y,
      stroke: this.stroke,
      strokeColor: this.strokeColor,
    });
  }
  clean() {
    this.paths = [];
  }
}
