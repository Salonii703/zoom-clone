export function IconVideoCamera({ size = 28, off = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
      <path d="M15.5 10.5 21.5 7v10l-6-3.5" />

      {off && <path d="M3 20L21 4" />}
    </svg>
  );
}
export function IconChatEmpty({ size = 260 }) {
  return (
    <svg
      viewBox="0 0 260 220"
      width={size}
      height={(size * 220) / 260}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Back speech bubble */}
      <path
        d="M106 76C73 76 46 100 46 130C46 157 67 179 94 183L91 207L112 190C145 187 166 165 166 137C166 103 140 76 106 76Z"
        fill="#E8F1FF"
      />

      {/* Main speech bubble */}
      <path
        d="M163 20C111 20 79 55 79 99C79 137 105 166 142 174C153 176 160 182 159 193L158 207C158 212 164 215 168 211L184 195C216 181 235 147 235 105C235 58 206 20 163 20Z"
        fill="#82B4F5"
      />

      {/* Dots */}
      <circle
        cx="133"
        cy="105"
        r="14"
        fill="white"
      />

      <circle
        cx="164"
        cy="105"
        r="14"
        fill="white"
      />

      <circle
        cx="195"
        cy="105"
        r="14"
        fill="white"
      />
    </svg>
  );
}

export function IconLink({ size = 19 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.7 4.8a3.6 3.6 0 0 1 5.1 5.1L16 11.5" />
      <path d="M13 17.5 11.3 19.2a3.6 3.6 0 0 1-5.1-5.1L8 12.5" />
    </svg>
  );
}

export function IconCalendar({ size = 19, withDots = true }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      {withDots && <path d="M8 14h2M14 14h2M8 17.5h2" />}
    </svg>
  );
}

export function IconShareScreen({ size = 19 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4.5" width="19" height="12.5" rx="2" />
      <path d="M12 8v6M9 11l3-3 3 3" />
      <path d="M8.5 21.5h7" />
    </svg>
  );
}

export function IconChevronLeft({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 6 8.5 12l6 6" />
    </svg>
  );
}

export function IconChevronRight({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 6l6 6-6 6" />
    </svg>
  );
}

export function IconMoreDots({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

export function IconPlus({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconUmbrella({ size = 46 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="var(--zoom-text-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C7 3 3 7.5 3 12h18C21 7.5 17 3 12 3Z" />
      <path d="M12 12v7.5a1.8 1.8 0 0 1-3.6 0" />
      <path d="M12 3V1.5" />
    </svg>
  );
}

export function IconMic({ size = 21, off = false }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21M8.5 21h7" />
      {off && <path d="M4 4 20 20" />}
    </svg>
  );
}

export function IconSecurity({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 4.5 5.5v5.5c0 5 3.2 8.7 7.5 10.5 4.3-1.8 7.5-5.5 7.5-10.5V5.5Z" />
      <path d="M8.8 12.2 11 14.4l4.3-4.3" />
    </svg>
  );
}

export function IconPeople({ size = 21 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.8" />
      <path d="M18 13.6c2.4.5 3.8 2.3 3.8 5.4" />
    </svg>
  );
}

export function IconChatBubble({ size = 21 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5h16v10.5H9.5L5 20v-4H4Z" />
    </svg>
  );
}

export function IconRecordDot({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconMutedBadge({ size = 13, color = "#fff" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21M8.5 21h7" />
      <path d="M4 4 20 20" />
    </svg>
  );
}

export function IconHome({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function IconMeetings({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
      <path d="M15.5 10.5 21 7v10l-5.5-3.5" />
    </svg>
  );
}

export function IconChat({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5h16v10H9l-4.5 4v-4H4Z" />
    </svg>
  );
}

export function IconHub({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconMore({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function IconSettings({ size = 19 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H10a1.65 1.65 0 0 0 1-1.51V4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V10a1.65 1.65 0 0 0 1.51 1H20a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function IconSearch({ size = 17 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function IconHelp({ size = 17 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.86.83c0 1.67-2.36 1.67-2.36 3.34" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}
