import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Pitch = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [pitch, setPitch] = useState(5);
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

    const handlePitch = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown 
            try {
                const { data } = await axios.post(`http://localhost:${port}/pitch`, { guildId, pitch });
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
            handlePitch(event);
        }
    };

    // between 0 to 10
    const handleBetween = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 0 && value <= 10)) {
            setPitch(value);
        }
    };

    const handleBlur = () => {
        if (pitch === '') {
            setPitch(5);
        }
    };

    return (
        <div id="pitch" className="content">
            <div className="markdown-container">
                <h2>Pitch</h2>
                <div className="description">
                    <p>Enter the details below to set the pitch filter.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Pitch (0 to 10)</li>
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
                    placeholder="0 to 10"
                    value={pitch}
                    onChange={handleBetween}
                    onBlur={handleBlur}
                    min={0}
                    max={10}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handlePitch} disabled={isCooldown}>
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

export default Pitch;