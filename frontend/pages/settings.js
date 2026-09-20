import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Settings() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("General");
  const [theme, setTheme] = useState("Classic");
  const [autoCall, setAutoCall] = useState(false);

  const tabs = [
    {
      name: "General",
      icon: "⚙",
    },
    {
      name: "Audio",
      icon: "🎧",
    },
    {
      name: "Video",
      icon: "▣",
    },
    {
      name: "Chat",
      icon: "▰",
    },
  ];

  function closeSettings() {
    router.push("/");
  }

  return (
    <Navbar userName="Saloni">

      <div className="settings-page">

        {/* Settings window */}
        <div className="settings-window">

          {/* ================= HEADER ================= */}

          <div className="settings-header">

            <div className="settings-title">
              Settings
            </div>

            <button
              className="settings-close"
              onClick={closeSettings}
              title="Close"
            >
              ×
            </button>

          </div>


          {/* ================= BODY ================= */}

          <div className="settings-body">

            {/* LEFT SETTINGS NAVIGATION */}

            <aside className="settings-sidebar">

              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`settings-nav-item ${
                    activeTab === tab.name ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >

                  <span
                    className={`settings-nav-icon ${tab.name.toLowerCase()}`}
                  >
                    {tab.icon}
                  </span>

                  <span>
                    {tab.name}
                  </span>

                </button>
              ))}

            </aside>


            {/* ================= CONTENT ================= */}

            <main className="settings-content">

              {/* ================= GENERAL ================= */}

              {activeTab === "General" && (
                <div>

                  <section className="settings-section">

                    <h2>
                      Theme
                    </h2>

                    <div className="settings-description">
                      Only applied when the system is using light mode,
                      <span className="learn-more">
                        learn more
                      </span>

                      <span className="question-icon">
                        ?
                      </span>
                    </div>


                    {/* THEMES */}

                    <div className="theme-options">

                      <button
                        className={`theme-option ${
                          theme === "Classic" ? "selected" : ""
                        }`}
                        onClick={() => setTheme("Classic")}
                      >
                        <div className="theme-circle classic">
                          <div className="classic-dark"></div>
                        </div>

                        <span>
                          Classic
                        </span>
                      </button>


                      <button
                        className={`theme-option ${
                          theme === "Bloom" ? "selected" : ""
                        }`}
                        onClick={() => setTheme("Bloom")}
                      >
                        <div className="theme-circle bloom"></div>

                        <span>
                          Bloom
                        </span>
                      </button>


                      <button
                        className={`theme-option ${
                          theme === "Agave" ? "selected" : ""
                        }`}
                        onClick={() => setTheme("Agave")}
                      >
                        <div className="theme-circle agave"></div>

                        <span>
                          Agave
                        </span>
                      </button>


                      <button
                        className={`theme-option ${
                          theme === "Rose" ? "selected" : ""
                        }`}
                        onClick={() => setTheme("Rose")}
                      >
                        <div className="theme-circle rose"></div>

                        <span>
                          Rose
                        </span>
                      </button>

                    </div>

                  </section>


                  {/* ================= NAVIGATION ================= */}

                  <section className="settings-section navigation-section">

                    <h2>
                      Navigation
                    </h2>

                    <div className="settings-description">
                      Items are added to toolbar when accessed
                    </div>

                    <button className="reset-default">
                      Reset to default
                    </button>

                  </section>


                  {/* ================= AUTO CALL ================= */}

                  <section className="settings-section auto-call-section">

                    <h2>
                      Auto-call
                    </h2>

                    <label className="checkbox-row">

                      <input
                        type="checkbox"
                        checked={autoCall}
                        onChange={(e) =>
                          setAutoCall(e.target.checked)
                        }
                      />

                      <span>
                        Automatically receive a call when a scheduled
                        meeting starts
                      </span>

                    </label>

                  </section>

                </div>
              )}


              {/* ================= AUDIO ================= */}

              {activeTab === "Audio" && (
                <div className="simple-settings-page">

                  <h2>Audio</h2>

                  <div className="setting-card">

                    <h3>Microphone</h3>

                    <p>
                      Select your microphone and adjust your input
                      volume.
                    </p>

                    <select>
                      <option>Default Microphone</option>
                      <option>Built-in Microphone</option>
                    </select>

                  </div>


                  <div className="setting-card">

                    <h3>Speaker</h3>

                    <p>
                      Select the speaker you want to use for meetings.
                    </p>

                    <select>
                      <option>Default Speaker</option>
                      <option>Built-in Speakers</option>
                    </select>

                  </div>

                </div>
              )}


              {/* ================= VIDEO ================= */}

              {activeTab === "Video" && (
                <div className="simple-settings-page">

                  <h2>Video</h2>

                  <div className="setting-card">

                    <h3>Camera</h3>

                    <p>
                      Select the camera used for meetings.
                    </p>

                    <select>
                      <option>Default Camera</option>
                      <option>Integrated Camera</option>
                    </select>

                  </div>

                  <label className="checkbox-row video-setting">

                    <input type="checkbox" defaultChecked />

                    <span>
                      Automatically turn on video when joining a meeting
                    </span>

                  </label>

                </div>
              )}


              {/* ================= CHAT ================= */}

              {activeTab === "Chat" && (
                <div className="simple-settings-page">

                  <h2>Chat</h2>

                  <div className="setting-card">

                    <h3>Chat settings</h3>

                    <label className="checkbox-row">

                      <input
                        type="checkbox"
                        defaultChecked
                      />

                      <span>
                        Show desktop notifications for new messages
                      </span>

                    </label>

                    <label className="checkbox-row">

                      <input
                        type="checkbox"
                        defaultChecked
                      />

                      <span>
                        Show message previews
                      </span>

                    </label>

                  </div>

                </div>
              )}

            </main>

          </div>

        </div>

      </div>

    </Navbar>
  );
}