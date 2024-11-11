"use client";
import Canvas from "@/components/canvas/Canvas";
import {
  INIT_ROOM,
  RESTART_GAME,
  START_GAME,
  UPDATE_GAME_STAGE,
  WORD_CHOOSEN,
} from "@/constants/messages";
import { GAME_STAGE, Player, turnPointsType, word } from "@/constants/types";
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
  turnPoints: turnPointsType[];
};
export default function SharedBoardScreen({
  wordList,
  player,
  socket,
  gameStage,
  standings,
  word,
  myId,
  turnPoints,
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
    <div className=" border-2  bg-white w-full h-fit">
      <div className="relative ">
        <div className="flex flex-col gap-3">
          <Canvas isDisabled={isDisabled} />
        </div>
        <div
          style={{
            display: gameStage === GAME_STAGE.LOBBY ? "flex" : "none",
          }}
          className="absolute z-2 bg-sec top-0 left-0 items-center justify-center w-full h-full  animate-slideDown"
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
          className=" absolute z-2 bg-sec animate-slideDown  h-full w-full top-0 left-0 items-center  justify-center "
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
            <InterLapScreen turnPoints={turnPoints} word={word} />
          ) : (
            <div>
              {player?.isTurnPlayer ? (
                <div className="h-full w-full items-center justify-center flex gap-6">
                  {wordList.map((word, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => wordSelected(i)}
                        className="px-3 py-2 lg:px-4  text-sm lg:text-xl border-[3px]  text-white transition-all rounded-lg cursor-pointer hover:text-opacity-60 font-semibold "
                      >
                        {word.word}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 py-2` lg:px-4 py-2 text-sm lg:text-xl border-[3px] font-semibold text-white rounded-lg">
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
  turnPoints: turnPointsType[];
};
function InterLapScreen({ word, turnPoints }: InterLapScreenProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-2xl  text-white transition-all rounded-lg font-semibold mb-2 border-b border-black">
        The word was <span className="text-blue-300">{word.word}</span>
      </div>
      <div className="flex flex-col gap-2 px-2">
        {turnPoints.map((u, i) => {
          return (
            <div
              key={i}
              className="flex justify-between text-sm lg:text-lg items-center w-full text-white"
            >
              <div>{u.player.user.name}</div>
              <div className="text-green-400 font-bold">+{u.lapPoints}</div>
            </div>
          );
        })}
      </div>
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
  const winner = standings.find((stand) => stand.rank === 1);
  const participants = standings.filter((stand) => stand.rank !== 1);
  return (
    <div className="h-full flex flex-col  ">
      <div className="overflow-y-auto overflow-x-hidden gap-2 flex-col items-center justify-center my-auto  ">
        {winner && (
          <div className="col-span-full mb-3 justify-between  py-1 w-full font-inter ">
            <div className="flex gap-6 border-[2px] rounded border-sky-300  border-b-0 px-4 mx-auto w-fit justify-center items-center text-sky-300 py-2">
              <div className="flex text-md lg:text-xl font-medium">
                #{winner.rank === 0 ? 1 : winner.rank}
              </div>
              <div className="flex items-center flex-col justify-center text-md lg:text-lg">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-md lg:text-2xl">
                    {winner.user.name}
                  </div>
                  <div>{myId === winner.user.id ? "(You)" : ""}</div>
                </div>
                <div className="text-xs">{winner.points} points</div>
              </div>
              <div></div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-between rounded py-1 px-3 gap-y-4 font-inter">
          {participants.map((user, i) => {
            return (
              <div
                key={i}
                className="flex gap-6 border-[2px] py-1 rounded  px-2 mx-auto border-neutral-40 w-fit justify-center items-center text-white   border-b-0 min-w-[180px] max-w-[200px]"
              >
                <div className="flex text-md lg:text-xl font-medium">
                  #{user.rank === 0 ? 1 : user.rank}
                </div>
                <div className="flex items-center flex-col justify-center text-md lg:text-lg">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-md lg:text-xl">
                      {user.user.name}
                    </div>
                    <div className="font-medium text-md lg:text-sm">
                      {myId === user.user.id ? "(You)" : ""}
                    </div>
                  </div>
                  <div className="text-xs">{user.points} points</div>
                </div>
                <div></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative" onClick={toHome}>
        {isRoomAdmin && (
          <div className="px-4 absolute py-2 mt-4 bg-violet-400 w-full text-white font-semibold rounded-md bottom-[3px] text-center">
            <button>Home</button>
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
      <div className="flex flex-col items-center justify-center px-2 py-1 lg:p-4 text-white  border-neutral-20 border-2 rounded-lg w-[150px] lg:w-[260px] shadow-md">
        <div className="w-full">
          <label
            htmlFor="field1"
            className="block font-medium text-white text-sm lg:text-lg "
          >
            Select Time
          </label>
          <select
            id="field1"
            name="field1"
            className="block w-full mt-2 rounded-md text-white border border-neutral-40 bg-sec shadow-sm text-sm lg:text-xl p-1 lg:p-2 "
            value={time}
            disabled={!isRoomAdmin}
            onChange={handleField1Change}
          >
            {timeOptions.map((value) => (
              <option className="text-white bg-sec" key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full max-w-xs mt-4">
          <label
            htmlFor="field2"
            className="block font-medium text-white text-sm lg:text-lg"
          >
            Select Rounds
          </label>
          <select
            id="field2"
            name="field2"
            className="block w-full mt-2 rounded-md  border border-neutral-40 bg-sec shadow-sm text-sm lg:text-xl p-1 lg:p-2"
            value={totalRound}
            disabled={!isRoomAdmin}
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
      {isRoomAdmin && (
        <div
          onClick={startGame}
          className="w-fit cursor-pointer bg-white  py-2 px-6 font-roboto text-sm lg:text-xl rounded-lg mx-auto"
        >
          <button>Start</button>
        </div>
      )}
    </div>
  );
}
