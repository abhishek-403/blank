"use client";
import { GAME_STAGE, Player, word } from "@/app/game/[roomId]/page";
import Canvas from "@/components/canvas/Canvas";
import { INIT_ROOM, RESTART_GAME, START_GAME, UPDATE_GAME_STAGE, WORD_CHOOSEN } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";

type Props = {
  wordList: word[];
  player: Player | undefined;
  socket: WebSocket | null;
  gameStage: GAME_STAGE;
  standings: Player[] | undefined;
  setWord: React.Dispatch<SetStateAction<word>>;
};
export default function SharedBoardScreen({
  wordList,
  player,
  socket,
  gameStage,
  standings,
  setWord,
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
    // setWord(wordList[i]);
    socket.send(
      JSON.stringify({
        type: WORD_CHOOSEN,
        payload: {
          word:wordList[i].word,
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
              player?.isRoomAdmin && gameStage === GAME_STAGE.LOBBY
                ? "flex"
                : "none",
          }}
          className="absolute z-2   h-full w-full top-0 left-0 items-center justify-center "
        >
          <GameSettings
            isRoomAdmin={player?.isRoomAdmin}
            roomId={params.roomId}
            player={player}
            socket={socket}
          />
        </div>
        <div
          style={{
            display:
              gameStage === GAME_STAGE.WAITING || gameStage === GAME_STAGE.END
                ? "flex"
                : "none",
          }}
          className="absolute z-2   h-full w-full top-0 left-0 items-center justify-center"
        >
          {gameStage === GAME_STAGE.END ? (
            <EndScreen
              roomId={params.roomId}
              standings={standings}
              isRoomAdmin={player?.isRoomAdmin}
              socket={socket}
            />
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
                        {word.word}
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
  isRoomAdmin: boolean | undefined;
  socket: WebSocket | null;
  roomId: string|string[];
};
function EndScreen({ standings, isRoomAdmin, socket, roomId }: EndScreenProps) {
  if (!standings) return;


  function toHome() {
    socket?.send(JSON.stringify({
      type:UPDATE_GAME_STAGE,
      payload:{
        gameStage:GAME_STAGE.LOBBY,
        roomId,
        message:RESTART_GAME
      }
    }))

    
    console.log("gameStage");
    
  }
  return (
    <div>
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
      <div>
        {isRoomAdmin && <button onClick={toHome}>Home</button>}
      </div>
    </div>
  );
}

const generateOptions = () => {
  let timeOptions = [];
  const roundOptions: number[] = [1, 2, 3, 4, 5];
  for (let i = 15; i <= 120; i += 15) {
    timeOptions.push(i);
  }
  return { timeOptions, roundOptions };
};

type GameSettingsProp = {
  isRoomAdmin: boolean | undefined;
  socket: WebSocket | null;
  roomId: string | string[];
  player: Player | undefined;
};
function GameSettings({
  isRoomAdmin,
  socket,
  roomId,
  player,
}: GameSettingsProp) {
  const { timeOptions, roundOptions } = generateOptions();

  const [totalRound, setTotalRound] = useState<number>(roundOptions[0]);
  const [time, setTime] = useState<number>(timeOptions[0]);

  function startGame() {
    if (!socket) return;
    console.log("Start");
    

    socket.send(
      JSON.stringify({
        type: INIT_ROOM,
        payload: {
          roomId,
          format: {
            duration: { time: time },
            rounds: totalRound,
          },
        },
      })
    );
    socket.send(
      JSON.stringify({
        type: START_GAME,
        payload: {
          player,
          roomId,
        },
      })
    );
  }

  const handleField1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTime(Number(event.target.value));
  };

  const handleField2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTotalRound(Number(event.target.value));
  };

  return (
    <div className="flex flex-col gap-4 overflow-auto z-2">
      <div className="flex flex-col items-center justify-center  p-4 bg-gray-100">
        <div className="w-full max-w-xs">
          <label
            htmlFor="field1"
            className="block text-sm font-medium text-gray-700"
          >
            Select Time
          </label>
          <select
            id="field1"
            name="field1"
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={time}
            onChange={handleField1Change}
          >
            {timeOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full max-w-xs mt-4">
          <label
            htmlFor="field2"
            className="block text-sm font-medium text-gray-700"
          >
            Select Rounds
          </label>
          <select
            id="field2"
            name="field2"
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={totalRound}
            onChange={handleField2Change}
          >
            {roundOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>{isRoomAdmin && <button onClick={startGame}>Start</button>}</div>
    </div>
  );
}
