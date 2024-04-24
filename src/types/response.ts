import Game from '../components/shuffler/types/game';

export interface StatusResponse {
  status: number;
  message: string;
}

export interface NewGameResponse extends StatusResponse {
  gameId: string;
}

export interface GameResponse extends StatusResponse {
  game: Game;
}
