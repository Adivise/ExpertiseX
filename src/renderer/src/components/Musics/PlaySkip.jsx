import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';
import { SuggestionItem } from '../../hooks/components/SuggestionItem';

const PlaySkip = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [songName, setSongName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const loadSavedValues = async () => {
            try {
                const sessionData = await window.electronAPI.getSessionData(userId);
                if (sessionData) {
                    if (sessionData.guildId) setGuildId(sessionData.guildId);
                }
                const storedPort = sessionStorage.getItem(`port_${userId}`);
                if (storedPort) setPort(storedPort);
            } catch (error) {
                console.error('Error loading saved values:', error);
            }
        };
        loadSavedValues();
    }, [userId]);

    const saveValues = async () => {
        try {
            // Get existing data first
            const existingData = await window.electronAPI.getSessionData(userId) || {};
            // Only update guildId while preserving voiceId and other data
            await window.electronAPI.saveSessionData(userId, {
                ...existingData,  // Keep all existing data
                guildId: guildId  // Only update guildId
            });
        } catch (error) {
            console.error('Error saving values:', error);
        }
    };

    const handlePlaySkip = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                const { data } = await axios.post(`http://localhost:${port}/playskip`, { guildId, songName });
                setResponse(data.content);
                // Save values after successful play
                await saveValues();
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const fetchSearch = async (value) => {
        if (!value.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            const { data } = await axios.get(`http://localhost:${port}/search?q=${value}`);
            const limitedSuggestions = data.songs.slice(0, 5);
            setSuggestions(limitedSuggestions);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSongName(value);
        fetchSearch(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSongName(suggestion.url);
        setShowSuggestions(false);
    };

    return (
        <div id="playskip" className="content">
            <div className="markdown-container">
                <h2>Play Skip</h2>
                <div className="description">
                    <p>Enter the details below to skip and play a song.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Song/Url (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)</li>
                    </ul>
                </div>
            </div>

            <form 
                className="styled-form" 
                onSubmit={handlePlaySkip}
            >
                <input
                    type="text"
                    placeholder="Guild ID"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                    aria-label="Guild ID"
                />
                <div 
                    className="autosuggest-container" 
                    ref={suggestionsRef}
                    style={{ position: 'relative' }}
                >
                    <input
                        type="search"
                        placeholder="Song/Url"
                        value={songName}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        aria-label="Song or URL"
                        aria-expanded={showSuggestions}
                        aria-controls="suggestions-list"
                        role="combobox"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div 
                            id="suggestions-list"
                            className="suggestions-list"
                            role="listbox"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'var(--bg-dark)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                zIndex: 1000,
                                maxHeight: '300px',
                                overflowY: 'auto',
                                marginTop: '4px'
                            }}
                        >
                            {suggestions.map((suggestion, index) => (
                                <div 
                                    key={index} 
                                    className="suggestion-wrapper"
                                    role="option"
                                >
                                    <SuggestionItem
                                        suggestion={suggestion}
                                        onSelect={handleSuggestionClick}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div style={{ marginTop: '20px' }}>
                    <button 
                        type="submit" 
                        disabled={isCooldown}
                        style={{
                            opacity: isCooldown ? 0.7 : 1,
                            cursor: isCooldown ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isCooldown ? 'Cooldown...' : 'Submit'}
                    </button>
                </div>
            </form>

            {response && (
                <div 
                    className="response-container"
                    style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: 'var(--bg-dark)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <MarkdownRenderer content={response} />
                </div>
            )}
        </div>
    );
};

export default PlaySkip;