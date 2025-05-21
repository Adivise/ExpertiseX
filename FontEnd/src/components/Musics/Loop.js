import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../../css/Style.css';
import MarkdownRenderer from '../../module/MDRender';
import config from '../../module/config.json';

const Loop = () => {
    const [guildId, setGuildId] = useState('');
    const [loop, setLoop] = useState({ value: "track", label: 'Current' });
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        if (storedGuildId) setGuildId(storedGuildId);
    }, []);

    const handleLoop = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('guildId', guildId);
                const { data } = await axios.post(`http://${config.ip}:3000/loop`, { guildId, loop: loop.value });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLoop(event);
        }
    };

    const markdownContent = `
Enter the details below to loop the current track or queue.

- **Guild ID**
- **Select Type Mode**
`;

    const loopOption = [
        { value: "track", label: 'Current' },
        { value: "queue", label: 'Queue' },

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
        <div id="loop" className="content">
            <div className="markdown-container">
                <h2>Loop</h2>
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
                    options={loopOption}
                    value={loop}
                    onChange={setLoop}
                    placeholder="Select Type Mode"
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isSearchable={false}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleLoop} disabled={isCooldown}>
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

export default Loop;