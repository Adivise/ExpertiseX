import { useState } from 'react';

/**
 * Custom hook for managing tabs in the application
 * @returns {Object} Tab management functions and state
 */
export const useTabs = () => {
    const [tabs, setTabs] = useState([]);
    const [activeTabs, setActiveTabs] = useState([]);
    const [currentTab, setCurrentTab] = useState(null);

    const addTab = (tab) => {
        setTabs(prev => [...prev, tab]);
        setActiveTabs(prev => [...prev, tab.userId]);
        setCurrentTab(tab.userId);
    };

    const removeTab = (userId) => {
        setTabs(prev => prev.filter(tab => tab.userId !== userId));
        setActiveTabs(prev => prev.filter(id => id !== userId));
        if (currentTab === userId) {
            setCurrentTab(null);
        }
    };

    const switchTab = (tabId) => {
        setCurrentTab(tabId);
    };

    return {
        tabs,
        activeTabs,
        currentTab,
        addTab,
        removeTab,
        switchTab,
        setCurrentTab,
        setActiveTabs
    };
}; 