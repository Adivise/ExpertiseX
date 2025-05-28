import { useState, useEffect } from "react";
import MarkdownRenderer from "../../module/MDRender";
import "../../assets/Style.css";

const Login = ({ setIsLoggedIn }) => {
    const [token, setToken] = useState("");
    const [port, setPort] = useState(3000);
    const [saveToken, setSaveToken] = useState(false);
    const [response, setResponse] = useState("");
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        const storedPort = sessionStorage.getItem("port");
        if (storedPort) setPort(storedPort);

        window.electronAPI.getToken().then((storedToken) => {
            if (storedToken) {
                setToken(storedToken);
                setSaveToken(true);
            }
        }).catch((error) => {
            //
        });
    }, []);

    const handleLogin = async () => {
        setResponse("");
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000);

            try {
                // Validate token format
                const checkToken = await window.electronAPI.checkToken(token);
                if (!checkToken) {
                    setResponse("Invalid token! Please check your self bot token.");
                    return;
                }
                // If port already in use, show error = response
                const checkPort = await window.electronAPI.checkPort(port);
                if (!checkPort) {
                    setResponse("Port is already in use! Please choose another port.");
                    return;
                };

                // ✅ Store port and token, then start bot
                sessionStorage.setItem("port", port);
                setIsLoggedIn(true);
                window.electronAPI.startBot(token, port); // ✅ Call Electron to run bot
                
                if (saveToken) {
                    window.electronAPI.storeToken(token);
                }
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
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
                <div style={{ marginTop: "10px" }}>
                    <input
                        type="checkbox"
                        id="saveToken"
                        checked={saveToken}
                        onChange={(e) => setSaveToken(e.target.checked)}
                    />
                    <label htmlFor="saveToken">
                        <pre>Save Token (Auto Put)</pre>
                    </label>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <button type="button" onClick={handleLogin} disabled={isCooldown} id="b1">
                        {isCooldown ? "Loading..." : "Login"}
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