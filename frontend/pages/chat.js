import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  IconSettings,
  IconPlus,
  IconChatBubble,
  IconMore,
  IconChatEmpty,
} from "../components/icons";

export default function Chat() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <Navbar>
      <div className="chat-page">

        {/* ================= LEFT CHAT SIDEBAR ================= */}
        <aside className="chat-sidebar">

          {/* Header */}
          <div className="chat-sidebar-header">

            <button className="chat-title-button">
              <span>Chat</span>
              <span className="chat-title-arrow">⌄</span>
            </button>

            <div className="chat-header-actions">

              <button
                className="chat-header-icon"
                title="Chat settings"
              >
                <IconSettings size={20} />
              </button>

              <button
                className="chat-new-button"
                title="New chat"
              >
                <IconPlus size={25} />
              </button>

            </div>
          </div>

          {/* Filter buttons */}
          <div className="chat-filters">

            <button
              className={`chat-filter ${
                activeFilter === "All" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("All")}
            >
              All
            </button>

            <button
              className={`chat-filter ${
                activeFilter === "Mentions" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("Mentions")}
            >
              @
            </button>

            <button
              className={`chat-filter ${
                activeFilter === "Chats" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("Chats")}
            >
              <IconChatBubble size={19} />
            </button>

            <button
              className={`chat-filter ${
                activeFilter === "More" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("More")}
            >
              <IconMore size={18} />
            </button>

          </div>

          {/* Sidebar sections */}
          <div className="chat-sidebar-sections">

            <button className="chat-section-item">
              <span className="chat-section-chevron">›</span>
              <span>Apps</span>
            </button>

            <button className="chat-section-item">
              <span className="chat-section-chevron">›</span>
              <span>Chats &amp; Channels</span>
            </button>

            <button className="chat-section-item">
              <span className="chat-section-chevron">›</span>
              <span>Starred</span>
            </button>

            <button className="chat-section-item">
              <span className="chat-section-chevron">›</span>
              <span>Shared spaces</span>
            </button>

          </div>

        </aside>

        {/* ================= RIGHT CHAT AREA ================= */}
        <main className="chat-main">

          <div className="chat-empty-state">

            <div className="chat-empty-icon">
                <IconChatEmpty size={260} />
            </div>

            <p>
              Start chatting by clicking or creating a chat in the left
              sidebar.
            </p>

          </div>

        </main>

      </div>
    </Navbar>
  );
}