import Navbar from "../components/Navbar";

export default function More() {
  return (
    <Navbar>
      <div className="meetings-page">

        <div className="meetings-header">
          <div>
            <h1>More</h1>
            <p>Additional Zoom features.</p>
          </div>
        </div>

        <div className="hub-grid">

          <div className="hub-card">
            <div className="hub-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Manage your application preferences.</p>
          </div>

          <div className="hub-card">
            <div className="hub-icon">❓</div>
            <h3>Help</h3>
            <p>Get help using Zoom Clone.</p>
          </div>

          <div className="hub-card">
            <div className="hub-icon">👤</div>
            <h3>Profile</h3>
            <p>Manage your profile information.</p>
          </div>

          <div className="hub-card">
            <div className="hub-icon">ℹ️</div>
            <h3>About</h3>
            <p>Information about this Zoom Clone.</p>
          </div>

        </div>

      </div>
    </Navbar>
  );
}