import { useEffect } from 'react';
import { StatusResponse } from '../types/response';

type OnResponse<T extends StatusResponse> = (status: T) => void;

const useStatusCallback: <T extends StatusResponse>(
  status: T | undefined,
  options?: {
    onInformationalResponse?: OnResponse<T>;
    onSuccessfulResponse?: OnResponse<T>;
    onRedirectionResponse?: OnResponse<T>;
    onClientErrorResponse?: OnResponse<T>;
    onServerErrorResponse?: OnResponse<T>;
  },
) => void = (status, options) => {
  useEffect(() => {
    if (!status) return;
    if (!options) return;

    if (status.status >= 100 && status.status < 200)
      options.onInformationalResponse?.(status);
    else if (status.status >= 200 && status.status < 300)
      options.onSuccessfulResponse?.(status);
    else if (status.status >= 300 && status.status < 400)
      options.onRedirectionResponse?.(status);
    else if (status.status >= 400 && status.status < 500)
      options.onClientErrorResponse?.(status);
    else if (status.status >= 500 && status.status < 600)
      options.onServerErrorResponse?.(status);
  }, [status, options]);
};

export default useStatusCallback;
