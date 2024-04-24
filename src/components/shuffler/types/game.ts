import GameCard from './gameCard';

interface Game {
  id: string;
  cards: GameCard[];
  createdAt: string;
}

export default Game;
