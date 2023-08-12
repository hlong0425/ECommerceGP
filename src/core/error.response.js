'use strict';

const StatusCode = {
  FOBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FOBIDDEN: 'Bad request error',
  CONFLICT: 'Conflict error',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConfictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.FOBIDDEN
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.FOBIDDEN
  ) {
    super(message, status);
  }
}

export { ConfictRequestError, BadRequestError };
