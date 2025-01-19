import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Style.css';
import MarkdownRenderer from '../../module/MDRender';

const Soft = () => {
    const [guildId, setGuildId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        if (storedGuildId) setGuildId(storedGuildId);
    }, []);

    const handleSoft = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown 
            try {
                sessionStorage.setItem('guildId', guildId);
                const { data } = await axios.post('http://localhost:3000/soft', { guildId });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSoft(event);
        }
    };

const markdownContent = `
Enter the details below to set the soft filter.

- **Guild ID**
`;

    return (
        <div id="soft" className="content">
            <div className="markdown-container">
                <h2>Soft</h2>
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
                    <button type="button" onClick={handleSoft} disabled={isCooldown}>
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

export default Soft;