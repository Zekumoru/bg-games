import { forwardRef, useEffect, useState } from 'react';
import useCardMutation from './hooks/useCardMutation';
import TextInput from '../form/TextInput';

const CardModal = forwardRef<
  HTMLDialogElement,
  {
    title: string;
    type: 'create' | 'update';
    initialName?: string;
    onSuccess?: () => void;
  }
>(({ title, type, initialName, onSuccess }, ref) => {
  const [name, setName] = useState(type === 'update' ? initialName ?? '' : '');
  const [mutateCard, status, error, isPending] = useCardMutation();

  const addCard = () => {
    mutateCard({ type: 'create', data: { name } });
  };

  useEffect(() => {
    if (!status) return;

    if (status.status >= 200 && status.status < 300) {
      onSuccess?.();
    }
  }, [status, onSuccess]);

  return (
    <dialog className="modal" ref={ref}>
      {isPending && (
        <div className="fixed left-0 top-0 z-50 grid h-screen w-screen place-content-center">
          <div className="absolute bottom-0 top-0 h-screen w-screen bg-neutral-800 opacity-40"></div>
          <div className="loading-circle z-10"></div>
        </div>
      )}
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>

        <TextInput
          label="Name"
          value={name}
          setValue={setName}
          errMessage={error?.errors.name?.msg}
        />

        <div className="modal-action">
          <form className="flex gap-2" method="dialog">
            <button className="btn btn-ghost">Close</button>
            <button className="btn btn-primary" type="button" onClick={addCard}>
              Add card
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export default CardModal;
