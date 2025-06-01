import { useState, useEffect } from "react";
import MarkdownRenderer from "../../module/MDRender";
import "../../assets/Style.css";
import Settings from "./Settings";

const Login = ({ onLoginSuccess }) => {
    const [token, setToken] = useState("");
    const [port, setPort] = useState(3000);
    const [saveCredentials, setSaveCredentials] = useState(false);
    const [response, setResponse] = useState("");
    const [isCooldown, setIsCooldown] = useState(false);
    const [savedCredentials, setSavedCredentials] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    useEffect(() => {
        const storedPort = sessionStorage.getItem("port");
        if (storedPort) setPort(storedPort);

        window.electronAPI.getCredentials().then((data) => {
            if (data && Array.isArray(data)) {
            setSavedCredentials(data);
            if (data.length > 0) {
                    // Auto-select the first saved credential by default.
                    setSelectedIndex(0);
                    setToken(data[0].token);
                }
            }
        }).catch((error) => {
            // console.error("Error fetching saved credentials:", error);
            setResponse("Error fetching saved credentials");
        });
    }, []);

    const handleSaveSettings = async (settings) => {
        console.log("Settings saved:", settings);
    }

    const handleCredentialSelect = (event) => {
        const index = parseInt(event.target.value, 10);
        setSelectedIndex(index);
        if (index >= 0 && savedCredentials[index]) {
            setToken(savedCredentials[index].token);
        } else {
            setToken("");
        }
    };

    // New function: Delete the selected credential
    const handleDeleteCredential = async () => {
        if (selectedIndex >= 0 && savedCredentials[selectedIndex]) {
            const userToken = savedCredentials[selectedIndex].token;
            try {
                // Call an IPC method to delete the credential persistently.
                // Ensure you have implemented window.electronAPI.deleteCredential.
                await window.electronAPI.deleteCredential(userToken);

                // Remove from local state.
                const updatedCredentials = [...savedCredentials];
                updatedCredentials.splice(selectedIndex, 1);
                setSavedCredentials(updatedCredentials);
                
                // Reset selected index and token based on new array
                if (updatedCredentials.length > 0) {
                    setSelectedIndex(0);
                    setToken(updatedCredentials[0].token);
                } else {
                    setSelectedIndex(-1);
                    setToken("");
                }
            } catch (error) {
                // console.error("Error deleting credential:", error);
                setResponse("Error deleting credential");
            }
        }
    };

    const handleLogin = async () => {
        setResponse("");
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000);

            try {
                // Validate token format
                const tokenResult = await window.electronAPI.checkToken(token, saveCredentials);
                if (!tokenResult.valid) {
                    setResponse("Invalid token! Please check your self bot token.");
                    return;
                }
                // If port already in use, show error = response
                const checkPort = await window.electronAPI.checkPort(port);
                if (!checkPort) {
                    setResponse("Port is already in use! Please choose another port.");
                    return;
                };

                // verify config.json
                const configCheck = await window.electronAPI.checkConfig();
                if (!configCheck) {
                    setResponse("Configuration file is missing. You cannot log in until you setup in settings.");
                    return;
                }

                sessionStorage.setItem("port", port);
                window.electronAPI.startBot(token, port); // ✅ Call Electron to run bot
                onLoginSuccess(tokenResult.username); // ✅ Notify parent component of successful login
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
            <Settings
                isOpen={isSettingsOpen}
                onClose={closeSettings}
                onSave={handleSaveSettings}
            />
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
                {savedCredentials.length > 0 && (
                    <div className="credential-select-container">
                        <label htmlFor="credentialSelect">Select Saved Bot:</label>
                        <div className="credential-select-wrapper">
                        <select
                            id="credentialSelect"
                            value={selectedIndex}
                            onChange={handleCredentialSelect}
                        >
                            {savedCredentials.map((cred, index) => (
                            <option key={index} value={index}>
                                {cred.username ? cred.username : "Unknown"} ({cred.token.slice(0, 10)}...)
                            </option>
                            ))}
                            <option value={-1}>Add New</option>
                        </select>
                        <button type="button" className="delete-credential-button" onClick={handleDeleteCredential}>🗑️</button>
                        </div>
                    </div>
                )}
                <div style={{ marginTop: "1px" }}>
                    <input
                        type="checkbox"
                        id="saveToken"
                        checked={saveCredentials}
                        onChange={(e) => setSaveCredentials(e.target.checked)}
                    />
                    <label htmlFor="saveToken">
                        <pre>Save Bot</pre>
                    </label>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <button type="button" onClick={handleLogin} disabled={isCooldown}>
                        {isCooldown ? "Loading..." : "Login"}
                    </button>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <button type="button" onClick={openSettings}>
                        Settings
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