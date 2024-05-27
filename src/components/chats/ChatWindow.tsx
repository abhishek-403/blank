"use client";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import {
  CORRECT_ANSWER,
  SUBMIT_ANSWER,
  UPDATE_CANVAS,
  WRONG_ANSWER,
} from "../canvas/Canvas";
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";

type Props = { socket: WebSocket | null };
// type Props = {};
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
interface chat {
  user: User;
  message: string;
}
export default function ChatWindow({ socket }: Props) {
  // const socket = useSocket()
  const params = useParams();

  const [chats, setChats] = useState<chat[]>([]);
  const [input, setInput] = useState<string>("");

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (!socket) {
      return;
    }

    listenSocketMessages(socket, setChats, chats);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key == "Enter") submitAnswer();
  }

  async function submitAnswer() {
    if (input) {
      if (!socket) return;

      socket.send(
        JSON.stringify({
          type: SUBMIT_ANSWER,
          payload: {
            roomId: params.roomId,
            answer: input,
          },
        })
      );

      setInput("");
    }
  }

  return (
    <div>
      ChatWindow
      <div className="relative h-[600px]  flex flex-col w-[300px] border-2">
        <div className="w-full mt-auto mb-8  overflow-y-auto ">
          {chats.map((e, i) => {
            return (
              <p className="text-base w-full" key={i}>
                {e.message}
              </p>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="flex gap-2 absolute bottom-[0px]  ">
          <input
            value={input}
            onKeyDown={handleInputKeyDown}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            name=""
            id=""
            className="border-2"
          />
          <button onClick={submitAnswer}>Submit</button>
        </div>
      </div>
    </div>
  );
}

function listenSocketMessages(
  socket: WebSocket | null,
  setChats: React.Dispatch<SetStateAction<chat[]>>,
  chats: chat[]
) {
  if (!socket) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case CORRECT_ANSWER:
        let newChat = message.payload.chats;
        setChats([...chats, ...newChat]);
        break;
      case WRONG_ANSWER:
        let s = message.payload.chats;
        setChats([...chats, ...s]);
        break;
    }
  };
}
