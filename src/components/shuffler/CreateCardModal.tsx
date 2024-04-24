import { forwardRef, useState } from 'react';
import CardModal from './CardModal';

const CreateCardModal = forwardRef<
  HTMLDialogElement | null,
  { onSuccess?: () => void }
>(({ onSuccess }, ref) => {
  const [name, setName] = useState('');

  return (
    <CardModal
      ref={ref}
      title="Add New Card"
      buttonLabel="Add card"
      name={name}
      setName={setName}
      onSuccess={onSuccess}
      onSubmit={(mutateCard) => {
        mutateCard({ type: 'create', data: { name } });
      }}
    />
  );
});

export default CreateCardModal;
