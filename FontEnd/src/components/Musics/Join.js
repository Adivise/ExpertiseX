import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Style.css';
import MarkdownRenderer from '../../module/MDRender';
import config from '../../module/config.json';

const Join = () => {
    const [guildId, setGuildId] = useState('');
    const [voiceId, setVoiceId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        const storedVoiceId = sessionStorage.getItem('voiceId');
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedVoiceId) setVoiceId(storedVoiceId);
    }, []);

    const handleJoin = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('guildId', guildId);
                sessionStorage.setItem('voiceId', voiceId);
                const { data } = await axios.post(`http://${config.ip}:3000/join`, { guildId, voiceId });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleJoin(event);
        }
    };

const markdownContent = `
Enter the details below to join a voice channel in your server.

- **Guild ID**
- **Voice Channel ID**
`;

    return (
        <div id="join" className="content">
            <div className="markdown-container">
                <h2>Join</h2>
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
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleJoin} disabled={isCooldown}>
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

export default Join;