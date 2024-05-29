import { Player } from "@/app/game/[roomId]/page";
import React from "react";

type Props = { standings: Player[] | undefined };
type User = {
  name: string;
  points: number;
  rank: number;
}[];
type EachUser = {
  name: string;
  points: number;
  rank: number;
  hasGuessedCurLap: boolean;
};


export default function ParticipantsWindow({ standings }: Props) {
  return (
    <div>
      {standings?.map((u, i) => {
        let user = {
          name: u.user.name,
          rank: u.rank,
          hasGuessedCurLap: u.hasGuessedCurLap,
          points: u.points,
        };

        return <User key={i} {...user} />;
      })}
    </div>
  );
}

function User({ name, points, rank, hasGuessedCurLap }: EachUser) {
  return (
    <div
      className="flex gap-2 justify-center border-2 "
      style={{ backgroundColor: hasGuessedCurLap ? "yellow" : "white" }}
    >
      <div className="flex justify-center item-center text-lg">#{rank==0?1:rank}</div>
      <div className="flex items-center flex-col justify-center">
        <div>{name}</div>
        <div>{points}</div>
      </div>
    </div>
  );
}
