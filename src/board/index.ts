import { STATE_CHANGE } from "@/components/canvas/Canvas";
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
  activeTool: Tools = Tools.RECTANGLE;
  leftOffset: number = 0;
  topOffset: number = 0;
  width: number = 0;
  height: number = 0;
  isMouseDown: boolean = false;
  isInBoard: boolean = false;

  constructor() {
    super();
    this.paths = [];
  }
  mouseDown(e: any) {
    let x = e.clientX - this.leftOffset,
      y = e.clientY - this.topOffset;
    this.mousePos = { x, y };
    this.isMouseDown = true;

    this.pencil.paths.push([]);
    this.pencil.updateMousePos(this.mousePos);
    this.rectangle.updateMousePosition(this.mousePos);

    this.rectangle.currentRectangle = {
      pos: this.mousePos,
      width: 0,
      height: 0,
    };
  }
  mouseUp(e: any) {
    if (this.isMouseDown == false) return;
    this.isMouseDown = false;
    this.rectangle.rects.push(this.rectangle.currentRectangle!);
    this.rectangle.currentRectangle = undefined;
  }
  mouseMove(e: any) {
    let x = e.clientX - this.leftOffset,
      y = e.clientY - this.topOffset;
    if (!this.isMouseDown) return;
    if (!(x >= 0 && x <= this.width && y <= this.height && y >= 0)) {
      this.mouseUp(e);
      return;
    }

    this.dispatchEvent(new Event(STATE_CHANGE));

    this.mousePos = { x, y };
    this.pencil.updateMousePos(this.mousePos);
    this.rectangle.updateMousePosition(this.mousePos);
  }

  draw(ctx: CanvasRenderingContext2D) {
    try {
      this.pencil.draw(ctx);
      this.rectangle.draw(ctx);
    } catch (e: any) {
      console.log("index draw", e);
    }
  }
  update() {
    try {
      if (this.activeTool === Tools.PENCIL) {
        this.pencil.update();
      }
      if (this.activeTool === Tools.RECTANGLE) {
        this.rectangle.update();
      }
    } catch (e: any) {
      console.log("index update", e);
    }
  }

  setTool(tool: Tools) {
    this.activeTool = tool;
  }
  setDimensions({ left, top, width, height }: setboardProps) {
    this.leftOffset = left;
    this.topOffset = top;
    this.width = width;
    this.height = height;
  }
  initialCanvas() {}
}
