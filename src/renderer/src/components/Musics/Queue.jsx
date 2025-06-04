import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Queue = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem(`guildId_${userId}`);
        const storedPort = sessionStorage.getItem(`port_${userId}`);
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedPort) setPort(storedPort);
    }, [userId]);

    const handleQueue = async (event) => {
        event.preventDefault(); // Prevent form submission
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown 
            try {
                sessionStorage.setItem(`guildId_${userId}`, guildId);
                const { data } = await axios.post(`http://localhost:${port}/queue`, { guildId });
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

    return (
        <div id="queue" className="content">
            <div className="markdown-container">
                <h2>Queue</h2>
                <div className="description">
                    <p>Enter the details below to show the queue of a voice channel in your server.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                    </ul>
                </div>
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