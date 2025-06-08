import { useState, useEffect, useRef } from 'react';
import { Logins } from './components';
import { COMPONENT_MAP } from './constants/componentMap';
import { useTabs } from './hooks/useTabs';
import { useSessionStorage } from './hooks/useSessionStorage';
import { useBotOperations } from './hooks/useBotOperations';
import { useSSEConnection } from './hooks/useSSEConnection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './module/Navbar';
import Sidebar from './module/Sidebar';
import Footer from './module/Footer';
import TitleBar from './module/TitleBar';

/**
 * Main App component that manages the application state and layout
 * @returns {JSX.Element} The rendered App component
 */
const App = () => {
    // State management
    const [activeComponents, setActiveComponents] = useState({});
    const tabs = useTabs();
    const sessionStorageSet = useSessionStorage();
    const { handleLogout } = useBotOperations(tabs, tabs.removeTab, tabs.setCurrentTab);
    const { connect: connectSSE, disconnect: disconnectSSE } = useSSEConnection();
    const connectSSERef = useRef(connectSSE);

    // Update ref when connectSSE changes
    useEffect(() => {
        connectSSERef.current = connectSSE;
    }, [connectSSE]);

    // Load active bots on initial mount
    useEffect(() => {
        let isMounted = true;
        const loadActiveBots = async () => {
            try {
                const activeBots = await window.electronAPI.getActiveBots();
                if (!isMounted) return;
                
                if (activeBots && Array.isArray(activeBots) && activeBots.length > 0) {
                    tabs.setActiveTabs(activeBots);
                    activeBots.forEach(bot => {
                        if (bot.userId) {
                            connectSSERef.current(bot.userId);
                        }
                    });
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error loading active bots:', error);
                }
            }
        };
        loadActiveBots();
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array since we're using ref

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
        setActiveComponents(prev => ({
            ...prev,
            [loggedInUserId]: 'console'
        }));
        sessionStorageSet.setSessionData(loggedInUserId, loggedInUsername, port);
        connectSSERef.current(loggedInUserId);
    };

    const handleNewTab = () => {
        tabs.setCurrentTab(null);
    };

    const handleTabSwitch = (tabId) => {
        tabs.switchTab(tabId);
    };

    const handleComponentChange = (component) => {
        if (tabs.currentTab) {
            setActiveComponents(prev => ({
                ...prev,
                [tabs.currentTab]: component
            }));
        }
    };

    // Handle logout - unmount SSE connection for the specific bot
    const handleLogoutWithSSE = async (userId) => {
        disconnectSSE(userId);
        await handleLogout(userId);
        setActiveComponents(prev => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
        });
    };

    // Render helpers
    const renderMainContent = () => {
        if (!tabs.currentTab) {
            return <Logins onLoginSuccess={handleLoginSuccess} />;
        }

        const activeComponent = activeComponents[tabs.currentTab] || 'console';
        const ActiveComponent = COMPONENT_MAP[activeComponent];
        return ActiveComponent ? <ActiveComponent userId={tabs.currentTab} /> : null;
    };

    const currentUsername = tabs.tabs.find(tab => tab.userId === tabs.currentTab)?.username;
    const currentAvatar = tabs.tabs.find(tab => tab.userId === tabs.currentTab)?.avatar;
    
    return (
        <div className="App">
            <TitleBar 
                tabs={tabs.tabs}
                onTabClose={handleLogoutWithSSE}
            />
            <Navbar 
                username={currentUsername} 
                userId={tabs.currentTab}
                tabs={tabs}
                removeTab={tabs.removeTab}
                setCurrentTab={tabs.setCurrentTab}
                avatar={currentAvatar}
                onLogout={handleLogoutWithSSE}
            />
            <div className="dashboard">
                {tabs.currentTab && (
                    <Sidebar 
                        setActiveComponent={handleComponentChange} 
                        setIsLoggedIn={() => handleLogoutWithSSE(tabs.currentTab)}
                        activeComponent={activeComponents[tabs.currentTab] || 'console'}
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
                onTabClose={handleLogoutWithSSE}
                onNewTab={handleNewTab}
            />
            <ToastContainer />
        </div>
    );
};

export default App;