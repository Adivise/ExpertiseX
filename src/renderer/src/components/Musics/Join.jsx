import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Join = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [voiceId, setVoiceId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem(`guildId_${userId}`);
        const storedVoiceId = sessionStorage.getItem(`voiceId_${userId}`);
        const storedPort = sessionStorage.getItem(`port_${userId}`);
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedVoiceId) setVoiceId(storedVoiceId);
        if (storedPort) setPort(storedPort);
    }, [userId]);

    const handleJoin = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem(`guildId_${userId}`, guildId);
                sessionStorage.setItem(`voiceId_${userId}`, voiceId);
                const { data } = await axios.post(`http://localhost:${port}/join`, { guildId, voiceId });
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

    return (
        <div id="join" className="content">
            <div className="markdown-container">
                <h2>Join</h2>
                <div className="description">
                    <p>Enter the details below to join a voice channel in your server.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Voice Channel ID (ex: 1234567890)</li>
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