import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/Style.css';
import MarkdownRenderer from '../../module/MDRender';

const DirectMessage = ({ userId }) => {
    const [toUserId, settoUserId] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedPort = sessionStorage.getItem(`port_${userId}`);
        if (storedPort) setPort(storedPort);
    }, [userId]);

    const handleDirectMessage = async () => {
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown 
            try {
                const { data } = await axios.post(`http://localhost:${port}/directmessage`, { toUserId, message });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleDirectMessage();
        }
    }

    const markdownContent = `
Enter the details below to send a direct message to a user.

- **User ID**
- **Message**
    `

    return (
        <div id="directmessage" className="content">
            <div className="markdown-container">
                <h2>Direct Message</h2>
                <MarkdownRenderer content={markdownContent} />
            </div>
            <form className="styled-form" onKeyDown={handleKeyPress}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={toUserId}
                    onChange={(e) => settoUserId(e.target.value)}
                    required={true}
                />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required={true}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleDirectMessage} disabled={isCooldown}>
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
    )
}

export default DirectMessage;