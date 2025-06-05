import React from 'react';
import '../assets/styles/titlebar.css';

const TitleBar = ({ tabs, onTabClose }) => {
  const handleMinimize = () => {
    window.electronAPI.windowMinimize();
  };

  const handleMaximize = () => {
    window.electronAPI.windowMaximize();
  };

  const handleClose = async () => {
    // Logout all active bots
    if (tabs && tabs.length > 0) {
      for (const tab of tabs) {
        await onTabClose(tab.userId);
      }
    }
    // Close the window after all bots are logged out
    window.electronAPI.windowClose();
  };

  return (
    <div className="titlebar">
      <div className="titlebar-drag-region">
        <div className="window-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="titlebar-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          ExpertiseX
        </div>
      </div>
      <div className="window-controls">
        <button className="window-control minimize" onClick={handleMinimize} title="Minimize">
          <svg width="10" height="1" viewBox="0 0 10 1">
            <rect width="10" height="1" fill="currentColor" />
          </svg>
        </button>
        <button className="window-control maximize" onClick={handleMaximize} title="Maximize">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect width="9" height="9" x="0.5" y="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <button className="window-control close" onClick={handleClose} title="Close">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M1 1L9 9M1 9L9 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar; 