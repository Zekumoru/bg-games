import useLocalStorage from '../../hooks/useLocalStorage';
import titleCase from '../../utils/titleCase';
import useGame from './hooks/useGame';

const Game = () => {
  const [gameId] = useLocalStorage('gameId');
  const [game, refetch, error, gameFetching] = useGame(gameId);

  if (gameFetching) {
    return <>Game is loading...</>;
  }

  if (error) {
    return <>Error: {error.message}</>;
  }

  if (!game) {
    return <>No game found!</>;
  }

  const totalCards = game.cards.length ?? 0;
  const currentPointer = game.cards.findIndex((card) => !card.guessed);

  const currentCard = game.cards[currentPointer];

  return (
    <div>
      {/* CARD VIEW */}
      <div className="h-screen bg-primary text-primary-content">
        <div className="page-center relative grid h-full place-content-center p-4">
          {/* CARD CONTENT */}
          <div className="text-8xl">{titleCase(currentCard.shuffled)}</div>

          <div className="absolute bottom-12 left-16 right-16 flex items-center justify-between text-4xl">
            <div>
              {currentPointer + 1} of {totalCards} cards
            </div>
            <div className="flex gap-4">
              <button className="btn btn-ghost h-auto px-8 py-4 text-2xl">
                Flip
              </button>
              <button className="btn h-auto px-8 py-4 text-2xl">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* GUESSED LIST VIEW */}
    </div>
  );
};

export default Game;
