import React, { useRef, useEffect } from 'react';
import '../assets/Style.css';

const Footer = ({ tabs, currentTab, onTabSwitch, onTabClose, onNewTab }) => {
    const tabsContainerRef = useRef(null);

    // Scroll active tab into view when it changes
    useEffect(() => {
        if (tabsContainerRef.current && currentTab) {
            const activeTab = tabsContainerRef.current.querySelector('.active');
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentTab]);

    return (
        <div className="footer-tabs">
            <div className="tabs-container" ref={tabsContainerRef}>
                {tabs.map(tab => (
                    <div
                        key={tab.userId}
                        className={`tab ${currentTab === tab.userId ? 'active' : ''}`}
                        onClick={() => onTabSwitch(tab.userId)}
                        title={tab.username}
                    >
                        <span>{tab.username}</span>
                        <button
                            className="close-tab"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tab.userId);
                            }}
                            title="Close tab"
                        >
                            <span className="close-tab-text">×</span>
                        </button>
                    </div>
                ))}
                <button 
                    className="new-tab-button"
                    onClick={onNewTab}
                    title="Add new account"
                >
                    <span className="new-tab-icon">+</span>
                </button>
            </div>
        </div>
    );
};

export default Footer; 