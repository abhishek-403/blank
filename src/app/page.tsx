"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const searchparams = useSearchParams();
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string | null>("");
  const [create, setCreate] = useState<boolean>(true);

  async function createRoom() {
    if (!name) return;

    const data = await axios.post("http://localhost:3001/createroom");

    const res = data.data;
    router.replace(`/game/${res.roomId}/?name=${name}`);
  }
  async function joinRoom() {
    if (!name || !roomId) return;

    if (roomId.includes("http")) {
      router.replace(roomId);
    } else {
      router.replace(`/game/${roomId}/?name=${name}`);
    }
  }

  useEffect(() => {
    if (searchparams.get("prevId")) {
      setCreate(false);
      setRoomId(searchparams.get("prevId"));
    }
  }, [searchparams]);

  return (
    <div className="w-full h-[300px] items-center justify-center flex flex-col gap-4">
      <input
        type="text"
        className="border-2"
        value={name}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            create ? createRoom() : joinRoom();
          }
        }}
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      {/* <input
        type="text"
        className="border-2"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      /> */}

      {create ? (
        <button type="submit" onClick={createRoom}>
          Create room
        </button>
      ) : (
        <button type="submit" onClick={joinRoom}>
          Join room
        </button>
      )}
      {create ? (
        <button type="submit" onClick={() => setCreate(false)}>
          Change to Join room
        </button>
      ) : (
        <button type="submit" onClick={() => setCreate(true)}>
          Change to Create room
        </button>
      )}
    </div>
  );
}
