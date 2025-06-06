import { useState, useEffect } from 'react';

const Sidebar = ({ setActiveComponent, activeComponent }) => {
    const [isSpecialCollapsed, setIsSpecialCollapsed] = useState(false);
    const [isMusicCollapsed, setIsMusicCollapsed] = useState(false);
    const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Add effect to expand categories with search matches
    useEffect(() => {
        if (searchQuery.trim()) {
            // Check each category for matches
            const hasSpecialMatch = categories[0].items.some(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const hasMusicMatch = categories[1].items.some(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const hasFilterMatch = categories[2].items.some(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Expand categories with matches
            if (hasSpecialMatch) setIsSpecialCollapsed(false);
            if (hasMusicMatch) setIsMusicCollapsed(false);
            if (hasFilterMatch) setIsFilterCollapsed(false);
        }
    }, [searchQuery]);

    const categories = [
        {
            name: "Special Control",
            isCollapsed: isSpecialCollapsed,
            setIsCollapsed: setIsSpecialCollapsed,
            items: [
                { id: 'console', label: 'Console', icon: '📊' },
                { id: 'golive', label: 'GoLive', icon: '🎥' },
                { id: 'endlive', label: 'EndLive', icon: '⏹️' }
            ]
        },
        {
            name: "Music Control",
            isCollapsed: isMusicCollapsed,
            setIsCollapsed: setIsMusicCollapsed,
            items: [
                { id: 'autoplay', label: 'AutoPlay', icon: '▶️' },
                { id: 'join', label: 'Join', icon: '🎵' },
                { id: 'leave', label: 'Leave', icon: '🚪' },
                { id: 'play', label: 'Play', icon: '🎧' },
                { id: 'playskip', label: 'PlaySkip', icon: '⏭️' },
                { id: 'playtop', label: 'PlayTop', icon: '⏫' },
                { id: 'skip', label: 'Skip', icon: '⏩' },
                { id: 'queue', label: 'Queue', icon: '📋' },
                { id: 'clear', label: 'Clear', icon: '🗑️' },
                { id: 'replay', label: 'Replay', icon: '🔄' },
                { id: 'previous', label: 'Previous', icon: '⏮️' },
                { id: 'loop', label: 'Loop', icon: '🔁' },
                { id: 'shuffle', label: 'Shuffle', icon: '🔀' },
                { id: 'volume', label: 'Volume', icon: '🔊' },
                { id: 'pause', label: 'Pause', icon: '⏸️' },
                { id: 'twentyfourseven', label: '24/7', icon: '⏰' },
                { id: 'forward', label: 'Forward', icon: '⏩' },
                { id: 'rewind', label: 'Rewind', icon: '⏪' },
                { id: 'seek', label: 'Seek', icon: '⏱️' },
                { id: 'move', label: 'Move', icon: '↔️' },
                { id: 'remove', label: 'Remove', icon: '❌' },
                { id: 'skipto', label: 'SkipTo', icon: '⏩' }
            ]
        },
        {
            name: "Filter Control",
            isCollapsed: isFilterCollapsed,
            setIsCollapsed: setIsFilterCollapsed,
            items: [
                { id: 'normal', label: 'Normal', icon: '🎚️' },
                { id: 'equalizer', label: 'Equalizer', icon: '🎛️' },
                { id: 'earrape', label: 'Earrape', icon: '🔊' },
                { id: 'bass', label: 'Bass', icon: '🎵' },
                { id: 'bassboost', label: 'BassBoost', icon: '🎵' },
                { id: 'daycore', label: 'Daycore', icon: '☀️' },
                { id: 'doubletime', label: 'DoubleTime', icon: '⏩' },
                { id: 'nightcore', label: 'Nightcore', icon: '🌙' },
                { id: 'pitch', label: 'Pitch', icon: '🎯' },
                { id: 'rate', label: 'Rate', icon: '📊' },
                { id: 'speed', label: 'Speed', icon: '⚡' },
                { id: 'vaporwave', label: 'Vaporwave', icon: '🌊' },
                { id: 'pop', label: 'Pop', icon: '🎵' },
                { id: 'china', label: 'China', icon: '🇨🇳' },
                { id: 'chipmunk', label: 'Chipmunk', icon: '🐿️' },
                { id: 'dance', label: 'Dance', icon: '💃' },
                { id: 'darthvader', label: 'Darthvader', icon: '⚫' },
                { id: 'eightd', label: '8D', icon: '🎧' },
                { id: 'jazz', label: 'Jazz', icon: '🎷' },
                { id: 'slowmotion', label: 'SlowMotion', icon: '⏱️' },
                { id: 'soft', label: 'Soft', icon: '🎵' },
                { id: 'superbass', label: 'SuperBass', icon: '🎵' },
                { id: 'television', label: 'Television', icon: '📺' },
                { id: 'treblebass', label: 'TrebleBass', icon: '🎵' },
                { id: 'tremolo', label: 'Tremolo', icon: '🎵' },
                { id: 'vibrate', label: 'Vibrate', icon: '📳' },
                { id: 'vibrato', label: 'Vibrato', icon: '🎵' }
            ]
        }
    ];

    const filteredCategories = categories.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }));

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
        // Expand all categories when collapsing sidebar
        if (!isSidebarCollapsed) {
            setIsSpecialCollapsed(false);
            setIsMusicCollapsed(false);
            setIsFilterCollapsed(false);
        }
    };

    return (
        <div className="sidebar-container" style={{ position: 'relative', height: '100%' }}>
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-content">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    {filteredCategories.map((category, index) => (
                        <div key={index} className="sidebar-category">
                            {category.items.length > 0 && (
                                <>
                                    <div 
                                        className="category-header" 
                                        onClick={() => !isSidebarCollapsed && category.setIsCollapsed(!category.isCollapsed)}
                                        aria-expanded={!category.isCollapsed}
                                    >
                                        <h2>{category.name}</h2>
                                        <span className={`collapse-icon ${isSidebarCollapsed ? 'hidden' : ''}`}>▼</span>
                                    </div>
                                    <div className={`category-items ${!category.isCollapsed || isSidebarCollapsed ? 'expanded' : ''}`}>
                                        {category.items.map((item) => (
                                            <button
                                                key={item.id}
                                                className={`sidebar-button ${activeComponent === item.id ? 'active' : ''}`}
                                                onClick={() => setActiveComponent(item.id)}
                                                title={isSidebarCollapsed ? item.label : ''}
                                            >
                                                <span className="button-icon">{item.icon}</span>
                                                <span className="button-label">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </aside>
            <button 
                className="sidebar-toggle" 
                onClick={toggleSidebar}
                title={isSidebarCollapsed ? "Expand Sidebar (Collapse Button)" : "Collapse Sidebar (Collapse Button)"}
                style={{ position: 'absolute', top: '50%', left: '100%', transform: 'translateY(-50%)', zIndex: 100 }}
            >
                {isSidebarCollapsed ? ">" : "<"}
            </button>
        </div>
    );
};

export default Sidebar;