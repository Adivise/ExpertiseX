import { useState, useEffect } from 'react';
import '../assets/Style.css';


const Sidebar = ({ setActiveComponent }) => {
    const [isSpecialCollapsed, setIsSpecialCollapsed] = useState(false);
    const [isMusicCollapsed, setIsMusicCollapsed] = useState(false);
    const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

    useEffect(() => {
        //
    }, []);

    return (
        <div className="sidebar">
            <div className="category">
                <h2>Special Control</h2>
                <button className="collapse-button" onClick={() => setIsSpecialCollapsed(!isSpecialCollapsed)}>
                    {isSpecialCollapsed ? '>' : 'v'}
                </button>
            </div>
            {!isSpecialCollapsed && (
                <>
                    <button className="sidebar-button" onClick={() => setActiveComponent('console')}>Console</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('golive')}>GoLive</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('endlive')}>EndLive</button>
                </>
            )}

            <div className="category">
                <h2>Music Control</h2>
                <button className="collapse-button" onClick={() => setIsMusicCollapsed(!isMusicCollapsed)}>
                    {isMusicCollapsed ? '>' : 'v'}
                </button>
            </div>
            {!isMusicCollapsed && (
                <>
                    <button className="sidebar-button" onClick={() => setActiveComponent('autoplay')}>AutoPlay</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('join')}>Join</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('leave')}>Leave</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('play')}>Play</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('playskip')}>PlaySkip</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('playtop')}>PlayTop</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('skip')}>Skip</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('queue')}>Queue</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('clear')}>Clear</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('replay')}>Replay</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('previous')}>Previous</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('loop')}>Loop</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('shuffle')}>Shuffle</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('volume')}>Volume</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('pause')}>Pause</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('twentyfourseven')}>TwentyFourSeven</button>
                </>
            )}

            <div className="category">
                <h2>Filter Control</h2>
                <button className="collapse-button" onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}>
                    {isFilterCollapsed ? '>' : 'v'}
                </button>
            </div>
            {!isFilterCollapsed && (
                <>
                    <button className="sidebar-button" onClick={() => setActiveComponent('normal')}>Normal</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('earrape')}>Earrape</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('bass')}>Bass</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('bassboost')}>BassBoost</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('nightcore')}>Nightcore</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('vaporwave')}>Vaporwave</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('pop')}>Pop</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('china')}>China</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('chipmunk')}>Chipmunk</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('dance')}>Dance</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('darthvader')}>Darthvader</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('eightd')}>8D</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('jazz')}>Jazz</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('slowmotion')}>SlowMotion</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('soft')}>Soft</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('superbass')}>SuperBass</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('television')}>Television</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('treblebass')}>TrebleBass</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('tremolo')}>Tremolo</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('vibrate')}>Vibrate</button>
                    <button className="sidebar-button" onClick={() => setActiveComponent('vibrato')}>Vibrato</button>
                </>
            )}
        </div>
    );
};

export default Sidebar;