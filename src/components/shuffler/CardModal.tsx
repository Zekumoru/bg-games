import { forwardRef, useImperativeHandle, useRef } from 'react';
import useCardMutation from './hooks/useCardMutation';
import TextInput from '../form/TextInput';
import LoadingScreen from '../LoadingScreen';
import useStatusCallback from '../../hooks/useStatusCallback';

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

  useStatusCallback(status, {
    onSuccessfulResponse: () => {
      modalRef.current?.close();
      setName('');
      onSuccess?.();
    },
  });

  useImperativeHandle<HTMLDialogElement | null, HTMLDialogElement | null>(
    ref,
    () => modalRef.current,
  );

  return (
    <dialog className="modal" ref={modalRef}>
      {isPending && <LoadingScreen />}
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
