import {
  CLEAR_CANVAS,
  DRAWING_ON_CANVAS,
  STATE_CHANGE,
} from "@/constants/messages";
import Pencil from "./Tools/Pencil";
import Rectangle, { RectangleProps } from "./Tools/Rectangle";
import { CanvasState } from "@/constants/types";

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}
export type Pos = {
  x: number;
  y: number;
  stroke?: number;
  strokeColor?: string;
};
export enum Tools {
  PENCIL,
  RECTANGLE,
  TRIANGLE,
  CIRCLE,
  FILL,
}
export type FillProps = {
  color: string;
  x: number;
  y: number;
};
export type BoardPaths = {
  fill: FillProps[];
  undoStack: Tools[];
};
export type PropertiesProp = {
  strokeColor?: string;
  stroke?: number;
};
export default class Board extends EventTarget {
  paths: BoardPaths = { fill: [], undoStack: [] };
  pencil = new Pencil();
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
  }

  setProperties({ strokeColor, stroke }: PropertiesProp) {
    this.pencil.setProperties(strokeColor, stroke);
  }

  undoState() {
    if (this.paths.undoStack.length === 0) return;

    const top = this.paths.undoStack.pop();
    if (top === Tools.FILL) {
      this.paths.fill.pop();
    }
    if (top === Tools.PENCIL) {
      this.pencil.paths.pop();
    }
    const rempencil = this.pencil.paths;
    const remfill = this.paths.fill;
    this.clearCanvas();
    this.pencil.paths = rempencil;
    this.paths.fill = remfill;
    this.updateState({
      pencil: rempencil,
      fill: remfill,
    });
    console.log("dddii");

    this.dispatchEvent(new Event(STATE_CHANGE));
  }

  updateState(state: CanvasState) {
    
    this.context?.clearRect(0, 0, this.width, this.height);
    this.pencil.updateState(state.pencil);
    this.paths.fill = state.fill;

    if (this.paths.fill) {
      for (const p of this.paths.fill) {
        this.floodFill(p.x, p.y, p.color);
      }
    }
  }
  drawingOnBoard(state: any) {
    if (!state) return;
    this.pencil.drawingOnBoard(state);
  }

  handleMouseDown(x: number, y: number) {
    if (this.activeTool === Tools.FILL) {
      this.floodFill(x, y, this.pencil.strokeColor);
      this.paths.fill.push({ x, y, color: this.pencil.strokeColor });

      this.paths.undoStack.push(Tools.FILL);
      this.dispatchEvent(new Event(STATE_CHANGE));
    }
    if (this.activeTool == Tools.PENCIL) {
      this.isDrawing = true;
      this.pencil.handleMouseDown(x, y);
    }
  }

  handleMouseUp(x: number, y: number) {
    this.isDrawing = false;
    if (this.activeTool == Tools.PENCIL) {
      this.pencil.handleMouseUp();
      this.paths.undoStack.push(Tools.PENCIL);
      this.dispatchEvent(new Event(STATE_CHANGE));
    }
  }
  handleMouseMove(x: number, y: number) {
    if (this.isDrawing) {
      if (this.activeTool == Tools.PENCIL) {
        this.pencil.handleMouseMove(x, y);
        this.dispatchEvent(new Event(DRAWING_ON_CANVAS));
      }
    }
  }

  // flood fill

  getColorAtPixel(data: Uint8ClampedArray, x: number, y: number): Color {
    const pos = (y * this.width + x) * 4;
    return {
      r: data[pos],
      g: data[pos + 1],
      b: data[pos + 2],
      a: data[pos + 3],
    };
  }

  setColorAtPixel(data: Uint8ClampedArray, pos: number, color: string): void {
    const colorObject = this.hexToRgb(color);
    data[pos] = colorObject.r;
    data[pos + 1] = colorObject.g;
    data[pos + 2] = colorObject.b;
    data[pos + 3] = 255;
  }

  hexToRgb(hex: string): Color {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
      a: 255,
    };
  }
  colorsMatch(c1: Color, c2: Color): boolean {
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
  }
  floodFill(x: number, y: number, fillColor: string): void {
    const imageData = this.context!.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    const targetColor = this.getColorAtPixel(data, x, y);

    if (this.colorsMatch(targetColor, this.hexToRgb(fillColor))) {
      return;
    }
    const queue = [[x, y]];
    while (queue.length > 0) {
      const [currentX, currentY] = queue.shift() as [number, number];
      const currentPos = (currentY * this.width + currentX) * 4;
      if (
        currentX < 0 ||
        currentX >= this.width ||
        currentY < 0 ||
        currentY >= this.height ||
        !this.colorsMatch(
          this.getColorAtPixel(data, currentX, currentY),
          targetColor
        ) ||
        this.colorsMatch(
          this.getColorAtPixel(data, currentX, currentY),
          this.hexToRgb(fillColor)
        )
      ) {
        continue;
      }

      this.setColorAtPixel(data, currentPos, fillColor);
      queue.push([currentX + 1, currentY]);
      queue.push([currentX - 1, currentY]);
      queue.push([currentX, currentY + 1]);
      queue.push([currentX, currentY - 1]);
    }

    // this.paths.fill.push({ x, y, color: fillColor });
    this.context!.putImageData(imageData, 0, 0);
  }

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
    this.pencil.context = context;
  }
  changeTool(tool: Tools) {
    this.activeTool = tool;
  }
  clearCanvas() {
    this.pencil.clean();
    this.updateState({
      pencil: [],
      fill: [],
    });

    this.context?.clearRect(0, 0, this.width, this.height);
  }
  dispatchClearCanvas() {
    this.dispatchEvent(new Event(CLEAR_CANVAS));
  }
}
