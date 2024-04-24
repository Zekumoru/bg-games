import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import useCardMutation from './hooks/useCardMutation';
import TextInput from '../form/TextInput';

const CardModal = forwardRef<
  HTMLDialogElement | null,
  {
    title: string;
    buttonLabel: string;
    name: string;
    setName: (name: string) => void;
    onSubmit?: (mutateCard: ReturnType<typeof useCardMutation>[0]) => void;
    onSuccess?: () => void;
  }
>(({ title, buttonLabel, name, setName, onSubmit, onSuccess }, ref) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [mutateCard, status, error, isPending] = useCardMutation();

  useImperativeHandle<HTMLDialogElement | null, HTMLDialogElement | null>(
    ref,
    () => modalRef.current,
  );

  useEffect(() => {
    if (!status) return;

    if (status.status >= 200 && status.status < 300) {
      modalRef.current?.close();
      setName('');
      onSuccess?.();
    }
  }, [status, onSuccess, setName]);

  return (
    <dialog className="modal" ref={modalRef}>
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
          onEnter={() => onSubmit?.(mutateCard)}
        />

        <div className="modal-action">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.(mutateCard);
            }}
          >
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => modalRef.current?.close()}
            >
              Close
            </button>
            <button className="btn btn-primary" type="submit">
              {buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export default CardModal;
