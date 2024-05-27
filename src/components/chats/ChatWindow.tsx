"use client"
import React, { SetStateAction, useEffect, useState } from "react";
import { CORRECT_ANSWER, SUBMIT_ANSWER, UPDATE_CANVAS, WRONG_ANSWER } from "../canvas/Canvas";
import { useSocket } from "@/hooks/useSocket";

type Props = {};

export default function ChatWindow({}: Props) {
  const socket = useSocket()
  const [chats, setChats] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  
   useEffect(() => {
     if (!socket) {
       return;
     }
     try {
       socket.send(
         JSON.stringify({
           type: SUBMIT_ANSWER,
           payload: {
             answer: input,
           },
         })
       );
       
       listenSocketMessages(socket,setChats,chats);
     } catch (e) {
       console.log("e");
     }
   }, [socket]);
  
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key == "Enter") submitAnswer();
  }
  async function submitAnswer() {
    

    if (input) {
      setChats([...chats, input]);
    }
  }
  return (
    <div>
      ChatWindow
      <div className="relative h-[600px] flex flex-col w-[300px] border-2">
        <div className="w-full mt-auto mb-8">
          {chats.map((e, i) => {
            return (
              <p className="text-base w-full" key={i}>
                {e}
              </p>
            );
          })}
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


function listenSocketMessages(socket: WebSocket|null,setChats:React.Dispatch<SetStateAction<string[]>>,chats:string[]) {
  socket!.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case CORRECT_ANSWER:
        let newChat= message.payload.chats;
        setChats([...chats,newChat])
        break;
        case WRONG_ANSWER:
          let s = message.payload.chats;
          setChats([...chats,s])
        break;
    }
  };
}