import { useNavigate } from 'react-router-dom';

const Shuffler = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-4">Shuffler</h1>

      <p className="my-4">
        Guess the jumbled word of a Bible character, book, or place!
      </p>

      <div className="my-4 flex flex-col items-start gap-2">
        <button className="btn btn-primary">Start new game</button>
        <button
          className="btn btn-neutral"
          onClick={() => navigate('/shuffler/cards')}
        >
          View cards
        </button>
      </div>
    </>
  );
};

export default Shuffler;
