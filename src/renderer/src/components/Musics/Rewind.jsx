import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Rewind = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [seconds, setSeconds] = useState(10);
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
            const existingData = await window.electronAPI.getSessionData(userId) || {};
            await window.electronAPI.saveSessionData(userId, {
                ...existingData,
                guildId: guildId
            });
        } catch (error) {
            console.error('Error saving values:', error);
        }
    };

    const handleRewind = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                const { data } = await axios.post(`http://localhost:${port}/rewind`, { 
                    guildId,
                    seconds: parseInt(seconds) || 10
                });
                setResponse(data.content);
                await saveValues();
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleRewind(event);
        }
    };

    return (
        <div id="rewind" className="content">
            <div className="markdown-container">
                <h2>Rewind</h2>
                <div className="description">
                    <p>Enter the details below to rewind the currently playing song.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Seconds to rewind (default: 10)</li>
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
                    placeholder="Seconds"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(1, parseInt(e.target.value) || 10))}
                    min="1"
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleRewind} disabled={isCooldown}>
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

export default Rewind; 