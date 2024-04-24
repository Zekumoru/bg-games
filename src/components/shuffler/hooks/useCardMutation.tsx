import { useMutation } from '@tanstack/react-query';
import server from '../../../api/server';
import { AxiosError } from 'axios';
import { StatusResponse } from '../../../types/response';
import useServerError from '../../../hooks/useServerError';
import { ShufflerCardErrorResponse } from '../../../types/validation-errors';

interface ShufflerCardData {
  name: string;
}

type CreateOptions = {
  type: 'create';
  data: ShufflerCardData;
};

type UpdateOptions = {
  type: 'update';
  name: string;
  data: ShufflerCardData;
};

type DeleteOptions = {
  type: 'delete';
  name: string;
};

type CardMutationOptions = CreateOptions | UpdateOptions | DeleteOptions;

const cardMutation: (
  options: CardMutationOptions,
) => Promise<StatusResponse> = async (options) => {
  switch (options.type) {
    case 'create':
      return (await server.post('/shuffler/card/create', options.data)).data;
    case 'update':
      return (
        await server.post(`/shuffler/card/${options.name}/update`, options.data)
      ).data;
    case 'delete':
      return (await server.delete(`/shuffler/card/${options.name}/delete`))
        .data;
  }
};

const useCardMutation = () => {
  const {
    mutate: mutateCard,
    data: status,
    error: axiosError,
    isPending,
  } = useMutation<StatusResponse, AxiosError, CardMutationOptions, unknown>({
    mutationFn: cardMutation,
  });
  const error = useServerError<ShufflerCardErrorResponse>(axiosError);

  return [mutateCard, status, error, isPending] as const;
};

export default useCardMutation;
