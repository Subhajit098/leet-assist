// Map for HTTP status codes
const errorCodesToMessage = new Map([
  [429, "Timeout: Too many requests. Try again later."],
  [500, "InternalServerError: Server had an internal issue."],
  [503, "ServiceUnavailableError: service is down or overloaded."]
]);

// Map for special error codes/names
const specialErrors = new Map([
  ["ETIMEDOUT", "Timeout: Request took too long."],
  ["ECONNREFUSED", "APIConnectionError: Could not reach API."],
  ["ENOTFOUND", "APIConnectionError: DNS lookup failed, could not reach API."],
  ["AbortError", "Timeout: Request aborted by client."]
]);



export function getErrorMessage(err) {
  if (err?.status && errorCodesToMessage.has(err.status)) {
    return errorCodesToMessage.get(err.status);
  }
  if (err?.code && specialErrors.has(err.code)) {
    return specialErrors.get(err.code);
  }
  if (err?.name && specialErrors.has(err.name)) {
    return specialErrors.get(err.name);
  }
  return `UnknownError: ${err?.message || "An unexpected error occurred."}`;
}