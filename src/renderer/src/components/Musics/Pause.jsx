import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../../assets/Style.css';
import MarkdownRenderer from '../../module/MDRender';

const Pause = () => {
    const [guildId, setGuildId] = useState('');
    const [pause, setPause] = useState({ value: true, label: 'Paused' });
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        const storedPort = sessionStorage.getItem('port');
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedPort) setPort(storedPort);
    }, []);

    const handlePause = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('guildId', guildId);
                const env = await window.electronAPI.getEnv();
                const { data } = await axios.post(`http://${env.ip}:${port}/pause`, { guildId, pause: pause.value });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handlePause(event);
        }
    };

    const markdownContent = `
Enter the details below to pause or resume the song.

- **Guild ID**
- **Select Type Mode**
`;

    const PauseOption = [
        { value: true, label: 'Paused' },
        { value: false, label: 'Resumed' },

    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#222831',
            border: '1px solid #00adb5',
            color: '#00adb5',
            borderRadius: '8px', // Increased border radius for a smoother look
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Slightly increased shadow for better depth
            transition: 'border-color 0.3s, box-shadow 0.3s',
            '&:hover': {
                borderColor: '#00fff5',
                boxShadow: '0 0 12px #00fff5', // Increased shadow on hover for a more pronounced effect
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#222831',
            color: '#00adb5',
            padding: '10px',
            borderRadius: '8px', // Increased border radius for a smoother look
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Slightly increased shadow for better depth
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#00adb5' : '#222831',
            color: state.isFocused ? '#ffffff' : '#00adb5',
            padding: '12px', // Increased padding for better spacing
            transition: 'background-color 0.3s, color 0.3s',
            '&:active': {
                backgroundColor: '#00fff5',
                color: '#ffffff',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#00adb5',
            fontWeight: 'bold', // Added bold font weight for better emphasis
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#00adb5', // Styled the placeholder text
            fontStyle: 'italic', // Added italic style for the placeholder text
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#00adb5', // Styled the dropdown indicator
            '&:hover': {
                color: '#00fff5', // Changed color on hover for the dropdown indicator
            },
        }),
    };

    return (
        <div id="pause" className="content">
            <div className="markdown-container">
                <h2>Pause</h2>
                <MarkdownRenderer content={markdownContent} />
            </div>
            <form className="styled-form" onKeyDown={handleKeyPress}>
                <input
                    type="text"
                    placeholder="Guild ID"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                />
                <Select
                    options={PauseOption}
                    value={pause}
                    onChange={setPause}
                    placeholder="Select Type Mode"
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isSearchable={false}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handlePause} disabled={isCooldown}>
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

export default Pause;