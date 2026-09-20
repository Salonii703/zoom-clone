import { useRouter } from "next/router";


function formatDate(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function MeetingRow({ meeting }) {
  const router = useRouter();
  const { day, month, time } = formatDate(meeting.scheduled_at || meeting.created_at);

  const badgeClass =
    meeting.status === "live"
      ? "badge badge-live"
      : meeting.status === "upcoming"
      ? "badge badge-upcoming"
      : "badge badge-completed";

  return (
    <div className="meeting-row">
      <div className="meeting-row-left">
        <div className="meeting-date-badge">
          {month}
          <strong>{day}</strong>
        </div>
        <div>
          <div className="meeting-title">{meeting.title}</div>
          <div className="meeting-meta">
            {time} · {meeting.duration_minutes} min · ID: {meeting.id}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className={badgeClass}>{meeting.status}</span>
        {meeting.status !== "completed" && (
          <button
            className="btn btn-outline"
            onClick={() => router.push(`/meeting/${meeting.id}`)}
          >
            {meeting.status === "live" ? "Join" : "Start"}
          </button>
        )}
      </div>
    </div>
  );
}
