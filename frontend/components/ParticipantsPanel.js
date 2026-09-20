import { IconMutedBadge } from "./icons";

export default function ParticipantsPanel({
  displayName,
  peers,
  isHost,
  mutedIds,
  onMuteAll,
  onToggleMute,
  onRemove,
}) {
  return (
    <div className="participants-panel">
      <div className="participants-panel-title">Participants</div>

      {/* Current user */}
      <div className="participants-panel-self">{displayName} (You)</div>

      {/* Mute all button — host only */}
      {isHost && peers.length > 0 && (
        <button className="participants-mute-all" onClick={onMuteAll}>
          Mute All
        </button>
      )}

      {/* Participants */}
      {peers.length === 0 ? (
        <div className="participants-panel-empty">No other participants</div>
      ) : (
        peers.map((peer) => (
          <div className="participants-panel-row" key={peer.id}>
            <span className="participants-panel-name">
              {peer.name}
              {mutedIds.has(peer.id) && (
                <span className="participants-mute-badge">
                  <IconMutedBadge size={12} color="#d32f2f" />
                </span>
              )}
            </span>

            {/* Mute/Remove buttons — host only */}
            {isHost && (
              <div className="participants-panel-actions">
                <button
                  className="participants-action-mute"
                  onClick={() => onToggleMute(peer)}
                >
                  {mutedIds.has(peer.id) ? "Unmute" : "Mute"}
                </button>
                <button
                  className="participants-action-remove"
                  onClick={() => onRemove(peer)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
