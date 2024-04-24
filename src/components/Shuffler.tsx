import { useNavigate } from 'react-router-dom';
import useNewGame from './shuffler/hooks/useNewGame';
import LoadingScreen from './LoadingScreen';
import { useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const Shuffler = () => {
  const navigate = useNavigate();
  const [startNewGame, response, _error, isPending] = useNewGame();
  // use the gameId here to check if a game already exists
  const [gameId, setGameId] = useLocalStorage('gameId');
  const [toStart, setToStart] = useState(false);

  useEffect(() => {
    if (!response) return;

    if (response.status === 201) {
      setGameId(response.gameId);
      setToStart(true);
    }
  }, [response, setGameId]);

  useEffect(() => {
    if (toStart) navigate('/shuffler/game');
  }, [navigate, toStart]);

  return (
    <div className="page-center p-4">
      {isPending && <LoadingScreen />}

      <h1 className="mb-4">Shuffler</h1>

      <p className="my-4">
        Guess the jumbled word of a Bible character, book, or place!
      </p>

      <div className="my-4 flex flex-col items-start gap-2">
        <button className="btn btn-primary" onClick={() => startNewGame()}>
          Start new game
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => navigate('/shuffler/cards')}
        >
          View cards
        </button>
      </div>
    </div>
  );
};

export default Shuffler;
