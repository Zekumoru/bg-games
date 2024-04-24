interface GameCard {
  name: string;
  shuffled: string;
  guessed: boolean;
  guessedAt: string | null;
}

export default GameCard;
