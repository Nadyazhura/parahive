export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function badRequest(message = 'Bad request') {
  return new HttpError(400, message);
}

export function unauthorized(message = 'Unauthorized') {
  return new HttpError(401, message);
}

export function forbidden(message = 'Forbidden') {
  return new HttpError(403, message);
}

export function tooManyRequests(message = 'Too many requests') {
  return new HttpError(429, message);
}
