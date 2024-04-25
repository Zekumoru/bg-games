import { useCallback, useEffect, useRef, useState } from 'react';
import titleCase from '../../utils/titleCase';
import useGame from './hooks/useGame';
import useGameUpdate from './hooks/useGameUpdate';
import LoadingScreen from '../LoadingScreen';
import useGameId from './hooks/useGameId';
import shuffle from '../../utils/shuffle';
import GameView from './GameView';
import useGameState from './hooks/useGameState';

const Game = () => {
  const scrollToGameViewARef = useRef<HTMLAnchorElement | null>(null);
  const [gameId, generateNewGame, isGeneratingNewGame, setGameId] = useGameId();
  const [game, refetch, error, gameFetching] = useGame(gameId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateGame, status, _updateError, gameUpdating] = useGameUpdate();
  const [flipped, setFlipped] = useState(false);
  const [nextFlipped, setNextFlipped] = useState(false);
  const gameState = useGameState(game);

  useEffect(() => {
    // refetch if game id changed
    refetch();
  }, [gameId, refetch]);

  useEffect(() => {
    if (!status) return;
    if (status.status === 200) refetch();
  }, [status, refetch]);

  const handleGameFinish = useCallback(() => setGameId(''), [setGameId]);
  const handleViewScroll = useCallback(
    () => scrollToGameViewARef.current?.click(),
    [],
  );

  const handleReshuffleNext = () => {
    if (!game) return;
    if (!gameState.nextCard) return;
    if (gameState.finished) return;

    const toUpdateGame = structuredClone(game);
    const currentPointer = gameState.currentCardPointer;
    const toUpdateNextCard = toUpdateGame.cards[currentPointer + 1];
    toUpdateNextCard.shuffled = shuffle(toUpdateNextCard.name.split('')).join(
      '',
    );
    updateGame(toUpdateGame);
  };

  const finishedCards =
    game?.cards.filter((card) => card.guessedAt !== null) ?? [];

  return (
    <div>
      {(gameUpdating || isGeneratingNewGame) && <LoadingScreen />}

      {/* CARD VIEW */}
      <div
        id="game-view"
        className={`h-screen transition-colors ${flipped ? 'bg-accent text-accent-content' : 'bg-primary text-primary-content'}`}
      >
        <div className="page-center relative grid h-full place-content-center p-4">
          {gameFetching ? (
            <div>Game is loading...</div>
          ) : error && gameId !== '' ? (
            <div>Error: {error.message}</div>
          ) : !game ? (
            <div className="text-8xl">No game found!</div>
          ) : (
            <GameView
              game={game}
              gameState={gameState}
              flipped={flipped}
              onCardFlip={setFlipped}
              onGameFinish={handleGameFinish}
              onStartNewGame={generateNewGame}
              onGameUpdate={updateGame}
              onViewScroll={handleViewScroll}
            />
          )}
        </div>
      </div>

      {/* GUESSED LIST VIEW */}
      <div className="page-center min-h-screen p-4">
        <div className="flex items-center gap-2">
          <a
            ref={scrollToGameViewARef}
            href="#game-view"
            className="link link-primary"
          >
            Scroll to game view
          </a>
          <kbd className="kbd kbd-sm text-primary">S</kbd>
        </div>
        <div className="flex justify-between ">
          <div>
            <div className="my-4 text-4xl">Finished Cards</div>
            <ul className="flex flex-col gap-2">
              {finishedCards.length === 0 ? (
                <div className="text-2xl">
                  You haven't guessed any cards yet.
                </div>
              ) : (
                finishedCards.map((card, index) => (
                  <li
                    className="flex items-center gap-2 text-2xl"
                    key={card.name}
                  >
                    <div>{index + 1}</div>
                    <div>
                      {card.name} ({card.shuffled})
                    </div>
                    {card.guessed ? (
                      <div className="badge badge-success badge-outline">
                        Guessed
                      </div>
                    ) : (
                      <div className="badge badge-error badge-outline">
                        Failed
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <div className="mb-4 min-w-96 text-4xl">Up Next</div>
            <div className="my-2 text-3xl">
              {!gameState.finished && gameState.nextCard
                ? titleCase(
                    nextFlipped
                      ? gameState.nextCard.name
                      : gameState.nextCard.shuffled,
                  )
                : 'All done!'}
            </div>
            {!gameState.finished && gameState.nextCard && (
              <div className="flex flex-col items-start gap-2">
                <button
                  className="btn btn-accent"
                  onClick={() => setNextFlipped(!nextFlipped)}
                >
                  {nextFlipped ? 'Hide' : 'Show'}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleReshuffleNext()}
                >
                  Reshuffle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
