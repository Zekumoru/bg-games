import { useEffect, useState } from 'react';
import titleCase from '../../utils/titleCase';
import useGame from './hooks/useGame';
import useGameUpdate from './hooks/useGameUpdate';
import LoadingScreen from '../LoadingScreen';
import useStartNewGame from './hooks/useStartNewGame';
import useLocalStorage from '../../hooks/useLocalStorage';

const Game = () => {
  const [gameId, setGameId] = useLocalStorage('gameId');
  const [game, refetch, error, gameFetching] = useGame(gameId);
  const [updateGame, status, _updateError, gameUpdating] = useGameUpdate();
  const [flipped, setFlipped] = useState(false);
  const [startNewGame, isStartingNewGame] = useStartNewGame((gameId) =>
    setGameId(gameId),
  );

  useEffect(() => {
    refetch();
  }, [gameId, refetch]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'f') setFlipped(!flipped);
    };

    document.body.addEventListener('keyup', handleKeyUp);
    return () => document.body.removeEventListener('keyup', handleKeyUp);
  }, [flipped]);

  useEffect(() => {
    if (!status) return;
    if (status.status === 200) refetch();
  }, [status, refetch]);

  const totalCards = game?.cards.length ?? 0;
  const currentPointer = game?.cards.findIndex((card) => !card.guessed) ?? 0;

  const currentCard = game?.cards[currentPointer];
  const gameFinished = currentPointer === -1;

  const handleNextCard = () => {
    if (!game) return;

    const toUpdateGame = structuredClone(game);
    toUpdateGame.cards[currentPointer].guessed = true;
    toUpdateGame.cards[currentPointer].guessedAt = new Date().toUTCString();
    updateGame(toUpdateGame);
  };

  return (
    <div>
      {(gameUpdating || isStartingNewGame) && <LoadingScreen />}

      {/* CARD VIEW */}
      <div
        className={`h-screen transition-colors ${flipped ? 'bg-accent text-accent-content' : 'bg-primary text-primary-content'}`}
      >
        <div className="page-center relative grid h-full place-content-center p-4">
          {gameFetching ? (
            <div>Game is loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : !game ? (
            <div>No game found!</div>
          ) : (
            <>
              {/* CARD CONTENT */}
              <div className="text-8xl">
                {!gameFinished
                  ? titleCase(
                      flipped ? currentCard!.name : currentCard!.shuffled,
                    )
                  : 'Game finished!'}
              </div>

              <div className="absolute bottom-12 left-16 right-16 flex items-center justify-between text-4xl">
                <div>
                  {!gameFinished ? currentPointer + 1 : totalCards} of{' '}
                  {totalCards} cards
                </div>

                {!gameFinished ? (
                  <div className="flex gap-4">
                    <button
                      className="btn btn-ghost h-auto px-8 py-4 text-2xl"
                      onClick={() => setFlipped(!flipped)}
                    >
                      Flip (F)
                    </button>
                    <button
                      className="btn h-auto px-8 py-4 text-2xl"
                      onClick={handleNextCard}
                    >
                      Next (N)
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn h-auto px-8 py-4 text-2xl"
                    onClick={() => startNewGame()}
                  >
                    Start New Game
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* GUESSED LIST VIEW */}
    </div>
  );
};

export default Game;
