"use client";
import { GAME_STAGE, Player } from "@/app/game/[roomId]/page";
import Canvas from "@/components/canvas/Canvas";
import { WORD_CHOOSEN } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";

type Props = {
  wordList: string[];
  player: Player | undefined;
  socket: WebSocket | null;
  gameStage: GAME_STAGE;
  standings: Player[] | undefined;  
  setWord: React.Dispatch<SetStateAction<string>>
};
export default function SharedBoardScreen({
  wordList,
  player,
  socket,
  gameStage,
  standings,
  setWord
}: Props) {
  const router = useRouter();
  const params = useParams();
  const [isDisabled, setIsDisabled] = useState<boolean>(
    !player?.isTurnPlayer || false
  );

  useEffect(() => {
    if (!player) return;
    setIsDisabled(!player.isTurnPlayer);
  }, [player]);

  function wordSelected(i: number) {
    if (!socket) {
      return;
    }
    setWord(wordList[i]);
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
          style={{
            display:
              gameStage === GAME_STAGE.WAITING || gameStage === GAME_STAGE.END
                ? "flex"
                : "none",
          }}
          className="absolute z-2   h-full w-full top-0 left-0 items-center justify-center"
        >
          {gameStage === GAME_STAGE.END  ? (
            <EndScreen standings={standings} />
          ) : (
            <div>
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
          )}
        </div>
      </div>
    </div>
  );
}
type EndScreenProps = {
  standings: Player[] | undefined;
};
function EndScreen({ standings }: EndScreenProps) {
  if (!standings) return;
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      {standings.map((user) => {
        return (
          <div className="flex flex-col items-center border-2 ">
            <div className="flex gap-1 text-xl">
              <strong>#{user.rank}</strong>
              <p className="capitalize">{user.user.name}</p>
            </div>
            <p>{user.points}</p>
          </div>
        );
      })}
    </div>
  );
}
