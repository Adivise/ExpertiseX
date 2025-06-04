import { useState, useEffect } from 'react';
import { Logins } from './components';
import { COMPONENT_MAP } from './constants/componentMap';
import { useTabs } from './hooks/useTabs';
import { useSessionStorage } from './hooks/useSessionStorage';
import { useBotOperations } from './hooks/useBotOperations';
import Navbar from './module/Navbar';
import Sidebar from './module/Sidebar';
import Footer from './module/Footer';
import './assets/styles/main.css';

/**
 * Main App component that manages the application state and layout
 * @returns {JSX.Element} The rendered App component
 */
const App = () => {
    // State management
    const [activeComponent, setActiveComponent] = useState('logins');
    const tabs = useTabs();
    const sessionStorage = useSessionStorage();
    const { handleLogout } = useBotOperations(tabs, tabs.removeTab, tabs.setCurrentTab);

    // Effects
    useEffect(() => {
        const setupWindowCloseHandler = () => {
            window.electronAPI.onWindowClose(async () => {
                await handleLogout(tabs.currentTab);
            });
        };

        const loadActiveBots = async () => {
            try {
                const activeBots = await window.electronAPI.getActiveBots();
                if (activeBots && Array.isArray(activeBots)) {
                    tabs.setActiveTabs(activeBots);
                }
            } catch (error) {
                console.error('Error loading active bots:', error);
            }
        };

        setupWindowCloseHandler();
        loadActiveBots();
    }, []);

    // Event handlers
    const handleLoginSuccess = (loggedInUsername, loggedInUserId, port, avatar) => {
        const newTab = {
            id: loggedInUserId,
            username: loggedInUsername,
            userId: loggedInUserId,
            port: port,
            avatar: avatar
        };

        tabs.addTab(newTab);
        setActiveComponent('console');
        sessionStorage.setSessionData(loggedInUserId, loggedInUsername, port, avatar);
    };

    const handleNewTab = () => {
        tabs.setCurrentTab(null);
        setActiveComponent('logins');
    };

    const handleTabSwitch = (tabId) => {
        tabs.switchTab(tabId);
        setActiveComponent('console');
    };

    // Render helpers
    const renderMainContent = () => {
        if (!tabs.currentTab) {
            return <Logins onLoginSuccess={handleLoginSuccess} />;
        }

        const ActiveComponent = COMPONENT_MAP[activeComponent];
        return ActiveComponent ? <ActiveComponent userId={tabs.currentTab} /> : null;
    };

    const currentUsername = tabs.tabs.find(tab => tab.userId === tabs.currentTab)?.username;
    const currentAvatar = tabs.tabs.find(tab => tab.userId === tabs.currentTab)?.avatar;
    
    return (
        <div className="App">
            <Navbar 
                username={currentUsername} 
                userId={tabs.currentTab}
                tabs={tabs}
                removeTab={tabs.removeTab}
                setCurrentTab={tabs.setCurrentTab}
                avatar={currentAvatar}
            />
            <div className="dashboard">
                {tabs.currentTab && (
                    <Sidebar 
                        setActiveComponent={setActiveComponent} 
                        setIsLoggedIn={() => handleLogout(tabs.currentTab)}
                        activeComponent={activeComponent}
                    />
                )}
                <div className="main-content">
                    {renderMainContent()}
                </div>
            </div>
            <Footer 
                tabs={tabs.tabs}
                currentTab={tabs.currentTab}
                onTabSwitch={handleTabSwitch}
                onTabClose={handleLogout}
                onNewTab={handleNewTab}
            />
        </div>
    );
};

export default App;