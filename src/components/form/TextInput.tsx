import { useEffect, useState } from 'react';

const TextInput = ({
  label,
  value,
  setValue,
  errMessage,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  errMessage?: string;
}) => {
  // reactive error handling, meaning, show error styles upon error
  // then remove error styles on input change
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!errMessage || errMessage === '') return;
    setHasError(true);
  }, [errMessage]);

  return (
    <div className="form-control">
      <label htmlFor="text-field" className="label">
        <span className={`label-text`}>{label}</span>
      </label>
      <input
        type="text"
        name="text-field"
        id="text-field"
        className={`input input-bordered ${hasError ? 'input-error' : ''}`}
        placeholder="Type here"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setHasError(false);
        }}
      />
      {hasError && <div className="mt-1.5 text-error">{errMessage}</div>}
    </div>
  );
};

export default TextInput;
