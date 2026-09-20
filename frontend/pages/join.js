import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

// Accepts either a raw meeting ID ("123-456-789") or a full invite link
// (".../meeting/123-456-789") and extracts the ID.
function extractMeetingId(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/(\d{3}-\d{3}-\d{3})/);
  return match ? match[1] : trimmed;
}

export default function Join() {
  const router = useRouter();

  const [meetingInput, setMeetingInput] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!meetingInput.trim() || !name.trim()) {
      setError("Please enter both a Meeting ID/link and your name.");
      return;
    }

    const meetingId = extractMeetingId(meetingInput);

    setLoading(true);

    try {
      // Validate the meeting exists before joining
      await api.getMeeting(meetingId);

      router.push(
        `/meeting/${meetingId}?name=${encodeURIComponent(name)}`
      );
    } catch (e) {
      setError("Meeting not found. Please check the ID or link.");
      setLoading(false);
    }
  }

  return (
    <Navbar>
      <div className="centered-page">
        <form className="form-card" onSubmit={handleSubmit}>

          {/* Back button */}
          <button
            type="button"
            className="back-button"
            onClick={() => router.push("/")}
          >
            ← Back
          </button>

          <h2>Join a Meeting</h2>

          <p className="subtitle">
            Enter a Meeting ID or invite link to join.
          </p>

          {error && (
            <div className="error-text">
              {error}
            </div>
          )}

          <div className="field">
            <label>Meeting ID or Invite Link</label>

            <input
              type="text"
              placeholder="e.g. 123-456-789"
              value={meetingInput}
              onChange={(e) => setMeetingInput(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Your Name</label>

            <input
              type="text"
              placeholder="Enter your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Checking..." : "Join"}
          </button>

        </form>
      </div>
    </Navbar>
  );
}