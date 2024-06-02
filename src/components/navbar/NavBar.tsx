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
    <div className="flex item-center justify-around border-2">
      <div>
        <div>{clock}</div>
        <div>
          Round {roundData.curRound} of {roundData.totalRounds}
        </div>
      </div>
      <div>
        <div>Guess this</div>
        <div>
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
      <div>setting</div>
    </div>
  );
}
