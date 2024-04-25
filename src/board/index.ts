import Pencil from "./Tools/Pencil";
import Rectangle from "./Tools/Rectangle";

export interface Pos {
  x: number;
  y: number;
}
export enum Tools {
  PENCIL,
  RECTANGLE,
  TRIANGLE,
  CIRCLE,
}
export default class Board {
  paths: Pos[][] = [];
  mousePos: Pos = { x: 0, y: 0 };
  pencil = new Pencil();
  rectangle = new Rectangle();
  activeTool: Tools = Tools.RECTANGLE;

  constructor() {
    this.paths = [];
    let isMouseDown = false;
    document.onmousedown = (e) => {
      this.mousePos = { x: e.clientX, y: e.clientY };
      isMouseDown = true;

      this.pencil.paths.push([]);
      this.pencil.updateMousePos(this.mousePos);
      this.rectangle.updateMousePosition(this.mousePos);
       

      this.rectangle.currentRectangle = {
        pos: this.mousePos,
        width: 0,
        height: 0,
      };
    };
    document.onmouseup = () => {
      isMouseDown = false;
      this.rectangle.rects.push(this.rectangle.currentRectangle!);
      this.rectangle.currentRectangle = undefined;
    };
    document.addEventListener("mousemove", (e: any) => {
      if (isMouseDown) {
        let x = e.clientX,
          y = e.clientY;
        this.mousePos = { x, y };
        this.pencil.updateMousePos(this.mousePos);
        this.rectangle.updateMousePosition(this.mousePos);
       
      }
    });
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
}
