import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Move = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [fromPosition, setFromPosition] = useState(1);
    const [toPosition, setToPosition] = useState(1);
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

    const handleMove = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                const { data } = await axios.post(`http://localhost:${port}/move`, { 
                    guildId,
                    from: parseInt(fromPosition) || 1,
                    to: parseInt(toPosition) || 1
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
            handleMove(event);
        }
    };

    return (
        <div id="move" className="content">
            <div className="markdown-container">
                <h2>Move</h2>
                <div className="description">
                    <p>Enter the details below to change a song's position in the queue.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>From Position: The current position of the song in the queue</li>
                        <li>To Position: The new position where you want to move the song</li>
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
                    placeholder="From Position"
                    value={fromPosition}
                    onChange={(e) => setFromPosition(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                />
                <input
                    type="number"
                    placeholder="To Position"
                    value={toPosition}
                    onChange={(e) => setToPosition(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleMove} disabled={isCooldown}>
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

export default Move; 