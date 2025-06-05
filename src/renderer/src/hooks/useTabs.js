import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing tabs in the application
 * @returns {Object} Tab management functions and state
 */
export const useTabs = () => {
    const [tabs, setTabs] = useState([]);
    const [activeTabs, setActiveTabs] = useState([]);
    const [currentTab, setCurrentTab] = useState(null);

    const addTab = useCallback((tab) => {
        setTabs(prev => [...prev, tab]);
        setActiveTabs(prev => [...prev, tab.userId]);
        setCurrentTab(tab.userId);
    }, []);

    const removeTab = useCallback((userId) => {
        setTabs(prev => prev.filter(tab => tab.userId !== userId));
        setActiveTabs(prev => prev.filter(id => id !== userId));
        if (currentTab === userId) {
            setCurrentTab(null);
        }
    }, [currentTab]);

    const switchTab = useCallback((tabId) => {
        setCurrentTab(tabId);
    }, []);

    const setActiveTabsCallback = useCallback((newActiveTabs) => {
        setActiveTabs(newActiveTabs);
    }, []);

    const setCurrentTabCallback = useCallback((newCurrentTab) => {
        setCurrentTab(newCurrentTab);
    }, []);

    const tabState = useMemo(() => ({
        tabs,
        activeTabs,
        currentTab,
        addTab,
        removeTab,
        switchTab,
        setCurrentTab: setCurrentTabCallback,
        setActiveTabs: setActiveTabsCallback
    }), [tabs, activeTabs, currentTab, addTab, removeTab, switchTab, setCurrentTabCallback, setActiveTabsCallback]);

    return tabState;
}; 