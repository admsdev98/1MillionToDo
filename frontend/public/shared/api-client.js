import { authStore } from "./auth-store.js";

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = authStore.getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("content-type") && options.body) {
    headers.set("content-type", "application/json");
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers,
    });
  } catch {
    return {
      ok: false,
      status: 0,
      error: {
        code: "NETWORK_ERROR",
        message: "Network request failed",
      },
    };
  }

  const rawText = await response.text();
  const data = rawText ? safeJsonParse(rawText) : null;

  if (response.ok) {
    return { ok: true, status: response.status, data };
  }

  const code = data && data.error && data.error.code ? data.error.code : "REQUEST_FAILED";
  const message = data && data.error && data.error.message ? data.error.message : "Request failed";

  return {
    ok: false,
    status: response.status,
    error: { code, message },
  };
}
