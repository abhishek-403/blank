"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  async function createRoom() {
    if (!name) return;
    
    const data = await axios.post("http://localhost:3001/createroom", {
      format: { rounds: 3, duration: {time:10}, maxParticipants: 5 },
    });

    const res = data.data;
    router.replace(`/game/${res.roomId}`);
  }

  return (
    <div>
      <input
        type="text"
        className="border-2"
        value={name}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            createRoom();
          }
        }}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="border-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={createRoom}>game</button>
    </div>
  );
}
