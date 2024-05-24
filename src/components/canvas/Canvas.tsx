"use client";
import Board, { Tools } from "@/board";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constants";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

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
  socket: any;
};
export const JOIN_ROOM = "join_room";
export const CREATE_ROOM = "create_room";
export const UPDATE_CANVAS = "update_canvas";
export const STATE_CHANGE = "state_change";
export const ROOM_CREATED = "room_created";
export const DRAWING_ON_CANVAS = "drawing_on_board";
export const INIT_CANVAS = "init_canvas";
export const CLEAR_CANVAS = "clear_canvas";
export const newBoard = new Board(800, 600);

export default function Canvas({ socket }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pencilRef = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<HTMLButtonElement>(null);
  const [board, setBoard] = useState<any>();
  useEffect(() => {
    boardSetup();

    console.log("use effec");
  }, []);

  function boardSetup() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      newBoard.setContext(ctx);
      setBoard(newBoard);
    }

    // const pencil_btn = document.getElementById("pencil_btn");
    // const rect_btn = document.getElementById("rect_btn");

    // pencil_btn!.addEventListener("click", () => {
    //   board.setTool(Tools.PENCIL);
    // });

    // rect_btn!.addEventListener("click", () => {
    //   board.setTool(Tools.RECTANGLE);
    // });
  }
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!board || !canvasRef.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    board.handleMouseDown(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!board || !canvasRef.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    board.handleMouseMove(x, y);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!board) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    board.handleMouseUp(x, y);
  };
  return (
    <div className="flex ">
      <div className="">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="border-2 border-black "
          id="canvas_id"
        ></canvas>
        <button
          onClick={() => board.changeTool(Tools.PENCIL)}
          ref={pencilRef}
          className="text-red-500"
        >
          Pencil
        </button>
        <button onClick={() => board.changeTool(Tools.RECTANGLE)} ref={rectRef}>
          Rectangle
        </button>
        <button
          onClick={() => {
            board.clearCanvas();
            board.dispatchClearCanvas();
          }}
        >
          clear
        </button>
      </div>
    </div>
  );
}
