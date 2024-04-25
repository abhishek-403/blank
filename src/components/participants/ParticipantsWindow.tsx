import React from "react";

type Props = {};
type User = {
  name: string;
  points: number;
  rank: number;
}[];
type EachUser = {
  name: string;
  points: number;
  rank: number;
};

const users: User = [
  {
    name: "Abhishek",
    points: 100,
    rank: 1,
  },
  {
    name: "Abhishek",
    points: 100,
    rank: 1,
  },
  {
    name: "Abhishek",
    points: 100,
    rank: 1,
  },
];
export default function ParticipantsWindow({}: Props) {
  return (
    <div>
      {users.map((user: EachUser) => (
        <User {...user} />
      ))}
    </div>
  );
}

function User({ name, points, rank }: EachUser) {
  return (
    <div className="flex gap-2 justify-center ">
      <div className="flex justify-center item-center">{rank}</div>
      <div className="flex items-center flex-col justify-center">
        <div>{name}</div>
        <div>{points}</div>
      </div>
    </div>
  );
}
