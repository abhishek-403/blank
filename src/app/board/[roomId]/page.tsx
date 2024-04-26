"use client";
import Canvas, {
  JOIN_ROOM,
  UPDATE_CANVAS,
  board,
} from "@/components/canvas/Canvas";
import { useSocket } from "@/hooks/useSocket";
import { randomBytes, randomUUID } from "crypto";
import { useParams } from "next/navigation";
import { useEffect } from "react";

type Props = {};

export default function SharedBoardScreen({}: Props) {
  const socket = useSocket();
  const params = useParams();
  console.log("on roomshare board   ");

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.send(
      JSON.stringify({
        type: JOIN_ROOM,
        payload: {
          roomId: params.roomId,
          userId: randomBytes(20),
        },
      })
    );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case UPDATE_CANVAS:
          console.log("update");
          board.pencil.paths = message.payload.updatedState.pencil.paths;
          board.rectangle.rects = message.payload.updatedState.rectangle.rects;
      }
    };
  }, [socket]);

  return (
    <div className="m-4 border-2 border-red-300">
      <div className="p-4 border-2 border-black">Room page</div>
      <Canvas socket={socket} />
    </div>
  );
}
