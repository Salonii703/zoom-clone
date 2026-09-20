/* In-meeting chat panel — local-only (no backend persistence, no
   real-time delivery to other participants). Extracted out of the
   meeting room page so it can be tested/reused independently. */
export default function ChatPanel({
  messages,
  chatMessage,
  onChatMessageChange,
  onSend,
  onKeyDown,
  onClose,
}) {
  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>Chat</span>
        <button className="chat-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="chat-empty">No messages yet</div>
        ) : (
          messages.map((message, index) => (
            <div className="chat-message" key={index}>
              <strong>{message.sender}</strong>
              <div>{message.text}</div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={chatMessage}
          onChange={(e) => onChatMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
}
