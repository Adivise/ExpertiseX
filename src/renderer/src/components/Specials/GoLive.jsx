import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const GoLive = ({ userId }) => {
    const [voiceId, setVoiceId] = useState('');
    const [linkUrl, setlinkUrl] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const loadSavedValues = async () => {
            try {
                const sessionData = await window.electronAPI.getSessionData(userId);
                if (sessionData) {
                    if (sessionData.voiceId) setVoiceId(sessionData.voiceId);
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
                voiceId: voiceId  // Only update voiceId
            });
        } catch (error) {
            console.error('Error saving values:', error);
        }
    };

    const handleGoLive = async () => {
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                const { data } = await axios.post(`http://localhost:${port}/golive`, { voiceId, linkUrl });
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
            handleGoLive();
        }
    };

    return (
        <div id="golive" className="content">
            <div className="markdown-container">
                <h2>GoLive</h2>
                <div className="description">
                    <p>Enter the details below to start streaming</p>
                    <ul>
                        <li>Voice Channel ID (ex: 1234567890)</li>
                        <li>linkUrl (ex: https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4)</li>
                    </ul>
                </div>
            </div>
            <form className="styled-form" onKeyDown={handleKeyPress}>
                <input
                    type="text"
                    placeholder="Voice Channel ID"
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                />
                <input
                    type="url"
                    placeholder="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setlinkUrl(e.target.value)}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleGoLive} disabled={isCooldown}>
                        {isCooldown ? 'Sending...' : 'Submit'}
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

export default GoLive;