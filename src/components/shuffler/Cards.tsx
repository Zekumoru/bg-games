import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CardModal from './CardModal';
import useCardsQuery from './hooks/useCardsQuery';

const Cards = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [cards, refetchCards, error, isFetching] = useCardsQuery();

  return (
    <>
      <h1>Shuffler Cards</h1>
      <p className="my-4">Here you can add/edit/delete cards.</p>

      <div className="flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => modalRef.current?.showModal()}
        >
          Add new card
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => navigate('/shuffler')}
        >
          Go back to Shuffler
        </button>
      </div>

      <h2 className="mb-4 mt-6">List of cards</h2>
      {isFetching ? (
        <div>Loading cards...</div>
      ) : error?.message ? (
        <div>Could not get cards from the server.</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {cards.map(({ name }, index) => (
            <li key={name} className="card bg-neutral shadow-xl">
              <div className="card-body flex-row items-center justify-between p-4">
                <div className="flex gap-2 text-lg">
                  <div>{index + 1}</div>
                  <div>{name}</div>
                </div>
                <div className="card-actions">
                  <button className="btn">Edit</button>
                  <button className="btn btn-error">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CardModal
        title="Add New Card"
        type="create"
        ref={modalRef}
        onSuccess={refetchCards}
      />
    </>
  );
};

export default Cards;
