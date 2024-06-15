"use client";
import Canvas from "@/components/canvas/Canvas";
import {
  INIT_ROOM,
  RESTART_GAME,
  START_GAME,
  UPDATE_GAME_STAGE,
  WORD_CHOOSEN,
} from "@/constants/messages";
import { GAME_STAGE, Player, word } from "@/constants/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
type Props = {
  wordList: word[];
  player: Player | undefined;
  socket: WebSocket | null;
  gameStage: GAME_STAGE;
  standings: Player[] | undefined;
  word: word;
  myId: string;
};
export default function SharedBoardScreen({
  wordList,
  player,
  socket,
  gameStage,
  standings,
  word,
  myId,
}: Props) {
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

    let choosenword = CryptoJS.AES.encrypt(
      wordList[i].word,
      process.env.CRYPTO_SECRET_KEY!
    ).toString();
    socket.send(
      JSON.stringify({
        type: WORD_CHOOSEN,
        payload: {
          word: choosenword,
          roomId: params.roomId,
        },
      })
    );
  }

  return (
    <div className="m-2 border-2  bg-white w-full h-fit">
      {/* <button onClick={() => router.push("/")}>back</button> */}
      <div className="relative ">
        <Canvas isDisabled={isDisabled} />
        <div
          style={{
            display:
              player?.isRoomAdmin && gameStage === GAME_STAGE.LOBBY
                ? "flex"
                : "none",
          }}
          className="absolute z-2  bg-[#615b5b] top-0 left-0 items-center justify-center w-full h-full  animate-slideDown"
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
              gameStage === GAME_STAGE.INTERLAP ||
              gameStage === GAME_STAGE.WAITING ||
              gameStage === GAME_STAGE.END
                ? "flex"
                : "none",
          }}
          className=" absolute z-2 bg-[#615b5b] animate-slideDown  h-full w-full top-0 left-0 items-center  justify-center "
        >
          {gameStage === GAME_STAGE.END ? (
            <EndScreen
              roomId={params.roomId}
              standings={standings}
              isRoomAdmin={player?.isRoomAdmin}
              socket={socket}
              myId={myId}
            />
          ) : gameStage === GAME_STAGE.INTERLAP ? (
            <InterLapScreen word={word} />
          ) : (
            <div>
              {player?.isTurnPlayer ? (
                <div className="   h-full w-full items-center justify-center flex gap-4">
                  {wordList.map((word, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => wordSelected(i)}
                        className="p-4 border-2 text-black rounded-md bg-white text-xl cursor-pointer hover:bg-zinc-100 "
                      >
                        {word.word}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-xl bg-white rounded-lg">
                  waiting...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type InterLapScreenProps = {
  word: word;
};
function InterLapScreen({ word }: InterLapScreenProps) {
  return (
    <div className="text-black bg-white p-4 text-xl font-domine rounded-lg">
      The word was {word.word}
    </div>
  );
}

type EndScreenProps = {
  standings: Player[] | undefined;
  isRoomAdmin: boolean | undefined;
  socket: WebSocket | null;
  roomId: string | string[];
  myId: string;
};
function EndScreen({
  standings,
  isRoomAdmin,
  socket,
  roomId,
  myId,
}: EndScreenProps) {
  if (!standings) return;

  function toHome() {
    socket?.send(
      JSON.stringify({
        type: UPDATE_GAME_STAGE,
        payload: {
          gameStage: GAME_STAGE.LOBBY,
          roomId,
          message: RESTART_GAME,
        },
      })
    );
  }
  return (
    <div className="h-full flex flex-col ">
      <div className="overflow-auto flex gap-1 flex-col items-center justify-center  h-[100%] ">
        {standings.map((user, i) => {
          return (
            <div
              key={i}
              className="flex font-roboto justify-between  border bg-white rounded-lg   py-1 px-3 w-[200px] "
            >
              <div className="flex text-2xl font-medium">
                #{user.rank == 0 ? 1 : user.rank}
              </div>
              <div className="flex items-center flex-col justify-center text-lg">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-2xl">{user.user.name}</div>
                  <div>{myId === user.user.id ? "(You)" : ""}</div>
                </div>
                <div>{user.points} points</div>
              </div>
              <div></div>
            </div>
          );
        })}
      </div>
      <div className="relative  ">
        {isRoomAdmin && (
          <div className="px-4 absolute py-2 mt-4 bg-violet-400 w-full text-white  rounded-md bottom-[3px] text-center">
            {<button onClick={toHome}>Home</button>}
          </div>
        )}
      </div>
    </div>
  );
}

const generateOptions = () => {
  let timeOptions = [];
  const roundOptions: number[] = [1, 2, 3, 4, 5];
  for (let i = 15; i <= 120; i += i) {
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
    <div className="flex flex-col gap-4 overflow-auto z-2 w-fit">
      <div className="flex flex-col items-center justify-center  p-4 bg-gray-100 rounded-lg w-[260px] shadow-xl">
        <div className="w-full">
          <label
            htmlFor="field1"
            className="block font-medium text-gray-700 text-lg "
          >
            Select Time
          </label>
          <select
            id="field1"
            name="field1"
            className="block w-full mt-2 rounded-md border-black shadow-sm text-xl p-2 "
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
            className="block font-medium text-gray-700 text-lg"
          >
            Select Rounds
          </label>
          <select
            id="field2"
            name="field2"
            className="block w-full mt-2 rounded-md border-black shadow-sm text-xl p-2"
            value={totalRound}
            onChange={handleField2Change}
          >
            {roundOptions.map((value) => (
              <option className="" key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-fit bg-white  py-2 px-6 font-roboto text-xl rounded-lg mx-auto">
        {isRoomAdmin && <button onClick={startGame}>Start</button>}
      </div>
    </div>
  );
}
