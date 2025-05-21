import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Style.css';
import MarkdownRenderer from '../../module/MDRender';
import config from '../../module/config.json';

const Queue = () => {
    const [guildId, setGuildId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        if (storedGuildId) setGuildId(storedGuildId);
    }, []);

    const handleQueue = async (event) => {
        event.preventDefault(); // Prevent form submission
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown 
            try {
                sessionStorage.setItem('guildId', guildId);
                const { data } = await axios.post(`http://${config.ip}:3000/queue`, { guildId });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleQueue(event);
        }
    };

    const markdownContent = `
Enter the details below to show the queue of a voice channel in your server.

- **Guild ID**
`;

    return (
        <div id="queue" className="content">
            <div className="markdown-container">
                <h2>Queue</h2>
                <MarkdownRenderer content={markdownContent} />
            </div>
            <form className="styled-form" onSubmit={handleQueue} onKeyDown={handleKeyPress}>
                <input
                    type="text"
                    placeholder="Guild ID"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" disabled={isCooldown}>
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

export default Queue;