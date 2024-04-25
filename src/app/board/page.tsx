import Canvas from "@/components/canvas/Canvas";
import ChatWindow from "@/components/chats/ChatWindow";
import ParticipantsWindow from "@/components/participants/ParticipantsWindow";

type Props = {};

export default function BoardScreen({}: Props) {
  return (
    <div className="flex border-2 border-black overflow-auto w-full h-full gap-10 justify-center">
      <div>
        <ParticipantsWindow />
      </div>
      <div>
        <Canvas />
      </div>
      <div>
        <ChatWindow />
      </div>
    </div>
  );
}
