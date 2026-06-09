const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

function cleanMsg(raw) {
  return raw.replace(/^Value error,\s*/i, "");
}

function extractErrorMessage(status, text) {
  try {
    const body = JSON.parse(text);
    if (Array.isArray(body.detail) && body.detail.length > 0) {
      return body.detail.map((e) => cleanMsg(e.msg)).join("；");
    }
    if (typeof body.detail === "string") {
      return cleanMsg(body.detail);
    }
    return `请求失败（${status}）`;
  } catch {
    return `请求失败（${status}）`;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(extractErrorMessage(response.status, text));
  }

  return response.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
};
