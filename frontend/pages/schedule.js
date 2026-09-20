import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

export default function Schedule() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    hour: "12",
    minute: "00",
    ampm: "AM",
    duration_minutes: 30,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a meeting topic.");
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    let hour24 = parseInt(form.hour, 10);

    if (form.ampm === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    if (form.ampm === "PM" && hour24 !== 12) {
      hour24 += 12;
    }

    const formattedTime =
      `${String(hour24).padStart(2, "0")}:${form.minute}`;

    setLoading(true);

    try {
      await api.schedule({
        title: form.title,
        description: form.description,
        date: form.date,
        time: formattedTime,
        duration_minutes: form.duration_minutes,
        host_name: "Saloni",
      });

      router.push("/");
    } catch (e) {
      setError(e.message || "Could not schedule the meeting.");
      setLoading(false);
    }
  }

  return (
    <Navbar>
      <div className="schedule-page">

        {/* ---------- Header ---------- */}

        <div className="schedule-page-header">
          <div>
            <h1>Schedule a Meeting</h1>
            <p>
              Schedule a meeting and invite participants to join.
            </p>
          </div>

          <button
            type="button"
            className="schedule-cancel-btn"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>

        {/* ---------- Main Content ---------- */}

        <div className="schedule-layout">

          {/* Left navigation / information */}

          <aside className="schedule-side-panel">

            <div className="schedule-side-item active">
              <div className="schedule-side-number">
                1
              </div>

              <div>
                <strong>Meeting details</strong>
                <span>
                  Topic, date and time
                </span>
              </div>
            </div>

            

          </aside>

          {/* ---------- Form ---------- */}

          <form
            className="schedule-form"
            onSubmit={handleSubmit}
          >

            <div className="schedule-form-header">
              <h2>Meeting details</h2>

              <p>
                Enter the information for your meeting.
              </p>
            </div>

            {error && (
              <div className="schedule-error">
                {error}
              </div>
            )}

            {/* Topic */}

            <div className="schedule-field">
              <label htmlFor="meeting-title">
                Topic
                <span className="required">*</span>
              </label>

              <input
                id="meeting-title"
                type="text"
                placeholder="Enter meeting topic"
                value={form.title}
                onChange={(e) =>
                  update("title", e.target.value)
                }
              />
            </div>

            {/* Description */}

            <div className="schedule-field">
              <label htmlFor="meeting-description">
                Description
                <span className="optional">
                  Optional
                </span>
              </label>

              <textarea
                id="meeting-description"
                rows={4}
                placeholder="Enter meeting description"
                value={form.description}
                onChange={(e) =>
                  update("description", e.target.value)
                }
              />
            </div>

            {/* Date */}

            <div className="schedule-field">
              <label htmlFor="meeting-date">
                When
                <span className="required">*</span>
              </label>

              <div className="schedule-date-row">

                <input
                  id="meeting-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    update("date", e.target.value)
                  }
                />

              </div>
            </div>

            {/* Time */}

            <div className="schedule-field">
              <label>
                Time
                <span className="required">*</span>
              </label>

              <div className="schedule-time-row">

                <select
                  value={form.hour}
                  onChange={(e) =>
                    update("hour", e.target.value)
                  }
                >
                  {Array.from(
                    { length: 12 },
                    (_, i) => {
                      const hour = String(i + 1)
                        .padStart(2, "0");

                      return (
                        <option
                          key={hour}
                          value={hour}
                        >
                          {hour}
                        </option>
                      );
                    }
                  )}
                </select>

                <span className="schedule-colon">
                  :
                </span>

                <select
                  value={form.minute}
                  onChange={(e) =>
                    update("minute", e.target.value)
                  }
                >
                  {Array.from(
                    { length: 12 },
                    (_, i) => {
                      const minute = String(i * 5)
                        .padStart(2, "0");

                      return (
                        <option
                          key={minute}
                          value={minute}
                        >
                          {minute}
                        </option>
                      );
                    }
                  )}
                </select>

                <select
                  value={form.ampm}
                  onChange={(e) =>
                    update("ampm", e.target.value)
                  }
                >
                  <option value="AM">
                    AM
                  </option>

                  <option value="PM">
                    PM
                  </option>
                </select>

              </div>

              <span className="schedule-timezone">
                India Standard Time (GMT+5:30)
              </span>
            </div>

            {/* Duration */}

            <div className="schedule-field">
              <label>
                Duration
              </label>

              <div className="schedule-duration-row">

                <select
                  value={form.duration_minutes}
                  onChange={(e) =>
                    update(
                      "duration_minutes",
                      parseInt(
                        e.target.value,
                        10
                      )
                    )
                  }
                >
                  <option value={15}>
                    15 minutes
                  </option>

                  <option value={30}>
                    30 minutes
                  </option>

                  <option value={45}>
                    45 minutes
                  </option>

                  <option value={60}>
                    1 hour
                  </option>

                  <option value={90}>
                    1 hour 30 minutes
                  </option>

                  <option value={120}>
                    2 hours
                  </option>
                </select>

              </div>
            </div>

            

            {/* Bottom buttons */}

            <div className="schedule-form-footer">

              <button
                type="button"
                className="schedule-secondary-btn"
                onClick={() => router.back()}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="schedule-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Scheduling..."
                  : "Save"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </Navbar>
  );
}