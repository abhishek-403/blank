import {
  CanvasState,
  DRAWING_ON_CANVAS,
  STATE_CHANGE,
} from "@/components/canvas/Canvas";
import Pencil from "./Tools/Pencil";
import Rectangle from "./Tools/Rectangle";

export interface Pos {
  x: number;
  y: number;
}
type setboardProps = {
  left: number;
  top: number;
  width: number;
  height: number;
};
export enum Tools {
  PENCIL,
  RECTANGLE,
  TRIANGLE,
  CIRCLE,
}
export default class Board extends EventTarget {
  paths: Pos[][] = [];
  mousePos: Pos = { x: 0, y: 0 };
  pencil = new Pencil();
  rectangle = new Rectangle();
  activeTool: Tools = Tools.PENCIL;
  leftOffset: number = 0;
  topOffset: number = 0;
  isMouseDown: boolean = false;
  isInBoard: boolean = false;
  width: number;
  height: number;

  private startX: number;
  private startY: number;
  context: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
    this.paths = [];
    this.startX = 0;
    this.startY = 0;
  }
  drawLine(x1: number, y1: number, x2: number, y2: number) {
    if (!this.context) return;

    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.strokeStyle = "black";
    this.context.stroke();
    this.context.closePath();
  }
  updateState(state: CanvasState) {
    this.pencil.paths = state.pencil;
    for (const path of this.pencil.paths) {
      if (path.length > 0 && this.context) {
        for (let i = 0; i < path.length - 1; i++) {
          this.drawLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
        }
      }
    }
  }
  drawingOnBoard(state: any) {
    console.log("state :", state?.pencil?.length);

    if (!state) return;

    for (let i = 0; i < state.pencil.length - 1; i++) {
      let path = state.pencil;


      this.drawLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }
  }

  handleMouseDown(x: number, y: number) {
    this.isDrawing = true;
    if (this.activeTool == Tools.PENCIL) {
      this.startX = x;
      this.startY = y;
      this.pencil.currLine.push({ x, y });
    }
  }

  handleMouseUp() {
    this.isDrawing = false;
    if (this.activeTool == Tools.PENCIL) {
      this.pencil.paths.push(this.pencil.currLine);
      this.dispatchEvent(new Event(STATE_CHANGE));
      this.pencil.currLine = [];
    }
  }
  handleMouseMove(x: number, y: number) {
    if (this.isDrawing) {
      this.drawLine(this.startX, this.startY, x, y);
      this.startX = x;
      this.startY = y;
      this.pencil.currLine.push({ x, y });

      this.dispatchEvent(new Event(DRAWING_ON_CANVAS));
    }
  }
  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }
}
