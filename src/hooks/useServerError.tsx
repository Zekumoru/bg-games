import { AxiosError } from 'axios';
import { StatusResponse } from '../types/response';
import { useEffect, useState } from 'react';

const useServerError = <T extends StatusResponse>(
  axiosError: AxiosError | null,
) => {
  const [error, setError] = useState<T>();

  useEffect(() => {
    if (axiosError && axiosError.response) {
      const error = axiosError.response.data as T;
      return setError(error);
    }

    if (axiosError) {
      const error: StatusResponse = {
        status: 400,
        message: axiosError.message,
      };
      return setError(error as T);
    }

    setError(undefined);
  }, [axiosError]);

  return error;
};

export default useServerError;
