"use client";
import Canvas, {
  DRAWING_ON_CANVAS,
  INIT_CANVAS,
  JOIN_ROOM,
  STATE_CHANGE,
  UPDATE_CANVAS,
  newBoard as board,
} from "@/components/canvas/Canvas";
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {};

export default function SharedBoardScreen({}: Props) {
  const socket = useSocket();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!socket) {
      return;
    }
    board.addEventListener(STATE_CHANGE, (e: any) => {
      const state = {
        pencil: board.pencil.paths,
        rects: board.rectangle.rects,
      };

      socket.send(
        JSON.stringify({
          type: STATE_CHANGE,
          payload: {
            state,
            roomId: params.roomId,
          },
        })
      );
    });
    board.addEventListener(DRAWING_ON_CANVAS, (e: any) => {
      const state = {
        pencil: board.pencil.currLine,
        rects: board.rectangle.rects,
      };

      socket.send(
        JSON.stringify({
          type: DRAWING_ON_CANVAS,
          payload: {
            state,
            roomId: params.roomId,
          },
        })
      );
    });

    socket.send(
      JSON.stringify({
        type: JOIN_ROOM,
        payload: {
          roomId: params.roomId,
          userId: Math.random().toString(),
        },
      })
    );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case UPDATE_CANVAS:
          let state = message.payload.updatedState;
          board.updateState(state);
        case INIT_CANVAS:
          let ss = message.payload.updatedState;
          board.updateState(ss);

        case DRAWING_ON_CANVAS:
          let s = message.payload.drawingState;
          board.drawingOnBoard(s);
      }
    };
    return () => {
      board.removeEventListener(STATE_CHANGE, () => {
        console.log("removed statechange listener");
      });
    };
  }, [socket]);

  return (
    <div className="m-4 border-2 border-red-300">
      <button onClick={() => router.push("/board")}>back</button>
      <div className="p-4 border-2 border-black">Room page</div>
      <Canvas socket={socket} />
    </div>
  );
}
