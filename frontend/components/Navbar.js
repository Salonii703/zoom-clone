import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  IconHome,
  IconMeetings,
  IconChat,
  IconCalendar,
  IconHub,
  IconMore,
  IconSettings,
  IconSearch,
  IconHelp,
  IconChevronLeft,
  IconChevronRight,
} from "./icons";

function IconScheduler() {
  return <IconCalendar size={20} withDots={false} />;
}

const NAV_ITEMS = [
  { label: "Home", path: "/", Icon: IconHome },
  { label: "Meetings", path: "/meetings", Icon: IconMeetings },
  { label: "Chat", path: "/chat", Icon: IconChat },
  { label: "Scheduler", path: "/schedule", Icon: IconScheduler },
  { label: "Hub", path: "/hub", Icon: IconHub },
  { label: "More", path: "/more", Icon: IconMore },
];

export default function Navbar({
  userName = "Saloni",
  children,
}) {
  const router = useRouter();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initial = userName.charAt(0).toUpperCase();

  function handleLogout() {
    localStorage.removeItem("zoomclone_user");
    setShowProfileMenu(false);
    router.push("/login");
  }

  return (
    <div className="zoom-app">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="zoom-topbar">

        {/* Logo */}
        <div className="zoom-logo">
          <div className="zoom-logo-small">
            zoom
          </div>

          <div className="zoom-logo-large">
            Workplace
          </div>
        </div>

        {/* Navigation controls */}
        <div className="zoom-topbar-center">

          <button
            type="button"
            className="zoom-top-nav-btn"
            title="Back"
            onClick={() => router.back()}
          >
            <IconChevronLeft size={20} />
          </button>

          <button
            type="button"
            className="zoom-top-nav-btn"
            title="Forward"
            onClick={() => router.forward()}
          >
            <IconChevronRight size={20} />
          </button>

          <button
            type="button"
            className="zoom-top-nav-btn"
            title="Refresh"
            onClick={() => window.location.reload()}
          >
            ↻
          </button>

        </div>

        {/* Search */}
        <div className="zoom-search">
          <IconSearch size={18} />
          <span>Search Ctrl+K</span>
        </div>

        {/* Right side */}
        <div className="zoom-topbar-right">

          <button
            type="button"
            className="zoom-top-icon"
            title="Settings"
          >
            <IconSettings />
          </button>

          <button
            type="button"
            className="zoom-top-icon"
            title="Help"
          >
            <IconHelp />
          </button>

          <div className="zoom-profile-wrapper">

            <button
              type="button"
              className="zoom-profile"
              title={userName}
              onClick={() =>
                setShowProfileMenu((prev) => !prev)
              }
            >
              {initial}
            </button>

            {showProfileMenu && (
              <div className="zoom-profile-menu">

                <div className="profile-user-info">
                  <strong>{userName}</strong>
                  <span>
                    salonivishvakarma703@gmail.com
                  </span>
                </div>

                <button className="profile-menu-item">
                  ⚙️ Settings
                </button>

                <button className="profile-menu-item">
                  <span className="status-dot available"></span>
                  Available
                </button>

                <button className="profile-menu-item">
                  <span className="status-dot busy"></span>
                  Busy
                </button>

                <button className="profile-menu-item">
                  <span className="status-dot dnd"></span>
                  Do Not Disturb
                </button>

                <button className="profile-menu-item">
                  <span className="status-dot away"></span>
                  Away
                </button>

                <div className="profile-menu-divider"></div>

                <button className="profile-menu-item">
                  My Profile
                </button>

                <button className="profile-menu-item">
                  About
                </button>

                <button className="profile-menu-item">
                  Help
                </button>

                <button className="profile-menu-item">
                  Language
                  <span className="language-value">
                    English
                  </span>
                </button>

                <div className="profile-menu-divider"></div>

                <button
                  type="button"
                  className="profile-menu-item logout-item"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>

              </div>
            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          BELOW TOP BAR
      ===================================================== */}

      <div className="zoom-body">

        {/* ===================================================
            LEFT SIDEBAR
        =================================================== */}

        <aside className="zoom-sidebar">

          <nav className="zoom-sidebar-nav">

            {NAV_ITEMS.map(
              ({ label, path, Icon }) => {

                const isActive =
                  router.pathname === path;

                return (
                  <Link
                    key={label}
                    href={path}
                    className={`zoom-sidebar-link ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <span className="zoom-sidebar-icon">
                      <Icon />
                    </span>

                    <span className="zoom-sidebar-label">
                      {label}
                    </span>
                  </Link>
                );
              }
            )}

          </nav>


          {/* Settings at bottom */}

          <button
            type="button"
            className="zoom-sidebar-link zoom-sidebar-settings"
          >
            <span className="zoom-sidebar-icon">
              <IconSettings />
            </span>

            <span className="zoom-sidebar-label">
              Settings
            </span>
          </button>

        </aside>


        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="zoom-main">
          <div className="zoom-content">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}