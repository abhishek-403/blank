"use client";
import Board, { Tools } from "@/board";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  bucketIcon,
  colorPalette,
  dotIcon,
} from "@/constants/messages";
import { IoIosColorFill, IoIosUndo } from "react-icons/io";
import { FaPencil } from "react-icons/fa6";
import React, { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import dot from "@/components/assets/dot-svg.svg";
type Props = {
  isDisabled: boolean;
};
export const newBoard = new Board(CANVAS_WIDTH, CANVAS_HEIGHT);
export default function Canvas({ isDisabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pencilRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = useState<number>(5);
  const [cursor, setCursor] = useState<string>(dotIcon);
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
    <div className=" h-fit w-full ">
      <div className={`relative `}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`border-2 border-black h-full  w-full `}
          id="canvas_id"
          style={{
            cursor: `url(${cursor}) 3 3, auto`,
          }}
        ></canvas>
        <div
          id="overlay"
          style={{ display: isDisabled ? "block" : "none" }}
          className="absolute z-2 bg-transparent h-full w-full top-0 left-0"
        ></div>
      </div>

      <div
        style={{ display: isDisabled ? "none" : "flex" }}
        className="w-full "
      >
        <div className="w-full flex-col lg:flex-row flex gap-2  justify-between items-center cursor-pointer">
          <div className="flex flex-wrap lg:w-[390px] w-[90vw] px-1 lg:px-0">
            {colorPalette.map((color, i) => {
              return (
                <div
                  key={i}
                  style={{ backgroundColor: color }}
                  className={`w-[20px] h-[20px] lg:w-[30px] lg:h-[30px] border border-black hover:opacity-70`}
                  onClick={() => {
                    board.setProperties({ strokeColor: color });
                  }}
                ></div>
              );
            })}
          </div>

          <div className="flex gap-2 items-center   ">
            <div
              onClick={() => {
                setCursor(dotIcon);
                board.changeTool(Tools.PENCIL);
              }}
              ref={pencilRef}
              className="text-black border border-[#121212] rounded-lg flex items-center justify-center  px-3 py-2 hover:bg-[#e8e8e8]"
            >
              <FaPencil size={22} />
            </div>
            <div
              onClick={() => {
                setCursor(bucketIcon);
                board.changeTool(Tools.FILL);
              }}
              className="rounded-lg flex items-center justify-center border border-[#121212]   px-3 py-2 hover:bg-[#e8e8e8]"
            >
              <IoIosColorFill size={22} />
            </div>
            <div
              className="rounded-lg  border border-[#121212] flex items-center justify-center  px-3 py-2 hover:bg-[#e8e8e8] "
              onClick={() => {
                board.undoState();
              }}
            >
              <IoIosUndo size={22} />
            </div>
            <div
              onClick={() => {
                board.clearCanvas();
                board.dispatchClearCanvas();
              }}
              className="rounded-lg  border border-[#121212] flex items-center justify-center  px-3 py-2 hover:bg-[#e8e8e8]"
            >
              <MdDelete size={22} />
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center pr-2">
            <input
              onChange={(e) => {
                setInputVal(parseInt(e.target.value));
                board.setProperties({ stroke: e.target.value });
              }}
              type="range"
              min="1"
              max="20"
              className="w-[120px]"
              value={inputVal}
            />
            <div>{inputVal}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
