"use client";

import { usePathname, useRouter } from "next/navigation";

interface MobileNavProps {
  onShowChat?: () => void;
  onShowCards?: () => void;
  onShowProfile?: () => void;
  currentView?: "cards" | "chat" | "profile";
}

export default function MobileNav({
  onShowChat,
  onShowCards,
  onShowProfile,
  currentView = "cards",
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleProfileClick = () => {
    if (pathname === "/app/dashboard" && onShowProfile) {
      onShowProfile();
    } else {
      router.push("/app/profile");
    }
  };

  const handleChatClick = () => {
    if (onShowChat) {
      onShowChat();
    }
  };

  const handleCardsClick = () => {
    if (onShowCards) {
      onShowCards();
    }
  };

  return (
    <nav className="mobile-nav">
      {/* Cards Button */}
      <button
        className={`mobile-nav-btn ${currentView === "cards" ? "active" : ""}`}
        onClick={handleCardsClick}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Discover</span>
      </button>

      {/* Chat Button */}
      <button
        className={`mobile-nav-btn ${currentView === "chat" ? "active" : ""}`}
        onClick={handleChatClick}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Chats</span>
        <span className="badge-count">2</span>
      </button>

      {/* Profile Button */}
      <button
        className={`mobile-nav-btn ${
          currentView === "profile" ? "active" : ""
        }`}
        onClick={handleProfileClick}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profile</span>
      </button>

      <style jsx>{`
        .mobile-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e7eb;
            padding: 8px 16px 12px;
            z-index: 1000;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
          }

          .mobile-nav-btn {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 8px 12px;
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            border-radius: 8px;
          }

          .mobile-nav-btn:active {
            background: #f3f4f6;
          }

          .mobile-nav-btn.active {
            color: #ff655c;
          }

          .mobile-nav-btn svg {
            width: 24px;
            height: 24px;
            stroke-width: 2;
          }

          .mobile-nav-btn.active svg {
            stroke-width: 2.5;
          }

          .mobile-nav-btn span {
            font-size: 11px;
            font-weight: 500;
          }

          .badge-count {
            position: absolute;
            top: 4px;
            right: 20%;
            background: #ff655c;
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 700;
            min-width: 18px;
            text-align: center;
          }
        }
      `}</style>
    </nav>
  );
}
