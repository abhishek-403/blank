import { GAME_STAGE, Player, RoundData } from "@/app/game/[roomId]/page";
import React from "react";

type Props = {
  roundData: RoundData;
  clock: number;
  word: string;
  player: Player | undefined;
  gameStage: GAME_STAGE;
};

export default function NavBar({
  roundData,
  clock,
  word,
  player,
  gameStage,
}: Props) {

  let w = new Array(word.length)
  return (
    <div className="flex item-center justify-around border-2">
      <div>
        <div>{clock}</div>
        <div>
          Round {roundData.curRound} of {roundData.totalRounds}
        </div>
      </div>
      <div>
        <div>Guess this</div>
        <div>
          {player?.isTurnPlayer ? (
            word
          ) : (
            <div>
              {gameStage === GAME_STAGE.WAITING ||
              gameStage === GAME_STAGE.END ? (
                <div>{word}</div>
              ) : (
                <div className="flex gap-2">
                  _ _ _ _
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div>setting</div>
    </div>
  );
}
