import React from "react";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <div className="flex item-center justify-around border-2">
      <div>
        <div>clock</div>
        <div>Round 3 of 4</div>
      </div>
      <div>
        <div>Guess this</div>
        <div>_______</div>
      </div>
      <div>setting</div>
    </div>
  );
}
