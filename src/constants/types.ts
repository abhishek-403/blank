import { FillProps } from "@/board";

export type User = {
  id: string;
  socket: WebSocket;
  name: string;
};

export interface chat {
  user: User;
  message: string;
  messageType: MESSAGE_TYPES;
}
export enum MESSAGE_TYPES {
  HASGUESSED,
  NORMAL,
  ERROR,
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
  INTERLAP,
}

export interface RoundData {
  totalRounds: number;
  curRound: number;
}
export type word = {
  word: string;
  wordLength: number;
};
export type turnPointsType = { player: Player; lapPoints: number };

export type EachUser = {
  name: string;
  points: number;
  rank: number;
  hasGuessedCurLap: boolean;
  isMe: boolean;
  isDrawing: boolean | undefined;
};

export type CanvasState = {
  pencil: Pos[][];
  fill: FillProps[];
};
export interface Pos {
  x: number;
  y: number;
}
export interface RectangleProps {
  pos: Pos;
  width: number;
  height: number;
}
