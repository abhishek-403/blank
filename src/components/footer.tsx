import React from "react";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="text-neutral-30 bg-neutral-100 bg-opacity-40 text-sm py-1 absolute bottom-0 font-semibold w-full font-inter flex items-center justify-center ">
      <div className="">
        Developed by 💖
        <a
          className="underline font-semibold ml-1 text-blue-400"
          href="https://abhishek404.netlify.app"
          target="_blank"
        >
          Abhishek Sharma
        </a>
      </div>
    </footer>
  );
}
5;
