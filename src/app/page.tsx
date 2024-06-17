"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import bgImg from "../components/assets/background.png";
function Home() {
  const router = useRouter();
  const searchparams = useSearchParams();
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string | null>("");
  const [create, setCreate] = useState<boolean>(true);

  async function createRoom() {
    try {
      if (!name) return;

      const data = await axios.post(
        `${process.env.SERVER_BASE_URL}/createroom`
      );

      const res = data.data;
      router.push(`/game/${res.roomId}/?name=${name}`);
    } catch (e) {
      console.log(e);
    }
  }
  async function joinRoom() {
    if (!name || !roomId) return;

    // if (roomId.includes("http")) {
    //   router.replace(roomId);
    // } else {
    // }
    router.push(`/game/${roomId}/?name=${name}`);
  }

  useEffect(() => {
    if (searchparams.get("prevId")) {
      setCreate(false);
      setRoomId(searchparams.get("prevId"));
    }
  }, [searchparams]);

  return (
    <div
      style={{
        backgroundImage: `url(${bgImg.src})`,
        backgroundRepeat: "repeat",
        width: "100%",
        backgroundPosition: "center",
      }}
      className="w-full h-[100vh]  items-center justify-center flex  "
    >
      <div className="flex flex-col border-2 p-6 gap-4 rounded-lg bg-black border-[#5b5b5b] w-[350px]">
        <div>
          <input
            type="text"
            className="border-2 w-full rounded text-lg p-2 mb-4"
            value={name}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                create ? createRoom() : joinRoom();
              }
            }}
            placeholder={create ? "Nick name" : "Nick name"}
            onChange={(e) => {
              if (e.target.value.length <= 14) setName(e.target.value);
            }}
          />
          {/* <input
        type="text"
        className="border-2"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        /> */}
        </div>
        <div className="w-full">
          {/* <button
              type="submit"
              className="bg-violet-500 p-2 w-full rounded-md text-xl  text-white  font-medium"
              onClick={createRoom}
            >
              Create room
            </button> */}
          {create ? (
            <button
              type="submit"
              className="bg-violet-500 p-2 w-full rounded-md text-xl  text-white  font-medium"
              onClick={createRoom}
            >
              Create room
            </button>
          ) : (
            <button
              type="submit"
              className="bg-violet-500 p-2 w-full rounded-md text-xl  text-white  font-medium"
              onClick={joinRoom}
            >
              Join room
            </button>
          )}
        </div>
        {/* <div className="w-full">
          {create ? (
            <button
              type="submit"
              className="bg-[#212121] p-2 w-full rounded-md text-xl  text-white "
              onClick={() => setCreate(false)}
            >
              Change to Join room
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#212121] p-2 w-full rounded-md text-xl  text-white "
              onClick={() => setCreate(true)}
            >
              Change to Create room
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
