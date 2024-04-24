import { useEffect, useState } from 'react';

const useLocalStorage = (
  key: string,
  initialValue?: string | (() => string),
) => {
  const [value, setValue] = useState<string>(() => {
    const value = localStorage.getItem(key);
    if (value !== null) return value;
    if (initialValue instanceof Function) return initialValue();
    return initialValue ?? '';
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};

export default useLocalStorage;
