import { useState, useEffect } from "react";
import MarkdownRenderer from "../../module/MDRender";

const Login = ({ onLoginSuccess }) => {
    // State management
    const [formData, setFormData] = useState({
        token: "",
        port: 3000,
        saveCredentials: false
    });
    const [response, setResponse] = useState("");
    const [isCooldown, setIsCooldown] = useState(false);
    const [savedCredentials, setSavedCredentials] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Constants
    const COOLDOWN_DURATION = 3000;
    const PORT_RANGE = { min: 3000, max: 3999 };

    // Effects
    useEffect(() => {
        loadSavedCredentials();
    }, []);

    const loadSavedCredentials = async () => {
        try {
            const data = await window.electronAPI.getCredentials();
            if (data && Array.isArray(data)) {
                setSavedCredentials(data);
                if (data.length > 0) {
                    setSelectedIndex(0);
                    setFormData(prev => ({ ...prev, token: data[0].token }));
                }
            }
        } catch (error) {
            setResponse("Error fetching saved credentials");
        }
    };

    // Event handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePortChange = (e) => {
        const newPort = parseInt(e.target.value, 10);
        if (newPort < PORT_RANGE.min || newPort > PORT_RANGE.max) {
            setResponse(`Port must be between ${PORT_RANGE.min} and ${PORT_RANGE.max}!`);
            return;
        }
        setFormData(prev => ({ ...prev, port: newPort }));
    };

    const handleCredentialSelect = (e) => {
        const index = parseInt(e.target.value, 10);
        setSelectedIndex(index);
        if (index >= 0 && savedCredentials[index]) {
            setFormData(prev => ({ ...prev, token: savedCredentials[index].token }));
        } else {
            setFormData(prev => ({ ...prev, token: "" }));
        }
    };

    const handleDeleteCredential = async () => {
        if (selectedIndex < 0 || !savedCredentials[selectedIndex]) return;

        try {
            const userToken = savedCredentials[selectedIndex].token;
            await window.electronAPI.deleteCredential(userToken);
            
            const updatedCredentials = savedCredentials.filter((_, index) => index !== selectedIndex);
            setSavedCredentials(updatedCredentials);
            
            if (updatedCredentials.length > 0) {
                setSelectedIndex(0);
                setFormData(prev => ({ ...prev, token: updatedCredentials[0].token }));
            } else {
                setSelectedIndex(-1);
                setFormData(prev => ({ ...prev, token: "" }));
            }
        } catch (error) {
            setResponse("Error deleting credential");
        }
    };

    const handleLogin = async () => {
        if (isCooldown) return;

        setResponse("");
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), COOLDOWN_DURATION);

        try {
            const { token, port, saveCredentials } = formData;

            // Validate token
            const creds = await window.electronAPI.checkToken(token, saveCredentials);
            if (!creds.valid) {
                setResponse("Invalid token! Please check your self bot token.");
                return;
            }

            // Check if user is already logged in
            const activeBots = await window.electronAPI.getActiveBots();
            if (activeBots && activeBots.includes(creds.id)) {
                setResponse("This account is already logged in. Please close the existing session first.");
                return;
            }

            // Check port availability
            const isPortAvailable = await window.electronAPI.checkPort(port);
            if (!isPortAvailable) {
                setResponse("Port is already in use! Please choose another port.");
                return;
            }

            // Verify configuration
            const isConfigValid = await window.electronAPI.checkConfig();
            if (!isConfigValid) {
                setResponse("Configuration file is missing. You cannot log in until you setup in settings.");
                return;
            }

            // Start bot and notify parent
            window.electronAPI.startBot(token, port, creds.id, creds.avatar);
            onLoginSuccess(creds.username, creds.id, port, creds.avatar);
            
            // Clear form
            setFormData(prev => ({ ...prev, token: "" }));
        } catch (error) {
            setResponse(`Error: ${error.response?.data || error.message}`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    // Render helpers
    const renderCredentialSelector = () => {
        if (savedCredentials.length === 0) return null;

        return (
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
                                {cred.username || "Unknown"} ({cred.token.slice(0, 10)}...)
                            </option>
                        ))}
                        <option value={-1}>Add New</option>
                    </select>
                    <button 
                        type="button" 
                        className="delete-credential-button" 
                        onClick={handleDeleteCredential}
                    >
                        🗑️
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div id="logins" className="content">
            <div className="markdown-container">
                <h2>Self Bot Logins</h2>
                <div className="description">
                    <p>Enter the details below to login</p>
                    <ul>
                        <li>Self Bot Token (ex: NzY4NTQ0NjA2NzE3OTI5MjQ1.X3v7Xg.*****)</li>
                        <li>Port (ex: 3000 - 3999) </li>
                    </ul>
                </div>
            </div>

            <form className="styled-form" onKeyDown={handleKeyPress}>
                <input
                    type="password"
                    name="token"
                    placeholder="Put your self bot token in here"
                    value={formData.token}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="port"
                    placeholder="Put your port in here"
                    min={PORT_RANGE.min}
                    max={PORT_RANGE.max}
                    step="1"
                    value={formData.port}
                    onChange={handlePortChange}
                />

                {renderCredentialSelector()}

                <div style={{ marginTop: "1px" }}>
                    <input
                        type="checkbox"
                        id="saveToken"
                        name="saveCredentials"
                        checked={formData.saveCredentials}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="saveToken">
                        <pre>Save Bot</pre>
                    </label>
                </div>

                <div style={{ marginTop: "10px" }}>
                    <button 
                        type="button" 
                        onClick={handleLogin} 
                        disabled={isCooldown}
                    >
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