import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import MarkdownRenderer from '../../module/MDRender';

const Loop = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [loop, setLoop] = useState({ value: "track", label: 'Current' });
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const loadSavedValues = async () => {
            try {
                const sessionData = await window.electronAPI.getSessionData(userId);
                if (sessionData) {
                    if (sessionData.guildId) setGuildId(sessionData.guildId);
                }
                const storedPort = sessionStorage.getItem(`port_${userId}`);
                if (storedPort) setPort(storedPort);
            } catch (error) {
                console.error('Error loading saved values:', error);
            }
        };
        loadSavedValues();
    }, [userId]);

    const saveValues = async () => {
        try {
            // Get existing data first
            const existingData = await window.electronAPI.getSessionData(userId) || {};
            // Only update guildId while preserving voiceId and other data
            await window.electronAPI.saveSessionData(userId, {
                ...existingData,  // Keep all existing data
                guildId: guildId  // Only update guildId
            });
        } catch (error) {
            console.error('Error saving values:', error);
        }
    };

    const handleLoop = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                const { data } = await axios.post(`http://localhost:${port}/loop`, { guildId, loop: loop.value });
                setResponse(data.content);
                // Save values after successful play
                await saveValues();
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

    const loopOption = [
        { value: "track", label: 'Current' },
        { value: "queue", label: 'Queue' },

    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'var(--bg-darker)',
            border: '2px solid var(--border-color)',
            color: 'var(--text-light)',
            borderRadius: '8px',
            minHeight: '42px',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: 'var(--primary)',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
            },
            '&:focus-within': {
                borderColor: 'var(--primary)',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--bg-darker)',
            padding: '8px',
            color: 'var(--text-light)',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-color)',
            marginTop: '8px',
            animation: 'fadeIn 0.2s ease-out',
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'var(--bg-dark)' : 'transparent',
            color: state.isFocused ? 'var(--text-light)' : 'var(--text-gray)',
            padding: '10px 12px',
            transition: 'all 0.2s ease',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: state.isSelected ? '600' : '400',
            '&:active': {
                backgroundColor: 'var(--primary)',
                color: 'var(--text-light)',
            },
            '&:hover': {
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-light)',
                transform: 'translateX(4px)',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'var(--text-light)',
            fontWeight: '500',
            fontSize: '0.95rem',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'var(--text-muted)',
            fontStyle: 'normal',
            fontSize: '0.95rem',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'var(--text-gray)',
            padding: '0 8px',
            transition: 'all 0.3s ease',
            '&:hover': {
                color: 'var(--text-light)',
                transform: 'rotate(180deg)',
            },
        }),
        input: (provided) => ({
            ...provided,
            color: 'var(--text-light)',
            fontSize: '0.95rem',
            margin: '0',
            padding: '0',
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '4px 8px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            padding: '0 4px',
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: 'var(--text-gray)',
            padding: '0 8px',
            transition: 'all 0.3s ease',
            '&:hover': {
                color: 'var(--text-light)',
                transform: 'scale(1.1)',
            },
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '4px',
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'var(--bg-darker)',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: 'var(--primary)',
                borderRadius: '4px',
                border: '2px solid var(--bg-darker)',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: 'var(--primary-dark)',
            },
        }),
    };
    
    return (
        <div id="loop" className="content">
            <div className="markdown-container">
                <h2>Loop</h2>
                <div className="description">
                    <p>Enter the details below to loop the current track or queue.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Select Type Mode (ex: Current or Queue)</li>
                    </ul>
                </div>
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