"use client";
import Board, { Tools } from "@/board";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constants";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";

export type CanvasState = {
  pencil: Pos[][];
  rects: RectangleProps[];
};
interface Pos {
  x: number;
  y: number;
}
interface RectangleProps {
  pos: Pos;
  width: number;
  height: number;
}
type Props = {
  socket: WebSocket | null;
};
export const JOIN_ROOM = "join_room";
export const CREATE_ROOM = "create_room";
export const STATE_CHANGE = "state_change";
export const UPDATE_CANVAS = "update_canvas";
export const ROOM_CREATED = "room_created";

export const board = new Board();

export default function Canvas({ socket }: Props) {
  const params = useParams();
  useEffect(() => {
    boardSetup();

    console.log("use effec");
  }, []);

  function boardSetup() {
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

    board.addEventListener(STATE_CHANGE, (e) => {
      const state = {
        pencil: board.pencil.paths,
        rectangle: board.rectangle.rects,
      };

      socket?.send(
        JSON.stringify({
          type: STATE_CHANGE,
          payload: {
            state,
            roomId: params.roomId,
          },
        })
      );
    });

    // if (!socket) return;

    // socket.onmessage = (event) => {
    //   const message = JSON.parse(event.data);

    //   switch (message.type) {
    //     case UPDATE_CANVAS:
    //       console.log("update");
    //       message.payload.updatedState;
    //   }
    // };

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
  }
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
