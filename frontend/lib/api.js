// Small fetch wrapper around the FastAPI backend.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  getUpcoming: () => request("/api/meetings/upcoming"),
  getRecent: () => request("/api/meetings/recent"),
  signup: (payload) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  getMeeting: (id) => request(`/api/meetings/${id}`),
  createInstant: (hostName) =>
    request("/api/meetings/instant", {
      method: "POST",
      body: JSON.stringify({ host_name: hostName }),
    }),
  schedule: (payload) =>
    request("/api/meetings/schedule", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  join: (id, name) =>
    request(`/api/meetings/${id}/join`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  endMeeting: (id) => request(`/api/meetings/${id}/end`, { method: "POST" }),
  removeParticipant: (meetingId, participantId) =>
    request(`/api/meetings/${meetingId}/participants/${participantId}`, {
      method: "DELETE",
    }),
};
