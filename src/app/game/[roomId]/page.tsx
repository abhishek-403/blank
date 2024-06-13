"use client";
import { newBoard as board } from "@/components/canvas/Canvas";
import SharedBoardScreen from "@/components/canvas/boardscreen";
import ChatWindow from "@/components/chats/ChatWindow";
import NavBar from "@/components/navbar/NavBar";
import ParticipantsWindow from "@/components/participants/ParticipantsWindow";
import {
  CHOOSE_WORD,
  CLEAR_CANVAS,
  CORRECT_ANSWER,
  DISABLE_INPUT,
  DISPLAY_CHOOSEN_WORD_TO_ALL,
  DRAWING_ON_CANVAS,
  ENABLE_INPUT,
  ERROR,
  GAME_CLOCK,
  GENERAL_CLOCK,
  INIT_GAME,
  INIT_USER,
  JOIN_ROOM,
  STATE_CHANGE,
  UPDATE_CANVAS,
  UPDATE_GAME_STAGE,
  UPDATE_STANDINGS,
  WAIT_CLOCK,
  WORD_CHOOSEN_ACK,
  WRONG_ANSWER,
} from "@/constants/messages";
import { GAME_STAGE, Player, RoundData, chat, word } from "@/constants/types";
import { useSocket } from "@/hooks/useSocket";
import CryptoJS from "crypto-js";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";

export default function GamePage() {
  const socket = useSocket();
  const params = useParams();
  const router = useRouter();
  const searchparam = useSearchParams();

  const [chats, setChats] = useState<chat[]>([]);
  const [clock, setClock] = useState<number>(0);
  const [player, setPlayer] = useState<Player | undefined>();
  const [standings, setStandings] = useState<Player[]>();
  const [word, setWord] = useState<word>({ word: "", wordLength: 0 });
  const [error, setError] = useState<string | undefined>();
  const [gameStage, setGameStage] = useState<GAME_STAGE>(GAME_STAGE.LOBBY);
  const [roundData, setRoundData] = useState<RoundData>({
    totalRounds: 0,
    curRound: 0,
  });
  const [wordList, setWordList] = useState<word[]>([
    { word: "", wordLength: 0 },
  ]);

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

  return (
    <div className="flex  flex-col gap-1 ">
      <div>
        <NavBar
          roundData={roundData}
          clock={clock}
          word={word}
          player={player}
          gameStage={gameStage}
        />
      </div>
      <div className="flex  overflow-auto w-full h-[100%] gap-1 justify-center">
        <div>
          <ParticipantsWindow standings={standings} />
        </div>
        <div className="relative w-[100%]">
          <SharedBoardScreen
            word={word}
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
  setWordList: React.Dispatch<SetStateAction<word[]>>,
  setWord: React.Dispatch<SetStateAction<word>>
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

      case GENERAL_CLOCK:
        setClock(message.payload.clockTime);
        break;

      case UPDATE_STANDINGS:
        setStandings(message.payload.standings);
        break;

      case ERROR:
        setChats(message.payload.chats);
        break;

      case UPDATE_GAME_STAGE:
        setRoundData(message.payload.room);
        setPlayer(message.payload.player);
        setGameStage(message.payload.gameStage);
        break;

      case CHOOSE_WORD:
        let encryWord = message.payload.wordList;
        const decryptedArray = encryWord.map((obj: word) => {
          const bytes = CryptoJS.AES.decrypt(
            obj.word,
            process.env.CRYPTO_SECRET_KEY!
          );

          return {
            word: bytes.toString(CryptoJS.enc.Utf8),
            wordLength: obj.wordLength,
          };
        });
        setWordList(decryptedArray);
        break;

      case DISPLAY_CHOOSEN_WORD_TO_ALL:
        setWord({
          word: message.payload.word,
          wordLength: message.payload.wordLength,
        });
        break;

      case WORD_CHOOSEN_ACK:
        var bytes = CryptoJS.AES.decrypt(
          message.payload.word,
          process.env.CRYPTO_SECRET_KEY!
        );
        var wordChoosen = bytes.toString(CryptoJS.enc.Utf8);
        setWord({
          word: wordChoosen,
          wordLength: message.payload.wordLength,
        });
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
      fill: board.paths.fill,
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
      fill: board.paths.fill,
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
