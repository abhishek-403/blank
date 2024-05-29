"use client";
import { Player, chat } from "@/app/game/[roomId]/page";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { SUBMIT_ANSWER } from "@/constants";

type Props = {
  socket: WebSocket | null;
  chats: chat[];
  player: Player | undefined;
};

export default function ChatWindow({ socket, chats, player }: Props) {
  const params = useParams();
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
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
              <div key={i} className="flex gap-2  w-full">
                <p className="text-extrabold ">{`${e.user.name} :`}</p>
                <p className="text-base">{e.message}</p>
              </div>
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
            disabled={player?.hasGuessedCurLap}
            className="border-2"
          />
          <button onClick={submitAnswer}>Submit</button>
        </div>
      </div>
    </div>
  );
}
