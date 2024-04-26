"use client";
import Canvas, {
  JOIN_ROOM,
  STATE_CHANGE,
  UPDATE_CANVAS,
  board,
} from "@/components/canvas/Canvas";
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useEffect } from "react";

type Props = {};

export default function SharedBoardScreen({}: Props) {
  const socket = useSocket();
  const params = useParams();

  useEffect(() => {
    if (!socket) {
      return;
    }
    board.addEventListener(STATE_CHANGE, (e) => {
      const state = {
        pencil: board.pencil.paths,
        rect: board.rectangle.rects,
      };
      console.log("statechanged ");

      if (!socket) {
        console.log("early return");
        return;
      }

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
          console.log("update --");
          board.pencil.paths = message.payload.updatedState.pencil;
          board.rectangle.rects = message.payload.updatedState.rect;
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
      <div className="p-4 border-2 border-black">Room page</div>
      <Canvas socket={socket} />
    </div>
  );
}
