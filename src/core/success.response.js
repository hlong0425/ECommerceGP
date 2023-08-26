const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  CREATED: 'Created',
  OK: 'Success',
};

class SUCCESS {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SUCCESS {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SUCCESS {
  constructor({
    message,
    metadata,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    options = {},
  }) {
    super({ message, metadata, statusCode, reasonStatusCode });
    this.options = options;
  }
}

export { OK, CREATED, SUCCESS };
