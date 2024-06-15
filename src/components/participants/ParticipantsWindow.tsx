import { EachUser, Player } from "@/constants/types";

type Props = {
  standings: Player[] | undefined;
  myId: string;
  player: Player | undefined;
};

export default function ParticipantsWindow({ standings, myId, player }: Props) {
  return (
    <div className="flex flex-col w-[200px]">
      {standings?.map((u, i) => {
        let user = {
          name: u.user.name,
          rank: u.rank,
          hasGuessedCurLap: u.hasGuessedCurLap,
          points: u.points,
          isMe: myId === u.user.id,
          isDrawing: player?.isTurnPlayer,
        };

        return <User key={i} {...user} />;
      })}
    </div>
  );
}

function User({
  name,
  points,
  rank,
  hasGuessedCurLap,
  isMe,
  isDrawing,
}: EachUser) {
  return (
    <div
      className="flex font-roboto justify-between border border-[#121212] w-full py-1 px-3"
      style={{ backgroundColor: hasGuessedCurLap ? "#4ade80" : "white" }}
    >
      <div className="flex text-2xl font-medium">#{rank == 0 ? 1 : rank}</div>
      <div className="flex items-center flex-col justify-center text-lg">
        <div className=" flex gap-1 items-center">
          <div className="font-medium ">{name}</div>
          <div className="text-md">{isMe ? "(You)" : ""}</div>
        </div>
        <div>{points} points</div>
      </div>
      <div>{isDrawing===true && isMe  ? "d" : ""}</div>
    </div>
  );
}
