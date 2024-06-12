import React from "react";

type Props = {
  children: React.ReactNode;
};

import bgImg from "@/components/assets/background.png";
export default function layout({ children }: Props) {
  return (
    <div>
      <div
        className="flex border-2 border-black overflow-auto w-full h-[100vh] gap-10 justify-center"
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundRepeat: "repeat",
          width: "100%",
          backgroundPosition: "center",
        }}
      >
        <div className="  mt-2">{children}</div>
      </div>
    </div>
  );
}
