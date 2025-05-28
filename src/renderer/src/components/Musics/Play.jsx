import { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../../assets/Style.css';
import MarkdownRenderer from '../../module/MDRender';

const Play = () => {
    const [guildId, setGuildId] = useState('');
    const [voiceId, setVoiceId] = useState('');
    const [songName, setSongName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        const storedVoiceId = sessionStorage.getItem('voiceId');
        const storedPort = sessionStorage.getItem('port');
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedVoiceId) setVoiceId(storedVoiceId);
        if (storedPort) setPort(storedPort);
    }, []);

    const handlePlay = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('guildId', guildId);
                sessionStorage.setItem('voiceId', voiceId);
                const env = await window.electronAPI.getEnv();
                const { data } = await axios.post(`http://${env.ip}:${port}/play`, { guildId, voiceId, songName });
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

    const fetchSearch = async ({ value }) => {
        try {
            const env = await window.electronAPI.getEnv();
            const { data } = await axios.get(`http://${env.ip}:3000/search?q=${value}`);
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
Enter the details below to play a song in a voice channel in your server.

- **Guild ID**
- **Voice Channel ID**
- **Song/Url**
`;

    return (
        <div id="play" className="content">
            <div className="markdown-container">
                <h2>Play</h2>
                <MarkdownRenderer content={markdownContent} />
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