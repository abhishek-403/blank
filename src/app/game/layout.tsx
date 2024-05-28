import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <div>
      <div className="flex border-2 border-black overflow-auto w-full h-full gap-10 justify-center">
       
        <div>{children}</div>
      </div>
    </div>
  );
}
