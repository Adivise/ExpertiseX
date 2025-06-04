import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Play = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [voiceId, setVoiceId] = useState('');
    const [songName, setSongName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem(`guildId_${userId}`);
        const storedVoiceId = sessionStorage.getItem(`voiceId_${userId}`);
        const storedPort = sessionStorage.getItem(`port_${userId}`);
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedVoiceId) setVoiceId(storedVoiceId);
        if (storedPort) setPort(storedPort);
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePlay = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem(`guildId_${userId}`, guildId);
                sessionStorage.setItem(`voiceId_${userId}`, voiceId);
                const { data } = await axios.post(`http://localhost:${port}/play`, { guildId, voiceId, songName });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handlePlay(event);
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

    const renderSuggestion = (suggestion) => (
        <button 
            className="suggestion-item"
            onClick={() => handleSuggestionClick(suggestion)}
        >
            <div className="suggestion-thumbnail">
                <img src={suggestion.thumbnail} alt={suggestion.name} />
            </div>
            <div className="suggestion-content">
                <div className="suggestion-title">{suggestion.name}</div>
                <div className="suggestion-subtitle">
                    {suggestion.duration ? `${Math.floor(suggestion.duration / 60000)}:${((suggestion.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}` : ''}
                </div>
            </div>
        </button>
    );
    
    return (
        <div id="play" className="content">
            <div className="markdown-container">
                <h2>Play</h2>
                <div className="description">
                    <p>Enter the details below to play a song in a voice channel in your server.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Voice Channel ID (ex: 1234567890)</li>
                        <li>Song/Url (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)</li>
                    </ul>
                </div>
            </div>
            <form className="styled-form" onKeyDown={handleKeyPress}>
                <input
                    type="text"
                    placeholder="Guild ID"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Voice Channel ID"
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                />
                <div className="autosuggest-container" ref={suggestionsRef}>
                    <input
                        type="search"
                        placeholder="Song/Url"
                        value={songName}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="suggestions-list">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="suggestion-wrapper">
                                    {renderSuggestion(suggestion)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handlePlay} disabled={isCooldown}>
                        {isCooldown ? 'Cooldown...' : 'Submit'}
                    </button>
                </div>
            </form>
            {response && (
                <div className="response-container">
                    <MarkdownRenderer content={response} />
                </div>
            )}
        </div>
    );
};

export default Play;