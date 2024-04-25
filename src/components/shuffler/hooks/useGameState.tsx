import { useMemo } from 'react';
import Game from '../types/game';
import GameCard from '../types/gameCard';

export interface GameState {
  currentCardPointer: number;
  totalCards: number;
  currentCard: GameCard | undefined;
  nextCard: GameCard | undefined;
  finished: boolean;
  hasGame: boolean;
}

const useGameState = (game?: Game) => {
  const gameState = useMemo<GameState>(() => {
    // -2 means there's no game
    const currentPointer =
      game?.cards.findIndex((card) => card.guessedAt === null) ?? -2;

    return {
      currentCardPointer: currentPointer,
      totalCards: game?.cards.length ?? 0,
      currentCard: game?.cards[currentPointer],
      nextCard: game?.cards[currentPointer + 1],
      finished: currentPointer === -1,
      hasGame: currentPointer > -1,
    };
  }, [game]);

  return gameState;
};

export default useGameState;
