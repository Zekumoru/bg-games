import { useMutation } from '@tanstack/react-query';
import { NewGameResponse } from '../../../types/response';
import { AxiosError } from 'axios';
import useServerError from '../../../hooks/useServerError';
import server from '../../../api/server';

const newGame: () => Promise<NewGameResponse> = async () => {
  return (await server.post('/shuffler/game/new')).data;
};

const useNewGame = () => {
  const {
    mutate: startNewGame,
    data: status,
    error: axiosError,
    isPending,
  } = useMutation<NewGameResponse, AxiosError>({
    mutationFn: newGame,
  });
  const error = useServerError(axiosError);

  return [startNewGame, status, error, isPending] as const;
};

export default useNewGame;
