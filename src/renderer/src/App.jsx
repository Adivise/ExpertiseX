import { useState, useEffect } from 'react';
import { 
    PlaySkip, PlayTop, AutoPlay, Join, Leave, Play, Queue, 
    GoLive, Loop, Skip, Clear, Previous, Pause, TwentyFourSeven, 
    Volume, Shuffle, Replay, EndLive, Bass, Normal, Earrape, 
    BassBoost, China, Chipmunk, Dance, Darthvader, EightD, 
    Jazz, Nightcore, Pop, SlowMotion, Soft, SuperBass, 
    Television, TrebleBass, Tremolo, Vaporwave, Vibrate, 
    Vibrato, Logins, Console 
} from './components';
import Navbar from './module/Navbar';
import Sidebar from './module/Sidebar';
import Footer from './module/Footer';
import './assets/Style.css';
import axios from 'axios';

// Component mapping for better maintainability
const COMPONENT_MAP = {
    console: Console,
    join: Join,
    leave: Leave,
    play: Play,
    autoplay: AutoPlay,
    queue: Queue,
    golive: GoLive,
    loop: Loop,
    skip: Skip,
    clear: Clear,
    previous: Previous,
    pause: Pause,
    twentyfourseven: TwentyFourSeven,
    volume: Volume,
    shuffle: Shuffle,
    replay: Replay,
    endlive: EndLive,
    bass: Bass,
    normal: Normal,
    earrape: Earrape,
    bassboost: BassBoost,
    china: China,
    chipmunk: Chipmunk,
    dance: Dance,
    darthvader: Darthvader,
    eightd: EightD,
    jazz: Jazz,
    nightcore: Nightcore,
    pop: Pop,
    slowmotion: SlowMotion,
    soft: Soft,
    superbass: SuperBass,
    television: Television,
    treblebass: TrebleBass,
    tremolo: Tremolo,
    vaporwave: Vaporwave,
    vibrate: Vibrate,
    vibrato: Vibrato,
    playskip: PlaySkip,
    playtop: PlayTop
};

// Custom hook for managing tabs
const useTabs = () => {
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

// Custom hook for managing session storage
const useSessionStorage = () => {
    const setSessionData = (userId, username, port) => {
        sessionStorage.setItem(`isLoggedIn_${userId}`, 'true');
        sessionStorage.setItem(`port_${userId}`, port.toString());
        sessionStorage.setItem(`username_${userId}`, username);
    };

    const clearSessionData = (userId) => {
        sessionStorage.removeItem(`port_${userId}`);
        sessionStorage.removeItem(`isLoggedIn_${userId}`);
        sessionStorage.removeItem(`username_${userId}`);
    };

    const getPort = (userId) => sessionStorage.getItem(`port_${userId}`);

    return {
        setSessionData,
        clearSessionData,
        getPort
    };
};

// Custom hook for managing bot operations
const useBotOperations = (tabs, removeTab, setCurrentTab) => {
    const handleLogout = async (userId) => {
        if (!userId) return;

        try {
            const port = sessionStorage.getItem(`port_${userId}`);
            if (port) {
                try {
                    // Try to send logout request to the server
                    await axios.post(`http://localhost:${port}/logout`);
                } catch (error) {
                    console.warn('Server logout request failed:', error.message);
                    // Continue with cleanup even if server request fails
                }

                try {
                    // Try to stop the bot
                    await window.electronAPI.stopBot(userId);
                } catch (error) {
                    console.warn('Bot stop request failed:', error.message);
                    // Continue with cleanup even if bot stop fails
                }
                
                // Clear session data
                sessionStorage.removeItem(`port_${userId}`);
                sessionStorage.removeItem(`isLoggedIn_${userId}`);
                sessionStorage.removeItem(`username_${userId}`);
            }
        } catch (error) {
            console.error('Error during logout cleanup:', error);
        } finally {
            // Always update UI state regardless of server/bot status
            removeTab(userId);
            if (tabs.currentTab === userId) {
                setCurrentTab(null);
            }
        }
    };

    return { handleLogout };
};

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
    const handleLoginSuccess = (loggedInUsername, loggedInUserId, port) => {
        const newTab = {
            id: loggedInUserId,
            username: loggedInUsername,
            userId: loggedInUserId,
            port: port
        };

        tabs.addTab(newTab);
        setActiveComponent('console');
        sessionStorage.setSessionData(loggedInUserId, loggedInUsername, port);
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

    return (
        <div className="App">
            <Navbar username={currentUsername} userId={tabs.currentTab} />
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