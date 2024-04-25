"use client";
import Board, { Tools } from "@/board";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constants";
import React, { useEffect } from "react";

type Props = {};

const board = new Board();
export default function Canvas({}: Props) {
  useEffect(() => {
    const canvas: HTMLCanvasElement = document.querySelector("#canvas_id")!;
    if (!canvas) return;

    board.setDimensions({
      left: canvas.offsetLeft,
      top: canvas.offsetTop,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    let ctx = canvas.getContext("2d");

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
    console.log("use effec");
  }, []);
  return (
    <div className="flex ">
      <div className="">
        <canvas
          onMouseDown={(e) => board.mouseDown(e)}
          onMouseUp={(e) => board.mouseUp(e)}
          onMouseMove={(e) => board.mouseMove(e)}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-black "
          id="canvas_id"
        ></canvas>
        <button id="pencil_btn" className="text-red-500">
          Pencil
        </button>
        <button id="rect_btn">Rectangle</button>
      </div>
    </div>
  );
}
