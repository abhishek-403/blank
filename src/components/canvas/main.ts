import Board, { Tools } from "../../board";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../constants";

const canvas = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

document.body.append(canvas);
let ctx = canvas.getContext("2d");

const board = new Board();

const pencil_btn = document.getElementById("pencil_btn");
const rect_btn = document.getElementById("rect_btn");

pencil_btn!.addEventListener("click", () => {
  board.setTool(Tools.PENCIL);
});
rect_btn!.addEventListener("click", () => {
  board.setTool(Tools.RECTANGLE);
});

const loop = () => {
  if (ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    board.draw(ctx);
    board.update();
  }

  requestAnimationFrame(loop);
};
loop();
