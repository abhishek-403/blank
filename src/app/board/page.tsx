import Canvas from "@/components/canvas/Canvas";
import ChatWindow from "@/components/chats/ChatWindow";
import ParticipantsWindow from "@/components/participants/ParticipantsWindow";

type Props = {};

export default function BoardScreen({}: Props) {
  return (
    <div className="flex ">
      <ParticipantsWindow />
      <Canvas />

      <ChatWindow />
    </div>
  );
}
