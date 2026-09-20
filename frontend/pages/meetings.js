import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import {
  IconCalendar,
  IconMoreDots,
  IconRecordDot,
} from "../components/icons";

export default function Meetings() {
  const router = useRouter();

  const [upcoming, setUpcoming] = useState([]);
  const [recent, setRecent] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvitation, setShowInvitation] = useState(false);
  const [toast, setToast] = useState("");

  // --------------------------------------------------
  // Load meetings
  // --------------------------------------------------

  async function loadMeetings() {
    try {
      setLoading(true);
      setError("");

      const [upcomingData, recentData] = await Promise.all([
        api.getUpcoming(),
        api.getRecent(),
      ]);

      setUpcoming(upcomingData || []);
      setRecent(recentData || []);

      // Select first upcoming meeting automatically
      if (upcomingData && upcomingData.length > 0) {
        setSelectedMeeting(upcomingData[0]);
      } else if (recentData && recentData.length > 0) {
        setSelectedMeeting(recentData[0]);
      } else {
        setSelectedMeeting(null);
      }
    } catch (e) {
      setError(e.message || "Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings();
  }, []);

  // --------------------------------------------------
  // Current list
  // --------------------------------------------------

  const displayedMeetings =
    activeTab === "upcoming" ? upcoming : recent;

  // --------------------------------------------------
  // Select meeting
  // --------------------------------------------------

  function selectMeeting(meeting) {
    setSelectedMeeting(meeting);
    setShowInvitation(false);
  }

  // --------------------------------------------------
  // Start meeting
  // --------------------------------------------------

  function startMeeting(meetingId) {
    router.push(`/meeting/${meetingId}?host=true`);
  }

  // --------------------------------------------------
  // Copy meeting invitation
  // --------------------------------------------------

  async function copyInvitation(meeting) {
    if (!meeting) return;

    const meetingUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/meeting/${meeting.id}`
        : "";

    const invitation = `Join my Zoom meeting

Meeting: ${meeting.title}
Meeting ID: ${meeting.id}

Join Meeting:
${meetingUrl}`;

    try {
      await navigator.clipboard.writeText(invitation);

      setToast("Meeting invitation copied.");

      setTimeout(() => {
        setToast("");
      }, 2500);
    } catch (e) {
      setToast("Could not copy invitation.");

      setTimeout(() => {
        setToast("");
      }, 2500);
    }
  }

  // --------------------------------------------------
  // Add calendar
  // --------------------------------------------------

  function addCalendar() {
    setToast("Calendar connection is not configured yet.");

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  // --------------------------------------------------
  // Format date/time
  // --------------------------------------------------

  function formatMeetingDate(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatMeetingTime(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // --------------------------------------------------
  // Empty state
  // --------------------------------------------------

  if (!loading && !error && displayedMeetings.length === 0) {
    return (
      <Navbar>
        <div className="meetings-page-new">

          <div className="meetings-sidebar-new">

            <div className="meetings-sidebar-header">
              <button
                className="meetings-refresh-btn"
                onClick={loadMeetings}
                title="Refresh"
              >
                ↻
              </button>

              <h2>Upcoming</h2>

              <button
                className="meetings-more-btn"
                title="More"
              >
                <IconMoreDots />
              </button>
            </div>

            <div className="meetings-empty-sidebar">
              No upcoming meetings
            </div>

            <button
              className="add-calendar-btn"
              onClick={addCalendar}
            >
              <IconCalendar size={17} withDots={false} />
              Add a calendar
            </button>

          </div>

          <div className="meeting-details-new">

            <div className="meetings-empty-main">
              <h2>No upcoming meetings</h2>

              <button
                className="create-meeting-main-btn"
                onClick={() => router.push("/")}
              >
                + New Meeting
              </button>
            </div>

          </div>

        </div>
      </Navbar>
    );
  }

  return (
    <Navbar>

      {toast && (
        <div className="meeting-toast">
          {toast}
        </div>
      )}

      <div className="meetings-page-new">

        {/* ==================================================
            LEFT SIDEBAR
        ================================================== */}

        <aside className="meetings-sidebar-new">

          {/* Header */}
          <div className="meetings-sidebar-header">

            <button
              className="meetings-refresh-btn"
              onClick={loadMeetings}
              title="Refresh"
            >
              ↻
            </button>

            <h2>
              {activeTab === "upcoming"
                ? "Upcoming"
                : "Recent"}
            </h2>

            <button
              className="meetings-more-btn"
              title="More"
            >
              <IconMoreDots />
            </button>

          </div>

          {/* Tabs */}
          <div className="meetings-sidebar-tabs">

            <button
              className={
                activeTab === "upcoming"
                  ? "sidebar-tab active"
                  : "sidebar-tab"
              }
              onClick={() => {
                setActiveTab("upcoming");

                if (upcoming.length > 0) {
                  setSelectedMeeting(upcoming[0]);
                } else {
                  setSelectedMeeting(null);
                }
              }}
            >
              Upcoming
            </button>

            <button
              className={
                activeTab === "recent"
                  ? "sidebar-tab active"
                  : "sidebar-tab"
              }
              onClick={() => {
                setActiveTab("recent");

                if (recent.length > 0) {
                  setSelectedMeeting(recent[0]);
                } else {
                  setSelectedMeeting(null);
                }
              }}
            >
              Recent
            </button>

          </div>

          {/* Loading */}
          {loading && (
            <div className="meetings-sidebar-loading">
              Loading...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="meetings-sidebar-error">
              {error}
            </div>
          )}

          {/* Meeting list */}
          {!loading && !error && (
            <div className="meetings-sidebar-list">

              {displayedMeetings.map((meeting) => {

                const isSelected =
                  selectedMeeting?.id === meeting.id;

                return (
                  <button
                    key={meeting.id}
                    className={
                      isSelected
                        ? "meeting-sidebar-card selected"
                        : "meeting-sidebar-card"
                    }
                    onClick={() => selectMeeting(meeting)}
                  >

                    <div className="meeting-sidebar-id">
                      {meeting.id}
                    </div>

                    <div className="meeting-sidebar-title">
                      {meeting.title}
                    </div>

                    <div className="meeting-sidebar-time">

                      {formatMeetingDate(
                        meeting.scheduled_at
                      )}

                      {" • "}

                      {formatMeetingTime(
                        meeting.scheduled_at
                      )}

                    </div>

                  </button>
                );
              })}

            </div>
          )}

          {/* Empty sidebar */}
          {!loading &&
            !error &&
            displayedMeetings.length === 0 && (
              <div className="meetings-sidebar-empty">
                No meetings
              </div>
            )}

          {/* Bottom calendar */}
          <button
            className="add-calendar-btn"
            onClick={addCalendar}
          >
            <IconCalendar
              size={17}
              withDots={false}
            />
            Add a calendar
          </button>

        </aside>

        {/* ==================================================
            RIGHT DETAILS PANEL
        ================================================== */}

        <main className="meeting-details-new">

          {!selectedMeeting ? (
            <div className="meeting-details-empty">
              <h2>
                Select a meeting
              </h2>

              <p>
                Select a meeting from the list to view
                its details.
              </p>
            </div>
          ) : (

            <div className="meeting-details-content">

              {/* Title */}
              <h1>
                {selectedMeeting.title}
              </h1>

              {/* Meeting ID */}
              <div className="meeting-pmi">
                {selectedMeeting.id}
              </div>

              {/* Date and time */}
              <div className="meeting-detail-date">

                <div>
                  <strong>Date</strong>

                  <span>
                    {formatMeetingDate(
                      selectedMeeting.scheduled_at
                    )}
                  </span>
                </div>

                <div>
                  <strong>Time</strong>

                  <span>
                    {formatMeetingTime(
                      selectedMeeting.scheduled_at
                    )}
                  </span>
                </div>

                <div>
                  <strong>Duration</strong>

                  <span>
                    {selectedMeeting.duration_minutes || 30} min
                  </span>
                </div>

              </div>

              {/* Action buttons */}
              <div className="meeting-detail-actions">

                {activeTab === "upcoming" && (
                  <button
                    className="meeting-start-main"
                    onClick={() =>
                      startMeeting(selectedMeeting.id)
                    }
                  >
                    Start
                  </button>
                )}

                <button
                  className="meeting-copy-btn"
                  onClick={() =>
                    copyInvitation(selectedMeeting)
                  }
                >
                  <span>▣</span>
                  Copy Invitation
                </button>

                <button
                  className="meeting-edit-btn"
                  onClick={() =>
                    router.push(
                      `/schedule?edit=${selectedMeeting.id}`
                    )
                  }
                >
                  ✎ Edit
                </button>

              </div>

              {/* Invitation toggle */}
              <button
                className="meeting-invitation-toggle"
                onClick={() =>
                  setShowInvitation((prev) => !prev)
                }
              >
                {showInvitation
                  ? "Hide Meeting Invitation"
                  : "Show Meeting Invitation"}
              </button>

              {/* Invitation */}
              {showInvitation && (
                <div className="meeting-invitation-box">

                  <strong>
                    Join Zoom Meeting
                  </strong>

                  <p>
                    Topic: {selectedMeeting.title}
                  </p>

                  <p>
                    Meeting ID: {selectedMeeting.id}
                  </p>

                  <p>
                    Join Meeting:
                  </p>

                  <div className="meeting-invitation-link">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/meeting/${selectedMeeting.id}`
                      : `/meeting/${selectedMeeting.id}`}
                  </div>

                  <button
                    className="meeting-copy-link-btn"
                    onClick={() =>
                      copyInvitation(selectedMeeting)
                    }
                  >
                    Copy Invitation
                  </button>

                </div>
              )}

            </div>

          )}

        </main>

      </div>

    </Navbar>
  );
}