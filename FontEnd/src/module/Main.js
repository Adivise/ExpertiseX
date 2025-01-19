import React, { useState } from 'react';
import { PlaySkip, PlayTop, AutoPlay, Join, Leave, Play, Queue, GoLive, Loop, Skip, Clear, Previous, Pause, TwentyFourSeven, Volume, Shuffle, Replay, EndLive, Bass, Normal, Earrape, BassBoost, China, Chipmunk, Dance, Darthvader, EightD, Jazz, Nightcore, Pop, SlowMotion, Soft, SuperBass, Television, TrebleBass, Tremolo, Vaporwave, Vibrate, Vibrato } from '../components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../css/Style.css';

const App = () => {
    const [activeComponent, setActiveComponent] = useState('join');

    return (
        <div className="App">
            <Navbar />
            <div className="dashboard">
                <Sidebar setActiveComponent={setActiveComponent} />
                <div className="main-content">
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
            </div>
        </div>
    );
};

export default App;