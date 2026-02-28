function toHttpError(statusCode, message, errorCode) {
  const error = new Error(message);
  error.statusCode = statusCode;

  // Approach chosen: allow callers to set a stable contract code
  // when a status code alone is too generic (e.g. TASK_SHARED_READ_ONLY).
  // Alternative (discarded): infer everything from status codes (too limiting).
  if (errorCode) {
    error.errorCode = errorCode;
  }

  return error;
}

module.exports = {
  toHttpError,
};
