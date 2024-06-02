import { GAME_STAGE, Player, RoundData, word } from "@/app/game/[roomId]/page";
import React from "react";

type Props = {
  roundData: RoundData;
  clock: number;
  word: word;
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
  // console.log(word);

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
            word.word
          ) : (
            <div>
              {gameStage === GAME_STAGE.WAITING ||
              gameStage === GAME_STAGE.END ? (
                <div>{word.word}</div>
              ) : (
                <div className="flex gap-2">_ _ _ _</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div>setting</div>
    </div>
  );
}
