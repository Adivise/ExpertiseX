import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Remove = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [position, setPosition] = useState(1);
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

    const handleRemove = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                const { data } = await axios.post(`http://localhost:${port}/remove`, { 
                    guildId,
                    position: parseInt(position) || 1
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
            handleRemove(event);
        }
    };

    return (
        <div id="remove" className="content">
            <div className="markdown-container">
                <h2>Remove</h2>
                <div className="description">
                    <p>Enter the details below to remove a song from the queue.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Position: The position of the song in the queue that you want to remove</li>
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
                    placeholder="Position"
                    value={position}
                    onChange={(e) => setPosition(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleRemove} disabled={isCooldown}>
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

export default Remove; 