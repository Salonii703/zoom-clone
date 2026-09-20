import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";
import MeetingRow from "../components/MeetingRow";
import { api } from "../lib/api";

import {
  IconVideoCamera,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconMoreDots,
  IconPlus,
  IconUmbrella,
} from "../components/icons";

const DEFAULT_USER = "Saloni";

function getIndiaDateKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}


function formatCalendarDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export default function Dashboard() {
  const router = useRouter();

  // ============================================================
  // STATE
  // ============================================================

  const [upcoming, setUpcoming] = useState([]);
  const [recent, setRecent] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");


  const [calendarDate, setCalendarDate] = useState(new Date());

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [showCalendar, setShowCalendar] = useState(true);

  // ============================================================
  // CHECK WHETHER SELECTED DATE IS TODAY
  // ============================================================

  const isCalendarToday =
    getIndiaDateKey(calendarDate) === getIndiaDateKey(new Date());

  // ============================================================
  // CLOCK
  // ============================================================

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );

      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        })
      );
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // CALENDAR NAVIGATION
  // ============================================================

  function goToPreviousDay() {
    setCalendarDate((currentDate) => {
      const previousDate = new Date(currentDate);

      previousDate.setDate(previousDate.getDate() - 1);

      return previousDate;
    });
  }

  function goToNextDay() {
    setCalendarDate((currentDate) => {
      const nextDate = new Date(currentDate);

      nextDate.setDate(nextDate.getDate() + 1);

      return nextDate;
    });
  }

  function goToToday() {
    setCalendarDate(new Date());
  }

  // ============================================================
  // MEETINGS FOR SELECTED CALENDAR DATE
  // ============================================================

  const selectedDateMeetings = upcoming.filter((meeting) => {
    if (!meeting.scheduled_at) {
      return false;
    }

    const meetingDate = new Date(meeting.scheduled_at);

    if (Number.isNaN(meetingDate.getTime())) {
      return false;
    }

    return (
      getIndiaDateKey(meetingDate) ===
      getIndiaDateKey(calendarDate)
    );
  });

  // ============================================================
  // LOAD MEETINGS
  // ============================================================

  async function loadMeetings() {
    setLoading(true);
    setError("");

    try {
      const [u, r] = await Promise.all([
        api.getUpcoming(),
        api.getRecent(),
      ]);

      setUpcoming(Array.isArray(u) ? u : []);
      setRecent(Array.isArray(r) ? r : []);
    } catch (e) {
      setError(
        "Could not reach the server. Is the backend running on :8000?"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings();
  }, []);

  // ============================================================
  // CREATE NEW MEETING
  // ============================================================

  async function handleNewMeeting() {
    setCreating(true);
    setError("");

    try {
      const meeting = await api.createInstant(DEFAULT_USER);

      router.push(
        `/meeting/${meeting.id}?name=${encodeURIComponent(
          DEFAULT_USER
        )}&host=true`
      );
    } catch (e) {
      setError(e.message || "Could not create meeting.");
      setCreating(false);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Navbar userName={DEFAULT_USER}>
      <main className="zoom-dashboard">

        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="zoom-hero">

          {/* ====================================================
              CLOCK
          ==================================================== */}

          <div className="zoom-clock-area">

            <div className="zoom-time">
              {currentTime}
            </div>

            <div className="zoom-date">
              {currentDate}
            </div>

          </div>

          {/* ====================================================
              ACTION BUTTONS
          ==================================================== */}

          <div className="zoom-actions">

            {/* NEW MEETING */}

            <button
              type="button"
              className="zoom-action"
              onClick={handleNewMeeting}
              disabled={creating}
            >
              <div className="zoom-action-icon new-meeting">
                <IconVideoCamera />
              </div>

              <span>
                {creating ? "Starting..." : "New Meeting"}
              </span>
            </button>

            {/* JOIN */}

            <button
              type="button"
              className="zoom-action"
              onClick={() => router.push("/join")}
            >
              <div className="zoom-action-icon join-meeting">
                <IconPlus size={30} />
              </div>

              <span>
                Join
              </span>
            </button>

            {/* SCHEDULE */}

            <button
              type="button"
              className="zoom-action"
              onClick={() => router.push("/schedule")}
            >
              <div className="zoom-action-icon schedule-meeting">
                <IconCalendar size={30} />
              </div>

              <span>
                Schedule
              </span>
            </button>

          </div>

          {/* ====================================================
              CALENDAR PANEL
          ==================================================== */}

          {showCalendar && (
            <aside className="zoom-upcoming">

              {/* ==================================================
                  CALENDAR HEADER
              ================================================== */}

              <div className="zoom-schedule-header">

                {/* PLUS BUTTON */}

                <button
                  type="button"
                  className="zoom-schedule-icon-btn"
                  title="Schedule a meeting"
                  onClick={() => router.push("/schedule")}
                >
                  <IconPlus />
                </button>

                {/* SELECTED DATE */}

                <div
                  className={`zoom-schedule-today ${
                    isCalendarToday
                      ? "calendar-today"
                      : "calendar-other-day"
                  }`}
                >
                  {formatCalendarDate(calendarDate)}
                </div>

                {/* CLOSE BUTTON */}

                <button
                  type="button"
                  className="zoom-schedule-icon-btn"
                  title="Close calendar"
                  onClick={() => setShowCalendar(false)}
                >
                  ×
                </button>

              </div>

              {/* ==================================================
                  CALENDAR NAVIGATION
              ================================================== */}

              <div className="zoom-schedule-subrow">

                {/* TODAY */}

                <button
                  type="button"
                  className="zoom-schedule-pill"
                  onClick={goToToday}
                  title="Go to today"
                >
                  <IconCalendar />

                  Today
                </button>

                {/* PREVIOUS DAY */}

                <button
                  type="button"
                  className="zoom-schedule-icon-btn small"
                  title="Previous day"
                  onClick={goToPreviousDay}
                >
                  <IconChevronLeft />
                </button>

                {/* NEXT DAY */}

                <button
                  type="button"
                  className="zoom-schedule-icon-btn small"
                  title="Next day"
                  onClick={goToNextDay}
                >
                  <IconChevronRight />
                </button>

                <span className="zoom-schedule-spacer" />

                {/* MORE */}

                <button
                  type="button"
                  className="zoom-schedule-icon-btn small"
                  title="More options"
                  onClick={() => router.push("/schedule")}
                >
                  <IconMoreDots />
                </button>

              </div>

              {/* ==================================================
                  CALENDAR CONTENT
              ================================================== */}

              {loading ? (

                /*
                 * LOADING
                 */

                <div className="zoom-side-loading">
                  Loading...
                </div>

              ) : selectedDateMeetings.length === 0 ? (

                /*
                 * NO MEETINGS ON SELECTED DATE
                 */

                <div className="zoom-side-empty">

                  <IconUmbrella />

                  <div className="zoom-side-empty-text">
                    No meetings scheduled.
                  </div>

                  <button
                    type="button"
                    className="zoom-side-empty-link"
                    onClick={() => router.push("/schedule")}
                  >
                    <IconPlus />

                    Schedule a meeting
                  </button>

                </div>

              ) : (

                /*
                 * MEETINGS FOR SELECTED DATE
                 */

                <div className="zoom-schedule-list">

                  {selectedDateMeetings
                    .slice(0, 3)
                    .map((meeting) => (

                      <div
                        className="zoom-upcoming-card"
                        key={meeting.id}
                      >

                        {/* TIME */}

                        <div className="zoom-upcoming-time">
                          {new Date(
                            meeting.scheduled_at
                          ).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            }
                          )}
                        </div>

                        {/* TITLE */}

                        <div className="zoom-upcoming-title">
                          {meeting.title}
                        </div>

                        {/* MEETING ID */}

                        <div className="zoom-upcoming-id">
                          Meeting ID: {meeting.id}
                        </div>

                        {/* START */}

                        <button
                          type="button"
                          className="zoom-start-button"
                          onClick={() =>
                            router.push(
                              `/meeting/${meeting.id}`
                            )
                          }
                        >
                          Start
                        </button>

                      </div>

                    ))}

                </div>

              )}

              {/* ==================================================
                  RECORDINGS
              ================================================== */}

              <button
                type="button"
                className="zoom-open-recordings"
                onClick={() => router.push("/join")}
              >
                Open recordings

                <IconChevronRight />
              </button>

            </aside>
          )}

        </section>

        {/* ======================================================
            ERROR MESSAGE
        ====================================================== */}

        {error && (
          <div className="zoom-error">
            {error}
          </div>
        )}

        {/* ======================================================
            UPCOMING MEETINGS
        ====================================================== */}

        <section className="zoom-meetings-section">

          <h2>
            Upcoming Meetings
          </h2>

          {loading ? (

            <div className="zoom-empty">
              Loading...
            </div>

          ) : upcoming.length === 0 ? (

            <div className="zoom-empty">
              No upcoming meetings
            </div>

          ) : (

            <div className="meeting-list">

              {upcoming.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                />
              ))}

            </div>

          )}

        </section>

        {/* ======================================================
            RECENT MEETINGS
        ====================================================== */}

        <section className="zoom-meetings-section">

          <h2>
            Recent Meetings
          </h2>

          {loading ? (

            <div className="zoom-empty">
              Loading...
            </div>

          ) : recent.length === 0 ? (

            <div className="zoom-empty">
              No recent meetings yet.
            </div>

          ) : (

            <div className="meeting-list">

              {recent.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                />
              ))}

            </div>

          )}

        </section>

      </main>
    </Navbar>
  );
}