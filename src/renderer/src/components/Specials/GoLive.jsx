import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';
import '../../assets/Style.css';
import config from '../../module/config.json';

const GoLive = () => {
    const [voiceId, setVoiceId] = useState('');
    const [linkUrl, setlinkUrl] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedVoiceId = sessionStorage.getItem('voiceId');
        const storedPort = sessionStorage.getItem('port');
        if (storedPort) setPort(storedPort);
        if (storedVoiceId) setVoiceId(storedVoiceId);
    }, []);

    const handleGoLive = async () => {
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('voiceId', voiceId);
                const env = await window.electronAPI.getEnv();
                const { data } = await axios.post(`http://${env.ip}:${port}/golive`, { voiceId, linkUrl });
                setResponse(data.content);
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

    const markdownContent = `
Enter the details below to start streaming

- **Voice Channel ID**
- **linkUrl** (ex: \`http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4\`)
`;

    return (
        <div id="golive" className="content">
            <div className="markdown-container">
                <h2>GoLive</h2>
                <MarkdownRenderer content={markdownContent} />
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
