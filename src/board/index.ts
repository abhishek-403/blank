import {
  CLEAR_CANVAS,
  CanvasState,
  DRAWING_ON_CANVAS,
  STATE_CHANGE,
} from "@/components/canvas/Canvas";
import Pencil from "./Tools/Pencil";
import Rectangle, { RectangleProps } from "./Tools/Rectangle";

export type Pos = {
  x: number;
  y: number;
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
  mousePos: Pos = { x: 0, y: 0 };
  pencil = new Pencil();
  rectangle = new Rectangle();
  activeTool: Tools = Tools.PENCIL;

  width: number;
  height: number;
  context: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
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
    console.log("tool changed", this.activeTool);
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

// drawLine(x1: number, y1: number, x2: number, y2: number) {
//   if (!this.context) return;

//   this.context.beginPath();
//   this.context.moveTo(x1, y1);
//   this.context.lineTo(x2, y2);
//   this.context.strokeStyle = "black";
//   this.context.stroke();
//   this.context.closePath();
// }
// updateState(state: CanvasState) {
//   this.pencil.paths = state.pencil;
//   for (const path of this.pencil.paths) {
//     if (path.length > 0 && this.context) {
//       for (let i = 0; i < path.length - 1; i++) {
//         this.drawLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
//       }
//     }
//   }
// }
// drawingOnBoard(state: any) {

//   if (!state) return;

//   for (let i = 0; i < state.pencil.length - 1; i++) {
//     let path = state.pencil;

//     this.drawLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
//   }
// }

// handleMouseDown(x: number, y: number) {
//   this.isDrawing = true;
//   if (this.activeTool == Tools.PENCIL) {
//     this.startX = x;
//     this.startY = y;
//     this.pencil.currLine.push({ x, y });
//   }
// }

// handleMouseUp() {
//   this.isDrawing = false;
//   if (this.activeTool == Tools.PENCIL) {
//     this.pencil.paths.push(this.pencil.currLine);
//     this.dispatchEvent(new Event(STATE_CHANGE));
//     this.pencil.currLine = [];
//   }
// }
// handleMouseMove(x: number, y: number) {
//   if (this.isDrawing) {
//     this.drawLine(this.startX, this.startY, x, y);
//     this.startX = x;
//     this.startY = y;
//     this.pencil.currLine.push({ x, y });

//     this.dispatchEvent(new Event(DRAWING_ON_CANVAS));
//   }
// }
