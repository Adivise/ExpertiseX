import { useState, useEffect } from 'react';
import { PlaySkip, PlayTop, AutoPlay, Join, Leave, Play, Queue, GoLive, Loop, Skip, Clear, Previous, Pause, TwentyFourSeven, Volume, Shuffle, Replay, EndLive, Bass, Normal, Earrape, BassBoost, China, Chipmunk, Dance, Darthvader, EightD, Jazz, Nightcore, Pop, SlowMotion, Soft, SuperBass, Television, TrebleBass, Tremolo, Vaporwave, Vibrate, Vibrato, Logins, Console } from './components';
import Navbar from './module/Navbar';
import Sidebar from './module/Sidebar';
import './assets/Style.css';
import axios from 'axios';

const App = () => {
    const [activeComponent, setActiveComponent] = useState('logins');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Logout handler
        window.electronAPI.onWindowClose( async() => {
            const port = sessionStorage.getItem('port');
            if (port) {
                await axios.post(`http://localhost:${port}/logout`); // Destroy bot!
                sessionStorage.removeItem('isLoggedIn'); // Clear login state
                sessionStorage.removeItem('port');
            }
        });

        // Check if user is logged in from sessionStorage
        const storedLoginState = sessionStorage.getItem('isLoggedIn');
        if (storedLoginState === 'true') {
            setIsLoggedIn(true);
            setActiveComponent('join');
        }
    }, []);

    const handleLoginSuccess = (loggedInUsername) => {
        setIsLoggedIn(true);
        sessionStorage.setItem('isLoggedIn', 'true');
        setActiveComponent('join');
        setUsername(loggedInUsername);
    };

    return (
        <div className="App">
            <Navbar username={username} setIsLoggedIn={setIsLoggedIn} />
            <div className="dashboard">
                {isLoggedIn && <Sidebar setActiveComponent={setActiveComponent} setIsLoggedIn={setIsLoggedIn} />}
                
                <div className="main-content">
                    {!isLoggedIn && <Logins onLoginSuccess={handleLoginSuccess} />}
                    {isLoggedIn && (
                        <div className="logged-in-content">
                            {activeComponent === 'console' && <Console />}
                            {activeComponent === 'join' && <Join />}
                            {activeComponent === 'leave' && <Leave />}
                            {activeComponent === 'play' && <Play />}
                            {activeComponent === 'autoplay' && <AutoPlay />}
                            {activeComponent === 'queue' && <Queue />}
                            {activeComponent === 'golive' && <GoLive />}
                            {activeComponent === 'loop' && <Loop />}
                            {activeComponent === 'skip' && <Skip />}
                            {activeComponent === 'clear' && <Clear />}
                            {activeComponent === 'previous' && <Previous />}
                            {activeComponent === 'pause' && <Pause />}
                            {activeComponent === 'twentyfourseven' && <TwentyFourSeven />}
                            {activeComponent === 'volume' && <Volume />}
                            {activeComponent === 'shuffle' && <Shuffle />}
                            {activeComponent === 'replay' && <Replay />}
                            {activeComponent === 'endlive' && <EndLive />}
                            {activeComponent === 'bass' && <Bass />}
                            {activeComponent === 'normal' && <Normal />}
                            {activeComponent === 'earrape' && <Earrape />}
                            {activeComponent === 'bassboost' && <BassBoost />}
                            {activeComponent === 'china' && <China />}
                            {activeComponent === 'chipmunk' && <Chipmunk />}
                            {activeComponent === 'dance' && <Dance />}
                            {activeComponent === 'darthvader' && <Darthvader />}
                            {activeComponent === 'eightd' && <EightD />}
                            {activeComponent === 'jazz' && <Jazz />}
                            {activeComponent === 'nightcore' && <Nightcore />}
                            {activeComponent === 'pop' && <Pop />}
                            {activeComponent === 'slowmotion' && <SlowMotion />}
                            {activeComponent === 'soft' && <Soft />}
                            {activeComponent === 'superbass' && <SuperBass />}
                            {activeComponent === 'television' && <Television />}
                            {activeComponent === 'treblebass' && <TrebleBass />}
                            {activeComponent === 'tremolo' && <Tremolo />}
                            {activeComponent === 'vaporwave' && <Vaporwave />}
                            {activeComponent === 'vibrate' && <Vibrate />}
                            {activeComponent === 'vibrato' && <Vibrato />}
                            {activeComponent === 'playskip' && <PlaySkip />}
                            {activeComponent === 'playtop' && <PlayTop />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;