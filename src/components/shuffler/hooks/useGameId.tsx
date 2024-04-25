import { useEffect, useState } from 'react';
import useNewGame from './useNewGame';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useStatusCallback from '../../../hooks/useStatusCallback';

const useGameId = (onGenerated?: (gameId: string) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [generateNewGame, response, _error, isPending] = useNewGame();
  const [gameId, setGameId] = useLocalStorage('gameId');
  const [generated, setGenerated] = useState(false);

  useStatusCallback(response, {
    onSuccessfulResponse: (response) => {
      if (response.status !== 201) return;

      setGameId(response.gameId);
      setGenerated(true);
    },
  });

  useEffect(() => {
    if (generated) {
      onGenerated?.(gameId);
      setGenerated(false);
    }
  }, [onGenerated, generated, gameId]);

  return [gameId, generateNewGame, isPending, setGameId] as const;
};

export default useGameId;
