"use client";
import { Player } from "@/app/game/[roomId]/page";
import Canvas from "@/components/canvas/Canvas";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { socket: WebSocket | null; player: Player | undefined };

export default function SharedBoardScreen({ socket, player }: Props) {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(player?.isTurnPlayer || false);
  useEffect(()=>{
    if(!player)return
      setIsDisabled(player.isTurnPlayer);
  },[player])


  return (
    <div className="m-4 border-2 border-red-300">
      <button onClick={() => router.push("/")}>back</button>
      <div className="p-4 border-2 border-black">Room page</div>
      <div className="relative w-[100%]">
        <Canvas isDisabled={player?.isTurnPlayer || false} />
        <div
          id="overlay"
          style={{ display: isDisabled ? "none" : "block" }}
          className="absolute z-2 bg-transparent h-full w-full top-0 left-0"
        ></div>
        <div
          id="optionOverlay"
          style={{ display: isDisabled ? "none" : "block" }}
          className="absolute z-2 bg-red h-full w-full top-0 left-0"
        ></div>
      </div>
    </div>
  );
}
