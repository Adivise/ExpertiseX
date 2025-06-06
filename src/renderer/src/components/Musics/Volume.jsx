import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Volume = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [volume, setVolume] = useState(50);
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

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

    const handleVolume = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                const { data } = await axios.post(`http://localhost:${port}/volume`, { guildId, volume });
                setResponse(data.content);
                // Save values after successful play
                await saveValues();
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleVolume(event);
        }
    };

    const handleBetween = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 1 && value <= 100)) {
            setVolume(value);
        }
    };

    const handleBlur = () => {
        if (volume === '') {
            setVolume(50);
        }
    };

    return (
        <div id="volume" className="content">
            <div className="markdown-container">
                <h2>Volume</h2>
                <div className="description">
                    <p>Enter the details below to change the volume of the bot.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Volume (1 to 100)</li>
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
                    type="number"
                    placeholder="1 to 100"
                    value={volume}
                    onChange={handleBetween}
                    onBlur={handleBlur}
                    min={1}
                    max={100}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleVolume} disabled={isCooldown}>
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

export default Volume;