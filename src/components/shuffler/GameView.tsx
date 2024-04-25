import { useCallback, useEffect, useState } from 'react';
import Game from './types/game';
import { GameState } from './hooks/useGameState';
import RandomWordShuffling from './RandomWordShuffling';
import useSound from 'use-sound';
import drumRoll from '../../assets/drum-roll.mp3';
import fanfare from '../../assets/fanfare.mp3';
import titleCase from '../../utils/titleCase';

const GameView = ({
  game,
  gameState,
  flipped,
  onGameFinish,
  onStartNewGame,
  onGameUpdate,
  onViewScroll,
  onCardFlip,
}: {
  game: Game;
  gameState: GameState;
  flipped: boolean;
  onCardFlip: (flipped: boolean) => void;
  onGameFinish?: () => void;
  onStartNewGame?: () => void;
  onGameUpdate?: (updatedGame: Game) => void;
  onViewScroll?: () => void;
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [playFanfare] = useSound(fanfare);
  const [playDrumRoll] = useSound(drumRoll, {
    onend: () => {
      setIsPlayingSound(false);
    },
  });

  useEffect(() => {
    if (gameState.finished) {
      playFanfare();
      onGameFinish?.();
      return;
    }

    if (!gameState.hasGame) return;

    setIsPlayingSound(true);
    playDrumRoll();
  }, [playDrumRoll, playFanfare, gameState, onGameFinish]);

  const handleNextCard = useCallback(
    (guessed: boolean) => {
      if (!game) return;

      const toUpdateGame = structuredClone(game);
      const currentPointer = gameState.currentCardPointer;
      toUpdateGame.cards[currentPointer].guessed = guessed;
      toUpdateGame.cards[currentPointer].guessedAt = new Date().toUTCString();
      onGameUpdate?.(toUpdateGame);
    },
    [game, gameState, onGameUpdate],
  );

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 's') onViewScroll?.();

      if (game?.cards.findIndex((card) => card.guessedAt === null) === -1)
        return; // if game finished, do nothing

      if (isPlayingSound) return;

      if (e.key === 'f') onCardFlip(!flipped);
      if (e.key === 'a') handleNextCard(false);
      if (e.key === 'g') handleNextCard(true);
    };

    document.body.addEventListener('keyup', handleKeyUp);
    return () => document.body.removeEventListener('keyup', handleKeyUp);
  }, [game, flipped, handleNextCard, isPlayingSound, onViewScroll, onCardFlip]);

  const { finished: gameFinished, currentCard, totalCards } = gameState;

  return (
    <>
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
          {!gameFinished ? gameState.currentCardPointer + 1 : totalCards} of{' '}
          {totalCards} cards
        </div>

        {!gameFinished ? (
          <div className="flex gap-4">
            <button
              className={`btn btn-ghost h-auto px-8 py-4 text-2xl ${isPlayingSound ? 'btn-disabled' : ''}`}
              disabled={isPlayingSound}
              onClick={() => onCardFlip(!flipped)}
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
            onClick={() => onStartNewGame?.()}
          >
            Start New Game
          </button>
        )}
      </div>
    </>
  );
};

export default GameView;
