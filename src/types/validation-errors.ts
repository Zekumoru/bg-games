import { StatusResponse } from './response';

export interface ServerValidationError {
  value: string;
  msg: string;
}

export interface ShufflerCardErrorResponse extends StatusResponse {
  errors: {
    name?: ServerValidationError;
  };
}
