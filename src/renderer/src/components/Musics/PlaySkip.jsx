import { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../../assets/Style.css';
import MarkdownRenderer from '../../module/MDRender';

const PlaySkip = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [songName, setSongName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem(`guildId_${userId}`);
        const storedPort = sessionStorage.getItem(`port_${userId}`);
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedPort) setPort(storedPort);
    }, [userId]);

    const handlePlaySkip = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem(`guildId_${userId}`, guildId);
                const { data } = await axios.post(`http://localhost:${port}/playskip`, { guildId, songName });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handlePlaySkip(event);
        }
    };

    const fetchSearch = async ({ value }) => {
        try {
            const { data } = await axios.get(`http://localhost:3000/search?q=${value}`);
            const limitedSuggestions = data.songs.slice(0, 5);
            setSuggestions(limitedSuggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const fetchSuccess = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.url;

    const renderSuggestion = (suggestion) => (
        <button className="suggestion-item">
            {suggestion.name}
        </button>
    );

    return (
        <div id="playskip" className="content">
            <div className="markdown-container">
                <h2>PlaySkip</h2>
                <div className="description">
                    <p>Enter the details below to play and skip to the song.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
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
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={fetchSearch}
                    onSuggestionsClearRequested={fetchSuccess}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                        placeholder: 'Song/Url',
                        value: songName,
                        type: 'search',
                        onChange: (e, { newValue }) => setSongName(newValue)
                    }}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handlePlaySkip} disabled={isCooldown}>
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

export default PlaySkip;