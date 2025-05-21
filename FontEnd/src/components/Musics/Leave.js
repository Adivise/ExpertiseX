import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Style.css';
import MarkdownRenderer from '../../module/MDRender';
import config from '../../module/config.json';

const Leave = () => {
    const [guildId, setGuildId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        if (storedGuildId) setGuildId(storedGuildId);
    }, []);

    const handleLeave = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('guildId', guildId);
                const { data } = await axios.post(`http://${config.ip}:3000/leave`, { guildId });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLeave(event);
        }
    };

const markdownContent = `
Enter the details below to leave a voice channel in your server.

- **Guild ID**
`;

    return (
        <div id="leave" className="content">
            <div className="markdown-container">
                <h2>Leave</h2>
                <MarkdownRenderer content={markdownContent} />
            </div>
            <form className="styled-form" onKeyDown={handleKeyPress}>
                <input
                    type="text"
                    placeholder="Guild ID"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleLeave} disabled={isCooldown}>
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

export default Leave;