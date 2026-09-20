import Navbar from "../components/Navbar";

export default function Hub() {
  return (
    <Navbar>
      <div className="meetings-page">
        <div className="meetings-header">
          <div>
            <h1>Hub</h1>
            <p>Access your Zoom tools and resources.</p>
          </div>
        </div>

        <div className="hub-grid">

          <div className="hub-card">
            <div className="hub-icon">📅</div>
            <h3>Meetings</h3>
            <p>View and manage your meetings.</p>
          </div>

          <div className="hub-card">
            <div className="hub-icon">💬</div>
            <h3>Chat</h3>
            <p>Communicate with your team.</p>
          </div>

          <div className="hub-card">
            <div className="hub-icon">📋</div>
            <h3>Resources</h3>
            <p>Keep your meeting resources organized.</p>
          </div>

          <div className="hub-card">
            <div className="hub-icon">🎥</div>
            <h3>Video Meetings</h3>
            <p>Start or join a video meeting.</p>
          </div>

        </div>
      </div>
    </Navbar>
  );
}