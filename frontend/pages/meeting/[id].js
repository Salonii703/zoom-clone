import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../lib/api";
import {
  IconMic,
  IconVideoCamera as IconVideoCam,
  IconSecurity,
  IconPeople,
  IconChatBubble,
  IconShareScreen as IconShareMonitor,
  IconRecordDot,
  IconLink as IconLinkSmall,
  IconMutedBadge,
} from "../../components/icons";
import ChatPanel from "../../components/ChatPanel";
import ParticipantsPanel from "../../components/ParticipantsPanel";


const PARTICIPANTS_POLL_MS = 4000;

function initials(name) {
  return name.trim().charAt(0).toUpperCase();
}

export default function MeetingRoom() {
  const router = useRouter();
  const { id, name, host } = router.query;

  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState("");

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Real participants come from the backend's `participants` table (via
  // meeting.participants). myParticipantId lets a guest exclude themselves
  // from the "other participants" list. mutedIds is local-only UI state
  // (there's no real audio transport, so mute state isn't persisted server-side).
  const [myParticipantId, setMyParticipantId] = useState(null);
  const [mutedIds, setMutedIds] = useState(() => new Set());
  const [toast, setToast] = useState("");

  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [clock, setClock] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);

  // --------------------------------------------------
  // Clock
  // --------------------------------------------------
  useEffect(() => {
    setClock(new Date().toLocaleTimeString("en-US"));

    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString("en-US"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const displayName = name || "You";

  // --------------------------------------------------
  // Validate meeting and join
  // --------------------------------------------------
  useEffect(() => {
    if (!id) return;

    async function setup() {
      try {
        const data = await api.getMeeting(id);
        setMeeting(data);

        if (host !== "true") {
          const joined = await api.join(id, displayName);
          setMeeting(joined);

          // The join response includes our own row in `participants` — find
          // it (most recently joined participant with our name) so we can
          // exclude ourselves from the "other participants" list/tiles.
          const mine = [...joined.participants]
            .filter((p) => p.name === displayName)
            .sort((a, b) => (a.joined_at < b.joined_at ? 1 : -1))[0];

          if (mine) setMyParticipantId(mine.id);
        }
      } catch (e) {
        setError("This meeting doesn't exist or has ended.");
      }
    }

    setup();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --------------------------------------------------
  // Poll for real participant changes (other tabs/devices
  // joining, host removing someone, etc.)
  // --------------------------------------------------
  useEffect(() => {
    if (!id || error) return;

    const timer = setInterval(async () => {
      try {
        const data = await api.getMeeting(id);
        setMeeting(data);
      } catch (e) {
        // Meeting may have ended — stop polling silently.
        clearInterval(timer);
      }
    }, PARTICIPANTS_POLL_MS);

    return () => clearInterval(timer);
  }, [id, error]);

  // Real "other participants" — everyone in meeting.participants except us.
  const peers = (meeting?.participants || []).filter(
    (p) => p.id !== myParticipantId
  );

  // --------------------------------------------------
  // Start camera + microphone
  // --------------------------------------------------
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        setToast(
          "Camera/mic permission denied — showing avatar instead."
        );
        setCamOn(false);
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  // --------------------------------------------------
  // Camera toggle
  // --------------------------------------------------
  function toggleCam() {
    const next = !camOn;

    setCamOn(next);

    streamRef.current
      ?.getVideoTracks()
      .forEach((track) => {
        track.enabled = next;
      });
  }

  // --------------------------------------------------
  // Microphone toggle
  // --------------------------------------------------
  function toggleMic() {
    const next = !micOn;

    setMicOn(next);

    streamRef.current
      ?.getAudioTracks()
      .forEach((track) => {
        track.enabled = next;
      });
  }
  async function toggleScreenShare() {
  if (isScreenSharing) {
    // Stop screen sharing
    screenStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    screenStreamRef.current = null;
    setIsScreenSharing(false);

    // Return to camera
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }

    showToast("Screen sharing stopped.");
    return;
  }

  try {
    const screenStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

    screenStreamRef.current = screenStream;

    // Show the shared screen in the main video tile
    if (videoRef.current) {
      videoRef.current.srcObject = screenStream;
    }

    setIsScreenSharing(true);
    showToast("You are now sharing your screen.");

    // If user clicks "Stop sharing" from the browser toolbar
    const videoTrack = screenStream.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.onended = () => {
        screenStreamRef.current = null;
        setIsScreenSharing(false);

        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }

        showToast("Screen sharing stopped.");
      };
    }
  } catch (error) {
    console.log("Screen sharing cancelled:", error);
  }
}

  // --------------------------------------------------
  // Host: Mute all participants (local UI state only —
  // there's no real audio transport to a peer to mute)
  // --------------------------------------------------
  function muteAll() {
    if (host !== "true") return;

    setMutedIds(new Set(peers.map((p) => p.id)));
    showToast("All participants have been muted.");
  }

  function toggleParticipantMute(participant) {
    if (host !== "true") return;

    setMutedIds((current) => {
      const next = new Set(current);
      if (next.has(participant.id)) {
        next.delete(participant.id);
        showToast(`${participant.name} was unmuted.`);
      } else {
        next.add(participant.id);
        showToast(`${participant.name} was muted.`);
      }
      return next;
    });
  }

  // --------------------------------------------------
  // Host: Remove participant — actually deletes the row
  // from the backend's participants table
  // --------------------------------------------------
  async function removeParticipant(participant) {
    if (host !== "true") return;

    try {
      const updated = await api.removeParticipant(id, participant.id);
      setMeeting(updated);
      showToast(`${participant.name} was removed from the meeting.`);
    } catch (e) {
      showToast("Could not remove participant.");
    }
  }

  // --------------------------------------------------
  // Toast helper
  // --------------------------------------------------
  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  // --------------------------------------------------
  // Send chat message
  // --------------------------------------------------
  function sendChatMessage() {
    const message = chatMessage.trim();

    if (!message) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: displayName,
        text: message,
      },
    ]);

    setChatMessage("");
  }

  // --------------------------------------------------
  // Send chat using Enter
  // --------------------------------------------------
  function handleChatKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChatMessage();
    }
  }

  // --------------------------------------------------
  // Leave meeting
  // --------------------------------------------------
  async function handleLeave() {
  if (host === "true" && id) {
    await api.endMeeting(id).catch(() => {});
  }

  // Stop camera and microphone
  streamRef.current?.getTracks().forEach((track) => {
    track.stop();
  });

  // Stop screen sharing
  screenStreamRef.current?.getTracks().forEach((track) => {
    track.stop();
  });

  streamRef.current = null;
  screenStreamRef.current = null;

  router.push("/");
}
  function copyInviteLink() {
  const link = `${window.location.origin}/meeting/${id}`;

  navigator.clipboard.writeText(link)
    .then(() => {
      showToast("Meeting link copied!");
    })
    .catch(() => {
      showToast("Unable to copy meeting link.");
    });
}

  // --------------------------------------------------
  // Error screen
  // --------------------------------------------------
  if (error) {
    return (
      <div className="room room-error">
        <div>{error}</div>

        <button
          className="btn btn-primary room-error-btn"
          onClick={() => router.push("/")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // Meeting room
  // --------------------------------------------------
  return (
    <div className="room">

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Top bar */}
      <div className="room-topbar">
        <div>
          {meeting?.title || "Meeting"} · ID: {id}
        </div>

        <div className="room-topbar-right">
          <button className="copy-invite-btn" onClick={copyInviteLink}>
            <IconLinkSmall size={15} /> Copy Invite Link
          </button>

          <div>{clock || "\u00A0"}</div>
        </div>
      </div>

      {/* Video grid */}
      <div className="video-grid">

        {/* Self video */}
        <div className="video-tile">

          {camOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="avatar-placeholder">
              {initials(displayName)}
            </div>
          )}

          <div className="name-tag">
            {displayName} (You)
          </div>

          {!micOn && (
            <div className="mute-icon">
              <IconMutedBadge />
            </div>
          )}
        </div>

        {/* Other participants (real joins from the backend) */}
        {peers.map((peer) => (
          <div
            className="video-tile"
            key={peer.id}
          >
            <div className="avatar-placeholder">
              {initials(peer.name)}
            </div>

            <div className="name-tag">
              {peer.name}
            </div>

            {mutedIds.has(peer.id) && (
              <div className="mute-icon">
                <IconMutedBadge />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Control bar */}
      <div className="control-bar">

        {/* Microphone */}
        <button
          className={`control-btn ${
            !micOn ? "active" : ""
          }`}
          onClick={toggleMic}
        >
          <div className="icon">
            <IconMic off={!micOn} />
          </div>

          {micOn ? "Mute" : "Unmute"}
        </button>

        {/* Camera */}
        <button
          className={`control-btn ${
            !camOn ? "active" : ""
          }`}
          onClick={toggleCam}
        >
          <div className="icon">
            <IconVideoCam off={!camOn} />
          </div>

          {camOn ? "Stop Video" : "Start Video"}
        </button>

        {/* Security */}
        <button
          className="control-btn"
          disabled
          title="Not available in this demo"
        >
          <div className="icon"><IconSecurity /></div>
          Security
        </button>

        {/* Participants */}
        <button
          className="control-btn"
          onClick={() =>
            setShowParticipants(
              (current) => !current
            )
          }
        >
          <div className="icon"><IconPeople /></div>

          Participants ({peers.length + 1})
        </button>

        {/* Chat */}
        <button
          className={`control-btn ${
            showChat ? "active" : ""
          }`}
          onClick={() =>
            setShowChat((current) => !current)
          }
        >
          <div className="icon"><IconChatBubble /></div>
          Chat
        </button>
{/* Screen share */}
        <button
  className={`control-btn ${
    isScreenSharing ? "active" : ""
  }`}
  onClick={toggleScreenShare}
>
  <div className="icon"><IconShareMonitor /></div>

  {isScreenSharing ? "Stop Share" : "Share Screen"}
</button>

        {/* Record */}
        <button
          className="control-btn"
          disabled
          title="Not available in this demo"
        >
          <div className="icon"><IconRecordDot /></div>
          Record
        </button>

        <div className="control-divider" />

        {/* Leave */}
        <button
          className="control-btn leave"
          onClick={handleLeave}
        >
          Leave
        </button>
      </div>

      {/* =================================================
          CHAT PANEL
         ================================================= */}
      {showChat && (
        <ChatPanel
          messages={messages}
          chatMessage={chatMessage}
          onChatMessageChange={setChatMessage}
          onSend={sendChatMessage}
          onKeyDown={handleChatKeyDown}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* =================================================
          PARTICIPANTS PANEL
         ================================================= */}
      {showParticipants && (
        <ParticipantsPanel
          displayName={displayName}
          peers={peers}
          isHost={host === "true"}
          mutedIds={mutedIds}
          onMuteAll={muteAll}
          onToggleMute={toggleParticipantMute}
          onRemove={removeParticipant}
        />
      )}

    </div>
  );
}