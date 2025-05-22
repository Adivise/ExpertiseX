import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../../css/Style.css';
import MarkdownRenderer from '../../module/MDRender';
import config from '../../module/config.json';

const PlayTop = () => {
    const [guildId, setGuildId] = useState('');
    const [songName, setSongName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        const storedPort = sessionStorage.getItem('port');
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedPort) setPort(storedPort);
    }, []);

    const handlePlayTop = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('guildId', guildId);
                const { data } = await axios.post(`http://${config.ip}:${port}/playtop`, { guildId, songName });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handlePlayTop(event);
        }
    };

    const fetchSearch = async ({ value }) => {
        try {
            const { data } = await axios.get(`http://${config.ip}:3000/search?q=${value}`);
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

    const markdownContent = `
Enter the details below to queue song to the top.

- **Guild ID**
- **Song/Url**
`;

    return (
        <div id="playtop" className="content">
            <div className="markdown-container">
                <h2>PlayTop</h2>
                <MarkdownRenderer content={markdownContent} />
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
                    <button type="button" onClick={handlePlayTop} disabled={isCooldown}>
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

export default PlayTop;