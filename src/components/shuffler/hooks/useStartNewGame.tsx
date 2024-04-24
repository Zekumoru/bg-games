import { useEffect, useState } from 'react';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useNewGame from './useNewGame';

const useStartNewGame = (onPreStart?: (gameId: string) => void) => {
  const [startNewGame, response, _error, isPending] = useNewGame();
  const [toStart, setToStart] = useState(false);
  const [gameId, setGameId] = useLocalStorage('gameId');

  useEffect(() => {
    if (!response) return;

    if (response.status === 201) {
      setGameId(response.gameId);
      setToStart(true);
    }
  }, [response, setGameId]);

  useEffect(() => {
    if (toStart) {
      onPreStart?.(gameId);
      setToStart(false);
    }
  }, [onPreStart, toStart, gameId]);

  return [startNewGame, isPending] as const;
};

export default useStartNewGame;
