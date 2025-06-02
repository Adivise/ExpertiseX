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

const App = () => {
    // State management
    const [activeComponent, setActiveComponent] = useState('logins');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    // Effects
    useEffect(() => {
        setupWindowCloseHandler();
        checkLoginState();
    }, []);

    // Initialization functions
    const setupWindowCloseHandler = () => {
        window.electronAPI.onWindowClose(async () => {
            await handleLogout();
        });
    };

    const checkLoginState = () => {
        const storedLoginState = sessionStorage.getItem('isLoggedIn');
        if (storedLoginState === 'true') {
            setIsLoggedIn(true);
            setActiveComponent('console');
        }
    };

    // Event handlers
    const handleLogout = async () => {
        const port = sessionStorage.getItem('port');
        if (port) {
            try {
                await axios.post(`http://localhost:${port}/logout`);
                clearSession();
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }
    };

    const clearSession = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('port');
        setIsLoggedIn(false);
        setActiveComponent('logins');
        setUsername('');
    };

    const handleLoginSuccess = (loggedInUsername) => {
        setIsLoggedIn(true);
        sessionStorage.setItem('isLoggedIn', 'true');
        setActiveComponent('join');
        setUsername(loggedInUsername);
    };

    // Render helpers
    const renderMainContent = () => {
        if (!isLoggedIn) {
            return <Logins onLoginSuccess={handleLoginSuccess} />;
        }

        const ActiveComponent = COMPONENT_MAP[activeComponent];
        return ActiveComponent ? <ActiveComponent /> : null;
    };

    return (
        <div className="App">
            <Navbar 
                username={username}
            />
            <div className="dashboard">
                {isLoggedIn && (
                    <Sidebar 
                        setActiveComponent={setActiveComponent} 
                        setIsLoggedIn={setIsLoggedIn}
                        activeComponent={activeComponent}
                    />
                )}
                <div className="main-content">
                    {renderMainContent()}
                </div>
            </div>
        </div>
    );
};

export default App;