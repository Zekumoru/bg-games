import { forwardRef, useEffect, useState } from 'react';
import CardModal from './CardModal';

const EditCardModal = forwardRef<
  HTMLDialogElement | null,
  {
    nameToEdit: string;
    onSuccess?: () => void;
  }
>(({ nameToEdit, onSuccess }, ref) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (nameToEdit) setName(nameToEdit);
  }, [nameToEdit]);

  return (
    <CardModal
      ref={ref}
      title="Edit Card"
      buttonLabel="Edit card"
      name={name}
      setName={setName}
      onSuccess={onSuccess}
      onSubmit={(mutateCard) => {
        mutateCard({ type: 'update', name: nameToEdit, data: { name } });
      }}
    />
  );
});

export default EditCardModal;
