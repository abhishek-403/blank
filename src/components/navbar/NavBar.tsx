import { GAME_STAGE, Player, RoundData, word } from "@/constants/types";

type Props = {
  roundData: RoundData;
  clock: number;
  word: word;
  player: Player | undefined;
  gameStage: GAME_STAGE;
};

export default function NavBar({
  roundData,
  clock,
  word,
  player,
  gameStage,
}: Props) {
  let a = new Array(word.wordLength).fill(0);

  return (
    <div className="flex items-center w-[100%] justify-between border bg-black text-white px-6 py-2 rounded-md font-domine">
      <div className="flex flex-col items-center w-[70px]">
        <div className="text-2xl">{clock}</div>
      </div>
      <div className="flex flex-col items-center text-xl">
        <div className="font-medium">Guess this</div>
        <div className="font-semibold font-roboto ">
          {player?.isTurnPlayer ? (
            word.word
          ) : (
            <div>
              {gameStage === GAME_STAGE.INTERLAP ||
              gameStage === GAME_STAGE.END ||
              player?.hasGuessedCurLap ? (
                <div>{word.word}</div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex gap-1">
                    {a.map((_t, i) => {
                      return <span key={i}>_</span>;
                    })}
                  </div>
                  <p className="text-sm">{word.wordLength}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center text-lg">
        <div className="font-bold">
          {roundData.curRound} of {roundData.totalRounds}
        </div>
        <div>Round</div>
      </div>
    </div>
  );
}
