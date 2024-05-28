import React from "react";

type Props = {clock:number,word:string};

export default function NavBar({clock,word}: Props) {
  return (
    <div className="flex item-center justify-around border-2">
      <div>
        <div>{clock}</div>
        <div>Round 3 of 4</div>
      </div>
      <div>
        <div>Guess this</div>
        <div>{word}</div>
      </div>
      <div>setting</div>
    </div>
  );
}
