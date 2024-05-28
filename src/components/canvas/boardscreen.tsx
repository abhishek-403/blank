"use client";
import Canvas from "@/components/canvas/Canvas";
import { useRouter } from "next/navigation";

type Props = { socket: WebSocket | null };

export default function SharedBoardScreen({ socket }: Props) {
  const router = useRouter();

  return (
    <div className="m-4 border-2 border-red-300">
      <button onClick={() => router.push("/")}>back</button>
      <div className="p-4 border-2 border-black">Room page</div>
      <Canvas socket={socket} />
    </div>
  );
}
