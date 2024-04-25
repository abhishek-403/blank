"use client";
import Board, { Tools } from "@/board";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constants";
import React, { useEffect } from "react";

type Props = {};

export default function Canvas({}: Props) {
  useEffect(() => {
    const canvas: HTMLCanvasElement = document.querySelector("#canvas_id")!;
    if (!canvas) return;

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
  }, []);
  return (
    <div className="flex flex-col">
      <div>
        <canvas className="border-2 border-black " id="canvas_id"></canvas>
      </div>
      <div className="">
        <button id="pencil_btn" className="text-red-500">
          Pencil
        </button>
        <button id="rect_btn">Rectangle</button>
      </div>
    </div>
  );
}
