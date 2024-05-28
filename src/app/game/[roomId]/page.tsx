"use client";
import {
  CLEAR_CANVAS,
  CORRECT_ANSWER,
  DRAWING_ON_CANVAS,
  GAME_CLOCK,
  INIT_CANVAS,
  INIT_USER,
  INTI_CHAT,
  JOIN_ROOM,
  STATE_CHANGE,
  UPDATE_CANVAS,
  WRONG_ANSWER,
} from "@/constants";
import { newBoard as board } from "@/components/canvas/Canvas";
import SharedBoardScreen from "@/components/canvas/boardscreen";
import ChatWindow from "@/components/chats/ChatWindow";
import ParticipantsWindow from "@/components/participants/ParticipantsWindow";
import { useSocket } from "@/hooks/useSocket";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import NavBar from "@/components/navbar/NavBar";
export class User {
  public id: string;
  public socket: WebSocket;
  public name: string;

  constructor(name: string, socket: WebSocket, userId: string) {
    this.socket = socket;
    this.id = userId;
    this.name = name;
  }
}
export interface chat {
  user: User;
  message: string;
}

export default function GamePage() {
  const socket = useSocket();
  const params = useParams();

  const [chats, setChats] = useState<chat[]>([]);
  const [clock,setClock] = useState<number>(0);
  const [word,setWord] = useState<string>("_ _ _ _");

  useEffect(() => {
    if (!socket) {
      return;
    }
    try {
      if (!isOpen(socket)) return;
      socket.send(
        JSON.stringify({
          type: INIT_USER,
          payload: {
            userId: Math.random().toString(12).substring(2, 9),
            name: "test",
          },
        })
      );
      socket.send(
        JSON.stringify({
          type: JOIN_ROOM,
          payload: {
            roomId: params.roomId,
          },
        })
      );

      addAllListners(socket, params);
      listenSocketMessages(socket, setChats, chats,setClock);
    } catch (e) {
      console.log("e");
    }
    return () => {
      removeAllListeners();
    };
  }, [socket]);
  return (
    <div>
      <div className="flex h-full flex-col gap-2 ">
        <div>
          <NavBar clock={clock} word={word} />
        </div>
        <div className="flex  overflow-auto w-full h-[100%] gap-10 justify-center">
          <div>
            <ParticipantsWindow />
          </div>
          <div>
            <SharedBoardScreen socket={socket} />
          </div>
          <div>
            <ChatWindow socket={socket} chats={chats} />
          </div>
        </div>
      </div>
    </div>
  );
}

function isOpen(ws: WebSocket) {
  return ws.readyState === ws.OPEN;
}

function listenSocketMessages(
  socket: WebSocket | null,
  setChats: React.Dispatch<SetStateAction<chat[]>>,
  chats: chat[],
  setClock: React.Dispatch<SetStateAction<number>>
) {
  if (!socket) return;
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case DRAWING_ON_CANVAS:
        board.drawingOnBoard(message.payload.drawingStat);
        break;

      case UPDATE_CANVAS:
        board.updateState(message.payload.updatedState);
        break;

      case CLEAR_CANVAS:
        board.clearCanvas();
        break;

      case INIT_CANVAS:
        board.updateState(message.payload.updatedState);
        break;

      case CORRECT_ANSWER:
        let newChat = message.payload.chats;
        setChats([...chats, ...newChat]);
        break;
      case WRONG_ANSWER:
        let sa = message.payload.chats;
        setChats([...chats, ...sa]);
        break;

      case INTI_CHAT:
        setChats(message.payload.chats);
        break;
      case GAME_CLOCK:
        console.log(message.payload.time);
        setClock(message.payload.time);
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
