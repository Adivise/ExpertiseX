import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/Style.css';
import MarkdownRenderer from '../../module/MDRender';

const Clear = () => {
    const [guildId, setGuildId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        const storedPort = sessionStorage.getItem('port');
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedPort) setPort(storedPort);
    }, []);

    const handleClear = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown 
            try {
                sessionStorage.setItem('guildId', guildId);
                const env = await window.electronAPI.getEnv();
                const { data } = await axios.post(`http://${env.ip}:${port}/clear`, { guildId });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleClear(event);
        }
    };

const markdownContent = `
Enter the details below to clear the queue in your server.

- **Guild ID**
`;

    return (
        <div id="clear" className="content">
            <div className="markdown-container">
                <h2>Clear</h2>
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
                    <button type="button" onClick={handleClear} disabled={isCooldown}>
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

export default Clear;