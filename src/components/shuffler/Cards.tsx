import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCardsQuery from './hooks/useCardsQuery';
import CardItem from './CardItem';
import CreateCardModal from './CreateCardModal';
import EditCardModal from './EditCardModal';
import useCardMutation from './hooks/useCardMutation';
import LoadingScreen from '../LoadingScreen';

const Cards = () => {
  const createModalRef = useRef<HTMLDialogElement>(null);
  const updateModalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [cards, refetchCards, cardsError, isCardsFetching] = useCardsQuery();
  const [nameToEdit, setNameToEdit] = useState('');
  const [mutateCard, status, _mutationError, isMutationPending] =
    useCardMutation();

  useEffect(() => {
    if (!status) return;
    if (status.status >= 200 && status.status < 300) refetchCards();
  }, [status, refetchCards]);

  return (
    <>
      {isMutationPending && <LoadingScreen />}

      <h1>Shuffler Cards</h1>
      <p className="my-4">Here you can add/edit/delete cards.</p>

      <div className="flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => createModalRef.current?.showModal()}
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
      {isCardsFetching ? (
        <div>Loading cards...</div>
      ) : cardsError ? (
        <div>
          Could not get cards from the server. (Error: {cardsError.message})
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {cards.length === 0 ? (
            <li>There are no cards yet.</li>
          ) : (
            cards.map((card, index) => (
              <CardItem
                key={card.name}
                card={card}
                index={index}
                onDeleteClick={(name) => {
                  mutateCard({ type: 'delete', name });
                }}
                onEditClick={(name) => {
                  setNameToEdit(name);
                  updateModalRef.current?.showModal();
                }}
              />
            ))
          )}
        </ul>
      )}

      <CreateCardModal ref={createModalRef} onSuccess={refetchCards} />

      <EditCardModal
        nameToEdit={nameToEdit}
        ref={updateModalRef}
        onSuccess={refetchCards}
      />
    </>
  );
};

export default Cards;
