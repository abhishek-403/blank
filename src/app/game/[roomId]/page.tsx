"use client";
import {
  CHOOSE_WORD,
  CLEAR_CANVAS,
  CORRECT_ANSWER,
  DISABLE_INPUT,
  DRAWING_ON_CANVAS,
  ENABLE_INPUT,
  ERROR,
  GAME_CLOCK,
  INIT_CANVAS,
  INIT_GAME,
  INIT_ROOM,
  INIT_USER,
  INTI_CHAT,
  JOIN_ROOM,
  DISPLAY_CHOOSEN_WORD,
  START_GAME,
  STATE_CHANGE,
  UPDATE_CANVAS,
  UPDATE_GAME_STAGE,
  UPDATE_STANDINGS,
  WAIT_CLOCK,
  WRONG_ANSWER,
} from "@/constants";
import { newBoard as board } from "@/components/canvas/Canvas";
import SharedBoardScreen from "@/components/canvas/boardscreen";
import ChatWindow from "@/components/chats/ChatWindow";
import ParticipantsWindow from "@/components/participants/ParticipantsWindow";
import { useSocket } from "@/hooks/useSocket";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import NavBar from "@/components/navbar/NavBar";

export class User {
  public id: string;
  public socket: WebSocket;
  public name: string;

  constructor(name: string, socket: WebSocket, userId: string) {
    this.socket = socket;
    this.id = userId;
    this.name = name;
  }
}
export interface chat {
  user: User;
  message: string;
}
export interface Player {
  user: User;
  points: number;
  rank: number;
  hasGuessedCurLap: boolean;
  isTurnPlayer: boolean;
  isRoomAdmin: boolean;
}
export enum GAME_STAGE {
  LOBBY,
  END,
  ONGOING,
  WAITING,
  NA,
  READY,
}
export interface RoundData {
  totalRounds: number;
  curRound: number;
}

export default function GamePage() {
  const socket = useSocket();
  const params = useParams();
  const router = useRouter();
  const searchparam = useSearchParams();

  const [chats, setChats] = useState<chat[]>([]);
  const [clock, setClock] = useState<number>(0);
  const [player, setPlayer] = useState<Player | undefined>();
  const [standings, setStandings] = useState<Player[]>();
  const [word, setWord] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [gameStage, setGameStage] = useState<GAME_STAGE>(GAME_STAGE.LOBBY);
  const [roundData, setRoundData] = useState<RoundData>({
    totalRounds: 0,
    curRound: 0,
  });
  const [wordList, setWordList] = useState<string[]>([""]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    try {
      if (!isOpen(socket)) return;
      let userId = Math.random().toString(12).substring(2, 9);
      socket.send(
        JSON.stringify({
          type: INIT_USER,
          payload: {
            userId,
            name,
          },
        })
      );
      socket.send(
        JSON.stringify({
          type: JOIN_ROOM,
          payload: {
            roomId: params.roomId,
          },
        })
      );

      addAllListners(socket, params);
      listenSocketMessages(
        socket,
        setChats,
        setClock,
        setStandings,
        setPlayer,
        setError,
        setGameStage,
        setRoundData,
        setWordList,
        setWord
      );
    } catch (e) {}
    return () => {
      removeAllListeners();
    };
  }, [socket]);

  let name = searchparam.get("name");
  useEffect(() => {
    if (!name) {
      let prevId = params.roomId;
      if (!prevId) {
        router.replace("/");
      }
      router.replace(`/?prevId=${prevId}`);
    }
  }, [name]);

  useEffect(() => {
    if (!player) return;
    chats.push({ user: player.user, message: error! });
  }, [error]);

  return (
    <div>
      <div className="flex h-full flex-col gap-2 ">
        <div>
          <NavBar
            roundData={roundData}
            clock={clock}
            word={word}
            player={player}
            gameStage={gameStage}
          />
        </div>
        <div className="flex  overflow-auto w-full h-[100%] gap-10 justify-center">
          <div>
            <ParticipantsWindow standings={standings} />
          </div>
          <div className="relative w-[100%]">
            <SharedBoardScreen
              setWord={setWord}
              gameStage={gameStage}
              wordList={wordList}
              player={player}
              socket={socket}
              standings={standings}
            />
            {/* <input
              type="text"
              value={window?.location.href}
              className="w-full"
              readOnly
            /> */}
          </div>
          <div>
            <ChatWindow socket={socket} chats={chats} player={player} />
          </div>
        </div>
      </div>
    </div>
  );
}

function isOpen(ws: WebSocket) {
  return ws.readyState === ws.OPEN;
}

function listenSocketMessages(
  socket: WebSocket | null,
  setChats: React.Dispatch<SetStateAction<chat[]>>,
  setClock: React.Dispatch<SetStateAction<number>>,
  setStandings: React.Dispatch<SetStateAction<Player[] | undefined>>,
  setPlayer: React.Dispatch<SetStateAction<Player | undefined>>,
  setError: React.Dispatch<SetStateAction<string | undefined>>,
  setGameStage: React.Dispatch<SetStateAction<GAME_STAGE>>,
  setRoundData: React.Dispatch<SetStateAction<RoundData>>,
  setWordList: React.Dispatch<SetStateAction<string[]>>,
  setWord: React.Dispatch<SetStateAction<string>>
) {
  if (!socket) return;
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      //game events

      case INIT_GAME:
        board.updateState(message.payload.updatedState);
        setChats(message.payload.chats);
        setStandings(message.payload.standings);
        break;

      case INIT_USER:
        setPlayer(message.payload.player);
        break;

      case DISABLE_INPUT:
        //@ts-ignore
        setPlayer((prev) => ({ ...prev, hasGuessedCurLap: true }));
        break;
      case ENABLE_INPUT:
        //@ts-ignore
        setPlayer((prev) => ({ ...prev, hasGuessedCurLap: false }));
        break;

      case CORRECT_ANSWER:
        setChats(message.payload.chats);

        break;
      case WRONG_ANSWER:
        setChats(message.payload.chats);
        break;

      case GAME_CLOCK:
        setClock(message.payload.time);
        break;
      case WAIT_CLOCK:
        setClock(message.payload.waitTime);
        break;
      case UPDATE_STANDINGS:
        setStandings(message.payload.standings);
        break;

      case ERROR:
        setError(message.payload.message);
        break;

      case UPDATE_GAME_STAGE:
        setRoundData(message.payload.room);
        setPlayer(message.payload.player);
        setGameStage(message.payload.gameStage);
        break;

      case CHOOSE_WORD:
        setWordList(message.payload.wordList);
        break;
      case DISPLAY_CHOOSEN_WORD:
        setWord(message.payload.word);
        break;

      // canvas

      case DRAWING_ON_CANVAS:
        board.drawingOnBoard(message.payload.drawingStat);
        break;

      case UPDATE_CANVAS:
        board.updateState(message.payload.updatedState);
        break;

      case CLEAR_CANVAS:
        board.clearCanvas();
        break;
    }
  };
}
function addAllListners(socket: WebSocket, params: Params) {
  board.addEventListener(STATE_CHANGE, (e: any) => {
    const state = {
      pencil: board.pencil.paths,
      rects: board.rectangle.rects,
    };

    socket.send(
      JSON.stringify({
        type: STATE_CHANGE,
        payload: {
          state,
          roomId: params.roomId,
        },
      })
    );
  });
  board.addEventListener(DRAWING_ON_CANVAS, (e: any) => {
    const state = {
      pencil: board.pencil.currLine,
      rects: board.rectangle.rects,
    };

    socket.send(
      JSON.stringify({
        type: DRAWING_ON_CANVAS,
        payload: {
          state,
          roomId: params.roomId,
        },
      })
    );
  });
  board.addEventListener(CLEAR_CANVAS, (e: any) => {
    socket.send(
      JSON.stringify({
        type: CLEAR_CANVAS,
        payload: {
          roomId: params.roomId,
        },
      })
    );
  });
}

function removeAllListeners() {
  board.removeEventListener(STATE_CHANGE, () => {});
  board.removeEventListener(CLEAR_CANVAS, () => {});
  board.removeEventListener(DRAWING_ON_CANVAS, () => {});
}
