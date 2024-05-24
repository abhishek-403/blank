"use client";
import Canvas, {
  CLEAR_CANVAS,
  DRAWING_ON_CANVAS,
  INIT_CANVAS,
  JOIN_ROOM,
  STATE_CHANGE,
  UPDATE_CANVAS,
  newBoard as board,
} from "@/components/canvas/Canvas";
import { useSocket } from "@/hooks/useSocket";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
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
    try {
      if (socket.readyState != socket.OPEN) return;

      socket.send(
        JSON.stringify({
          type: JOIN_ROOM,
          payload: {
            roomId: params.roomId,
            userId: Math.random().toString(),
          },
        })
      );
      addAllListners(socket, params);

      listenSocketMessages(socket);
    } catch (e) {
      console.log("e");
    }
    return () => {
      removeAllListeners();
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
function listenSocketMessages(socket: WebSocket) {
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case UPDATE_CANVAS:
        let state = message.payload.updatedState;
        board.updateState(state);
        break;

      case CLEAR_CANVAS:
        board.clearCanvas();
        break;

      case INIT_CANVAS:
        let ss = message.payload.updatedState;
        board.updateState(ss);
        break;

      case DRAWING_ON_CANVAS:
        let s = message.payload.drawingState;
        board.drawingOnBoard(s);
        break;
    }
  };
}
function addAllListners(socket: WebSocket, params: Params) {
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
  board.addEventListener(CLEAR_CANVAS, (e: any) => {
    socket.send(
      JSON.stringify({
        type: CLEAR_CANVAS,
        payload: {
          roomId: params.roomId,
        },
      })
    );
  });
}

function removeAllListeners() {
  board.removeEventListener(STATE_CHANGE, () => {
    console.log("removed statechange listener");
  });
  board.removeEventListener(CLEAR_CANVAS, () => {
    console.log("removed statechange listener");
  });
  board.removeEventListener(DRAWING_ON_CANVAS, () => {
    console.log("removed statechange listener");
  });
}
