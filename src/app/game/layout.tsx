import React from "react";

type Props = {
  children: React.ReactNode;
};

import bgImg from "@/components/assets/background.png";
export default function layout({ children }: Props) {
  return (
    <div>
      <div
        className="flex border-2 border-black overflow-auto w-[1440px] px-2 lg:px-20 h-[100vh] gap-1 lg:gap-4 justify-center"
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundRepeat: "repeat",
          width: "100%",
          backgroundPosition: "center",
        }}
      >
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
