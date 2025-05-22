import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';
import '../../css/Style.css';
import config from '../../module/config.json';

const Login = ({ setIsLoggedIn }) => {
    const [token, setToken] = useState('');
    const [port, setPort] = useState(3000);
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        // Load stored session data
        const storedPort = sessionStorage.getItem('port')
        if (storedPort) setPort(storedPort);
    }, []);

    const handleLogin = async () => {
        setResponse('');
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000);
            try {
                const checkPort = await axios.post(`http://${config.ip}:5000/check_port`, { port });
                if (checkPort.data.used) {
                    setResponse(`Port ${port} is already in use. Choose another.`);
                    return;
                }

                const { data } = await axios.post(`http://${config.ip}:5000/midend_login`, { token, port });

                if (!data.working) { 
                    setResponse(data.content);
                    return;
                }

                // Store port and proceed with login only when working is true
                sessionStorage.setItem('port', data.port);
                setPort(data.port);
                setIsLoggedIn(true);
                setResponse(data.content);

            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const markdownContent = `
Enter the details below to login

- **Self Bot Token** (ex: \`NzY4NTQ0NjA2NzE3OTI5MjQ1.X3v7Xg.*****\`)
- **Port** (ex: \`3000\` - \`3999\`)
`;

    return (
        <div id="logins" className="content">
            <div className="markdown-container">
                <h2>Self Bot Logins</h2>
                <MarkdownRenderer content={markdownContent} />
            </div>
            <form className="styled-form" onKeyDown={handleKeyPress}>
                <input
                    type="password"
                    placeholder="Put your self bot token in here"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Put your port in here"
                    min="3000"
                    max="3999"
                    step="1"
                    value={port}
                    onChange={(e) => {
                        const newPort = parseInt(e.target.value, 10);
                        if (newPort < 3000 || newPort > 3999) {
                            setResponse("Port must be between 3000 and 3999!");
                        } else {
                            setPort(newPort);
                        }
                    }}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleLogin} disabled={isCooldown}>
                            {isCooldown ? 'Loading...' : 'Login'}
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

export default Login;