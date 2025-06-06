import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const BassBoost = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [bassboost, setBassBoost] = useState(5);
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

    const handleBassBoost = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown 
            try {
                const { data } = await axios.post(`http://localhost:${port}/bassboost`, { guildId, bassboost });
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
            handleBassBoost(event);
        }
    };

    // between -10 to 10
    const handleBetween = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= -10 && value <= 10)) {
            setBassBoost(value);
        }
    };

    const handleBlur = () => {
        if (bassboost === '') {
            setBassBoost(5);
        }
    };

    return (
        <div id="bassboost" className="content">
            <div className="markdown-container">
                <h2>BassBoost</h2>
                <div className="description">
                    <p>Enter the details below to set the bassboost filter.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>BassBoost (-10 to 10)</li>
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
                    placeholder="-10 to 10"
                    value={bassboost}
                    onChange={handleBetween}
                    onBlur={handleBlur}
                    min={-10}
                    max={10}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleBassBoost} disabled={isCooldown}>
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

export default BassBoost;