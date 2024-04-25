import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCardsQuery from './hooks/useCardsQuery';
import CreateCardModal from './CreateCardModal';
import EditCardModal from './EditCardModal';
import useCardMutation from './hooks/useCardMutation';
import LoadingScreen from '../LoadingScreen';
import CardsList from './CardsList';
import useStatusCallback from '../../hooks/useStatusCallback';

const Cards = () => {
  const createModalRef = useRef<HTMLDialogElement>(null);
  const updateModalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [cards, refetchCards, cardsError, isCardsFetching] = useCardsQuery();
  const [nameToEdit, setNameToEdit] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mutateCard, status, _mutationError, isMutationPending] =
    useCardMutation();
  useStatusCallback(status, { onSuccessfulResponse: () => refetchCards() });

  return (
    <div className="page-center p-4">
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
      <CardsList
        cards={cards}
        errMessage={cardsError?.message}
        isLoading={isCardsFetching}
        onDeleteClick={({ name }) => mutateCard({ type: 'delete', name })}
        onEditClick={({ name }) => {
          setNameToEdit(name);
          updateModalRef.current?.showModal();
        }}
      />

      <CreateCardModal ref={createModalRef} onSuccess={refetchCards} />

      <EditCardModal
        nameToEdit={nameToEdit}
        ref={updateModalRef}
        onSuccess={refetchCards}
      />
    </div>
  );
};

export default Cards;
