import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import MarkdownRenderer from '../../module/MDRender';

const AutoPlay = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [autoplay, setAutoplay] = useState({ value: true, label: 'Active' });
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem(`guildId_${userId}`);
        const storedPort = sessionStorage.getItem(`port_${userId}`);
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedPort) setPort(storedPort);
    }, [userId]);

    const handleAutoPlay = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem(`guildId_${userId}`, guildId);
                const { data } = await axios.post(`http://localhost:${port}/autoplay`, { guildId, autoplay: autoplay.value });
                setResponse(data.content);
            } catch (error) {
                setResponse(`Error: ${error.response?.data || error.message}`);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAutoPlay(event);
        }
    };
    
    const autoplayOption = [
        { value: true, label: 'Active' },
        { value: false, label: 'Deactive' }
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
        <div id="autoplay" className="content">
            <div className="markdown-container">
                <h2>AutoPlay</h2>
                <div className="description">
                    <p>Enter the details below to toggle autoplay mode.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                        <li>Select Type Mode (ex: Active or Deactive)</li>
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
                    options={autoplayOption}
                    value={autoplay}
                    onChange={setAutoplay}
                    placeholder="Select Type Mode"
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isSearchable={false}
                />
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleAutoPlay} disabled={isCooldown}>
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

export default AutoPlay;