import { useQuery } from '@tanstack/react-query';
import server from '../../../api/server';
import { StatusResponse } from '../../../types/response';
import Card from '../types/card';
import { AxiosError } from 'axios';
import useServerError from '../../../hooks/useServerError';

interface CardsResponse extends StatusResponse {
  cards: Card[];
}

const fetchCards = async () => {
  const response = (await server.get<CardsResponse>('/shuffler/cards')).data;
  return response.cards;
};

const useCardsQuery = () => {
  const {
    data: cards,
    refetch,
    error: axiosError,
    isFetching,
  } = useQuery<Card[], AxiosError>({
    queryFn: fetchCards,
    queryKey: ['shuffler', 'cards'],
    initialData: [],
  });
  const error = useServerError(axiosError);

  return [cards, refetch, error, isFetching] as const;
};

export default useCardsQuery;
