"use client";
import Board, { Tools } from "@/board";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  colorPalette,
} from "@/constants/messages";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  isDisabled: boolean;
};
export const newBoard = new Board(CANVAS_WIDTH, CANVAS_HEIGHT);
export default function Canvas({ isDisabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pencilRef = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<HTMLButtonElement>(null);
  const [board, setBoard] = useState<any>();

  useEffect(() => {
    boardSetup();
  }, []);

  function boardSetup() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      newBoard.setContext(ctx);
      setBoard(newBoard);
    }
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
        <div className="relative w-[100%]">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border-2 border-black z-1"
            id="canvas_id"
          ></canvas>
          <div
            id="overlay"
            style={{ display: isDisabled ? "block" : "none" }}
            className="absolute z-2 bg-transparent h-full w-full top-0 left-0"
          ></div>
        </div>

        <div style={{ display: isDisabled ? "none" : "block" }}>
          <button
            onClick={() => board.changeTool(Tools.PENCIL)}
            ref={pencilRef}
            className="text-red-500"
          >
            Pencil
          </button>
          {/* <button
            onClick={() => board.changeTool(Tools.RECTANGLE)}
            ref={rectRef}
          >
            Rectangle
          </button> */}
          <button
            onClick={() => {
              board.clearCanvas();
              board.dispatchClearCanvas();
            }}
          >
            Clear
          </button>
          <div className="flex cursor-pointer">
            {colorPalette.map((color,i) => {
              return (
                <div
                key={i}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8`}
                  onClick={() => {
                    board.setProperties({ strokeColor: color });
                  }}
                ></div>
              );
            })}
          </div>
          <div>
            <input
              onChange={(e) => {
                board.setProperties({ stroke: e.target.value });
              }}
              type="range"
              id="vol"
              name="vol"
              min="1"
              max="20"
            />
          </div>
          <div onClick={()=>{
            board.changeTool(Tools.FILL)
          }}>
            Fill
          </div>
        </div>
      </div>
    </div>
  );
}
