"use client";
import { Player } from "@/app/game/[roomId]/page";
import Canvas from "@/components/canvas/Canvas";
import { WORD_CHOOSEN } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  wordList: string[];
  player: Player | undefined;
  socket: WebSocket | null;
  isLayOver: boolean;
};
// let words2 = ["house", "table", "lamp"];
export default function SharedBoardScreen({
  wordList,
  player,
  socket,
  isLayOver,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const [isDisabled, setIsDisabled] = useState<boolean>(
    !player?.isTurnPlayer || false
  );

  useEffect(() => {
    if (!player) return;
    setIsDisabled(!player.isTurnPlayer);
    console.log(player.isTurnPlayer);
  }, [player]);

  function wordSelected(i: number) {
    if (!socket) {
      console.log("not player");
      return;
    }

    console.log("hi there fe");
    socket.send(
      JSON.stringify({
        type: WORD_CHOOSEN,
        payload: {
          index: i,
          roomId: params.roomId,
        },
      })
    );
  }

  return (
    <div className="m-4 border-2 border-red-300">
      <button onClick={() => router.push("/")}>back</button>
      <div className="p-4 border-2 border-black">Room page</div>
      <div className="relative w-[100%]">
        <Canvas isDisabled={isDisabled} />
        <div
          id="overlay"
          style={{ display: isDisabled ? "block" : "none" }}
          className="absolute z-2 bg-transparent h-full w-full top-0 left-0"
        ></div>
        <div
          // style={{ display: "flex" }}
          style={{ display: isLayOver ? "flex" : "none" }}
          className="absolute z-2   h-full w-full top-0 left-0 items-center justify-center"
        >
          {player?.isTurnPlayer ? (
            <div className="   h-full w-full items-center justify-center flex gap-4">
              {wordList.map((word, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => wordSelected(i)}
                    className="p-4 border-2 bg-white text-xl cursor-pointer hover:bg-zinc-100 "
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>waiting</div>
          )}
        </div>
      </div>
    </div>
  );
}
