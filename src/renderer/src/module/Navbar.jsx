import { useState } from "react";
import Settings from "../components/Tokens/Settings";
import { useBotOperations } from "../hooks/useBotOperations";

const Navbar = ({ username, userId, tabs, removeTab, setCurrentTab, avatar }) => {
  const version = window.electronAPI.getVersion();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { handleLogout } = useBotOperations(tabs, removeTab, setCurrentTab);
  
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1>ExpertiseX - SelfBot Music</h1>
        <span className="version-badge">v{version}</span>
      </div>
      <div className="navbar-right">
        {username ? (
          <div className="user-section">
            <div className="user-info">
              <span className="user-avatar">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={`${username}'s avatar`} 
                    className="avatar-image"
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </span>
              <div className="user-details">
                <span className="username">{username}</span>
                <span className="user-id">ID: {userId}</span>
              </div>
            </div>
            <button className="logout-button" onClick={() => handleLogout(userId)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        )}
      </div>
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSave={console.log} />
    </div>
  );
};

export default Navbar;