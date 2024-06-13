import {
  CLEAR_CANVAS,
  DRAWING_ON_CANVAS,
  STATE_CHANGE,
} from "@/constants/messages";
import Pencil from "./Tools/Pencil";
import Rectangle, { RectangleProps } from "./Tools/Rectangle";
import { CanvasState } from "@/constants/types";

export type Pos = {
  x: number;
  y: number;
  stroke?:number;
  strokeColor?:string;
};
export enum Tools {
  PENCIL,
  RECTANGLE,
  TRIANGLE,
  CIRCLE,
}

export type BoardPaths = {
  pencil: Pos[][];
  rectangle: RectangleProps[];
};

export default class Board extends EventTarget {
  paths: BoardPaths = { pencil: [], rectangle: [] };
  pencil = new Pencil();
  rectangle = new Rectangle();
  activeTool: Tools = Tools.PENCIL;
  mousePos: Pos = { x: 0, y: 0 };

  width: number;
  height: number;
  context: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
    this.rectangle.intiCanvas(width, height);
  }

  setProperties(strokeColor?: string, stroke?: number) {
    this.pencil.setProperties(strokeColor,stroke);
    this.rectangle.setProperties(strokeColor,stroke);
  
  }

  updateState(state: CanvasState) {
    this.pencil.updateState(state.pencil);
    this.rectangle.updateState(state.rects);
  }
  drawingOnBoard(state: any) {
    if (!state) return;
    this.pencil.drawingOnBoard(state);
  }

  handleMouseDown(x: number, y: number) {
    this.isDrawing = true;
    if (this.activeTool == Tools.PENCIL) {
      this.pencil.handleMouseDown(x, y);
    }
    if (this.activeTool == Tools.RECTANGLE) {
      this.rectangle.handleMouseDown(x, y);
    }
  }

  handleMouseUp(x: number, y: number) {
    this.isDrawing = false;
    if (this.activeTool == Tools.PENCIL) {
      this.pencil.handleMouseUp();
      this.dispatchEvent(new Event(STATE_CHANGE));
    }
    if (this.activeTool == Tools.RECTANGLE) {
      this.rectangle.handleMouseUp(x, y);
      this.dispatchEvent(new Event(STATE_CHANGE));
    }
  }
  handleMouseMove(x: number, y: number) {
    if (this.isDrawing) {
      if (this.activeTool == Tools.PENCIL) {
        this.pencil.handleMouseMove(x, y);
        this.dispatchEvent(new Event(DRAWING_ON_CANVAS));
      }
      if (this.activeTool == Tools.RECTANGLE) {
        this.rectangle.handleMouseMove(x, y);
        this.updateState({
          pencil: this.pencil.paths,
          rects: this.rectangle.rects,
        });
      }
    }
  }
  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
    this.pencil.context = context;
    this.rectangle.context = context;
  }
  changeTool(tool: Tools) {
    this.activeTool = tool;
  }
  clearCanvas() {
    this.pencil.clean();
    this.rectangle.clean();
    this.updateState({
      pencil: [],
      rects: [],
    });

    this.context?.clearRect(0, 0, this.width, this.height);
  }
  dispatchClearCanvas() {
    this.dispatchEvent(new Event(CLEAR_CANVAS));
  }
}
