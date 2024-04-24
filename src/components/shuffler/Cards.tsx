import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CardModal from './CardModal';

const Cards = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

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

      <CardModal
        title="Add New Card"
        type="create"
        ref={modalRef}
        onSuccess={() => {
          modalRef.current?.close();
        }}
      />
    </>
  );
};

export default Cards;
