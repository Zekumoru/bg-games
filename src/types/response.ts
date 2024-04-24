export interface StatusResponse {
  status: number;
  message: string;
}

export interface NewGameResponse extends StatusResponse {
  gameId: string;
}
