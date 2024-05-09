import { CanvasState } from "@/components/canvas/Canvas";
import { Pos } from "..";

export default class Pencil {
  stroke: number = 1;
  paths: Pos[][] = [];
  strokeColor: string = "black";
  currLine: Pos[] = [];
  context: CanvasRenderingContext2D | null = null;
  private startX: number;
  private startY: number;
  constructor() {
    this.startX = 0;
    this.startY = 0;
  }
  drawStoredLines() {
    for (const path of this.paths) {
      if (path.length > 0 && this.context) {
        for (let i = 0; i < path.length - 1; i++) {
          this.drawLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
        }
      }
    }
  }
  updateState(state: Pos[][]) {
    this.paths = state;
    this.drawStoredLines();
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    if (!this.context) return;

    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.strokeStyle = this.strokeColor;
    this.context.lineWidth = this.stroke;
    this.context.stroke();
    this.context.closePath();
  }

  drawingOnBoard(state: any) {
    if (!state) return;

    for (let i = 0; i < state.pencil.length - 1; i++) {
      let path = state.pencil;

      this.drawLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }
  }

  handleMouseDown(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    this.currLine.push({ x, y });
  }

  handleMouseUp() {
    this.paths.push(this.currLine);
    this.currLine = [];
  }
  handleMouseMove(x: number, y: number) {
    this.drawLine(this.startX, this.startY, x, y);
    this.startX = x;
    this.startY = y;
    this.currLine.push({ x, y });
  }
}
