import { useCallback, useEffect, useRef, useState } from 'react';
import titleCase from '../../utils/titleCase';
import useGame from './hooks/useGame';
import useGameUpdate from './hooks/useGameUpdate';
import LoadingScreen from '../LoadingScreen';
import useStartNewGame from './hooks/useStartNewGame';
import useLocalStorage from '../../hooks/useLocalStorage';
import shuffle from '../../utils/shuffle';
import useSound from 'use-sound';
import drumRoll from '../../assets/drum-roll.mp3';
import fanfare from '../../assets/fanfare.mp3';
import RandomWordShuffling from './RandomWordShuffling';

const Game = () => {
  const scrollToGameViewARef = useRef<HTMLAnchorElement | null>(null);
  const [gameId, setGameId] = useLocalStorage('gameId');
  const [game, refetch, error, gameFetching] = useGame(gameId);
  const [updateGame, status, _updateError, gameUpdating] = useGameUpdate();
  const [flipped, setFlipped] = useState(false);
  const [nextFlipped, setNextFlipped] = useState(false);
  const [startNewGame, isStartingNewGame] = useStartNewGame((gameId) =>
    setGameId(gameId),
  );
  const [currentPointer, setCurrentPointer] = useState(-2);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [playFanfare] = useSound(fanfare);
  const [playDrumRoll] = useSound(drumRoll, {
    onend: () => {
      setIsPlayingSound(false);
    },
  });

  useEffect(() => {
    refetch();
  }, [gameId, refetch]);

  useEffect(() => {
    if (!status) return;
    if (status.status === 200) refetch();
  }, [status, refetch]);

  const totalCards = game?.cards.length ?? 0;
  useEffect(() => {
    if (!game) return;
    setCurrentPointer(game.cards.findIndex((card) => card.guessedAt === null));
  }, [game]);

  useEffect(() => {
    // -1 means finished game
    if (currentPointer === -1) {
      playFanfare();
      setGameId('');
      return;
    }
    if (currentPointer < 0) return;

    setIsPlayingSound(true);
    playDrumRoll();
  }, [playDrumRoll, playFanfare, currentPointer, setGameId]);

  const currentCard = game?.cards[currentPointer];
  const nextCard = game?.cards[currentPointer + 1];
  const gameFinished = currentPointer === -1;

  const handleNextCard = useCallback(
    (guessed: boolean) => {
      if (!game) return;

      const toUpdateGame = structuredClone(game);
      toUpdateGame.cards[currentPointer].guessed = guessed;
      toUpdateGame.cards[currentPointer].guessedAt = new Date().toUTCString();
      updateGame(toUpdateGame);
    },
    [game, currentPointer, updateGame],
  );

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 's') scrollToGameViewARef.current?.click();

      if (game?.cards.findIndex((card) => card.guessedAt === null) === -1)
        return; // if game finished, do nothing

      if (isPlayingSound) return;

      if (e.key === 'f') setFlipped(!flipped);
      if (e.key === 'a') handleNextCard(false);
      if (e.key === 'g') handleNextCard(true);
    };

    document.body.addEventListener('keyup', handleKeyUp);
    return () => document.body.removeEventListener('keyup', handleKeyUp);
  }, [game, flipped, handleNextCard, isPlayingSound]);

  const handleReshuffleNext = () => {
    if (!game) return;
    if (!nextCard) return;
    if (gameFinished) return;

    const toUpdateGame = structuredClone(game);
    const toUpdateNextCard = toUpdateGame.cards[currentPointer + 1];
    toUpdateNextCard.shuffled = shuffle(toUpdateNextCard.name.split('')).join(
      '',
    );
    updateGame(toUpdateGame);
  };

  return (
    <div>
      {(gameUpdating || isStartingNewGame) && <LoadingScreen />}

      {/* CARD VIEW */}
      <div
        id="game-view"
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
                {gameFinished ? (
                  'Game finished!'
                ) : isPlayingSound ? (
                  <RandomWordShuffling
                    words={game.cards.map((card) => card.name)}
                    paused={!isPlayingSound}
                    wordsPerMs={10}
                  />
                ) : (
                  currentCard &&
                  titleCase(flipped ? currentCard.name : currentCard.shuffled)
                )}
              </div>

              {gameFinished && (
                <div className="my-4 text-center text-2xl">
                  You've correctly guessed{' '}
                  {game.cards.reduce((count, card) => {
                    if (card.guessed) return count + 1;
                    return count;
                  }, 0)}{' '}
                  out of {totalCards} cards!
                </div>
              )}

              <div className="absolute bottom-12 left-16 right-16 flex items-center justify-between text-4xl">
                <div>
                  {!gameFinished ? currentPointer + 1 : totalCards} of{' '}
                  {totalCards} cards
                </div>

                {!gameFinished ? (
                  <div className="flex gap-4">
                    <button
                      className={`btn btn-ghost h-auto px-8 py-4 text-2xl ${isPlayingSound ? 'btn-disabled' : ''}`}
                      disabled={isPlayingSound}
                      onClick={() => setFlipped(!flipped)}
                    >
                      Flip (F)
                    </button>
                    <button
                      className={`btn btn-error h-auto px-8 py-4 text-2xl ${isPlayingSound ? 'btn-disabled' : ''}`}
                      disabled={isPlayingSound}
                      onClick={() => handleNextCard(false)}
                    >
                      Fail (A)
                    </button>
                    <button
                      className={`btn btn-success h-auto px-8 py-4 text-2xl ${isPlayingSound ? 'btn-disabled' : ''}`}
                      disabled={isPlayingSound}
                      onClick={() => handleNextCard(true)}
                    >
                      Guess (G)
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
              {game &&
                game.cards
                  .filter((card) => card.guessedAt !== null)
                  .map((card, index) => (
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
                  ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 min-w-96 text-4xl">Up Next</div>
            <div className="my-2 text-3xl">
              {!gameFinished && nextCard
                ? titleCase(nextFlipped ? nextCard.name : nextCard.shuffled)
                : 'All done!'}
            </div>
            {!gameFinished && nextCard && (
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
