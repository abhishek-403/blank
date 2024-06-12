"use client";
import { SUBMIT_ANSWER } from "@/constants/messages";
import { MESSAGE_TYPES, Player, chat } from "@/constants/types";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

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
      <div className="relative h-[600px] bg-white flex flex-col w-[320px] border border-[#121212]">
        <div className="w-full mt-auto mb-8  overflow-y-auto  ">
          {chats.map((e, i) => {
            return (
              <div
                key={i}
                className="flex font-roboto flex-row gap-1 p-1  px-2 border-t rounded  items-center"
                style={{
                  background:
                    e.messageType === MESSAGE_TYPES.ERROR
                      ? "#fda4af"
                      : e.messageType === MESSAGE_TYPES.HASGUESSED
                      ? "#4ade80"
                      : "white",
                }}
              >
                {e.messageType === MESSAGE_TYPES.NORMAL && (
                  <div className="flex gap-1">
                    <p className="font-medium text-md ">{e.user.name} </p>{" "}
                    <div>:</div>
                  </div>
                )}
                <p className=" overflow-x-hidden">{e.message}</p>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="flex gap-2 absolute bottom-[0px]  ">
          <input
            value={input}
            onKeyDown={handleInputKeyDown}
            onChange={(e) => {
              if (
                e.target.value.length <= parseInt(process.env.MAX_WORD_LENGTH!)
              )
                setInput(e.target.value);
            }}
            type="text"
            disabled={player?.isTurnPlayer || player?.hasGuessedCurLap}
            autoFocus
            className="border-2 "
          />
          <button onClick={submitAnswer}>Submit</button>
        </div>
      </div>
    </div>
  );
}
