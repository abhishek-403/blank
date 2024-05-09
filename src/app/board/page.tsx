"use client";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {};

export default function BoardScreen({}: Props) {
  const router = useRouter();

  async function createRoom() {
    

    const data = await fetch("http://localhost:3001/createroom", {
      method: "GET",
    });

    const res = await data.json();
    console.log(res);
    

    router.replace(`/board/${res.roomId}`);
  }

  return (
    <div>
      on board
      <button onClick={createRoom}>share btn</button>
    </div>

    // <div className="flex border-2 border-black overflow-auto w-full h-full gap-10 justify-center">
    //   <div>
    //     <ParticipantsWindow />
    //   </div>
    //   <div>
    //   </div>
    //   <div>
    //     <ChatWindow />
    //   </div>
    // </div>
  );
}
