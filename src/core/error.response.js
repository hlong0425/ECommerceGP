'use strict';

import { ReasonPhrases, StatusCode } from '../utils/httpStatusCode.js';


class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConfictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    status = StatusCode.FORBIDDEN
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    status = StatusCode.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCode.UNAUTHORIZED) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCode.NOT_FOUND) {
    super(message, status);
  };
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCode.FORBIDDEN) {
    super(message, status);
  };
}

export { AuthFailureError, BadRequestError, ConfictRequestError, ForbiddenError, NotFoundError };
