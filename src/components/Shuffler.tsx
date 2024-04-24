import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import useLocalStorage from '../hooks/useLocalStorage';
import useStartNewGame from './shuffler/hooks/useStartNewGame';

const Shuffler = () => {
  const navigate = useNavigate();
  const [startNewGame, isPending] = useStartNewGame(() =>
    navigate('/shuffler/game'),
  );
  // use the gameId here to check if a game already exists
  const gameId = useLocalStorage('gameId')[0];

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

        {gameId && (
          <button
            className="btn btn-accent"
            onClick={() => navigate('/shuffler/game')}
          >
            Resume game
          </button>
        )}
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
