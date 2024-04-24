import { useQuery } from '@tanstack/react-query';
import server from '../../../api/server';
import Game from '../types/game';
import { GameResponse } from '../../../types/response';
import { AxiosError } from 'axios';
import useServerError from '../../../hooks/useServerError';

const gameQuery: (gameId: string) => Promise<Game> = async (gameId) => {
  const response = (await server.get<GameResponse>(`/shuffler/game/${gameId}`))
    .data;
  return response.game;
};

const useGame = (gameId: string) => {
  const {
    data: game,
    refetch,
    error: axiosError,
    isFetching,
  } = useQuery<Game, AxiosError>({
    queryFn: async () => await gameQuery(gameId),
    queryKey: [],
  });
  const error = useServerError(axiosError);

  return [game, refetch, error, isFetching] as const;
};

export default useGame;
