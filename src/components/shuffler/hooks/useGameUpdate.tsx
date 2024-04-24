import { useMutation } from '@tanstack/react-query';
import server from '../../../api/server';
import { StatusResponse } from '../../../types/response';
import Game from '../types/game';
import useServerError from '../../../hooks/useServerError';
import { AxiosError } from 'axios';

const gameUpdate: (game: Game) => Promise<StatusResponse> = async (game) => {
  return (await server.post(`/shuffler/game/${game.id}/update`, game)).data;
};

const useGameUpdate = () => {
  const {
    mutate: updateGame,
    data: status,
    error: axiosError,
    isPending,
  } = useMutation<StatusResponse, AxiosError, Game>({
    mutationFn: gameUpdate,
  });
  const error = useServerError(axiosError);

  return [updateGame, status, error, isPending] as const;
};

export default useGameUpdate;
