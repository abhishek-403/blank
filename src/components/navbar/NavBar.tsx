import { Player, RoundData } from "@/app/game/[roomId]/page";
import React, { useEffect } from "react";

type Props = { roundData:RoundData,clock: number; word: string; player: Player | undefined };

export default function NavBar({ roundData,clock, word, player }: Props) {
  // console.log("turn ", player?.isTurnPlayer);

  return (
    <div className="flex item-center justify-around border-2">
      <div>
        <div>{clock}</div>
        <div>Round {roundData.curRound} of {roundData.totalRounds}</div>
      </div>
      <div>
        <div>Guess this</div>
        <div>{player?.isTurnPlayer ? word : "_ _ _ _ _"}</div>
      </div>
      <div>setting</div>
    </div>
  );
}
