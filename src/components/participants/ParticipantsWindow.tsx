import { EachUser, Player } from "@/constants/types";

type Props = { standings: Player[] | undefined };

export default function ParticipantsWindow({ standings }: Props) {
  return (
    <div className="flex flex-col w-[200px]">
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
      className="flex font-roboto justify-between border border-[#121212] w-full py-1 px-3"
      style={{ backgroundColor: hasGuessedCurLap ? "#4ade80" : "white" }}
    >
      <div className="flex text-2xl font-medium">#{rank == 0 ? 1 : rank}</div>
      <div className="flex items-center flex-col justify-center text-lg">
        <div className="font-medium ">{name}</div>
        <div>{points} points</div>
      </div>
      <div></div>
    </div>
  );
}
