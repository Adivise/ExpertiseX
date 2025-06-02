import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../../assets/Style.css';
import MarkdownRenderer from '../../module/MDRender';

const AutoPlay = () => {
    const [guildId, setGuildId] = useState('');
    const [autoplay, setAutoplay] = useState({ value: true, label: 'Active' });
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');

    useEffect(() => {
        const storedGuildId = sessionStorage.getItem('guildId');
        const storedPort = sessionStorage.getItem('port');
        if (storedGuildId) setGuildId(storedGuildId);
        if (storedPort) setPort(storedPort);
    }, []);

    const handleAutoPlay = async (event) => {
        event.preventDefault();
        setResponse(''); // Clear the old response
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000); // 3-second cooldown
            try {
                sessionStorage.setItem('guildId', guildId);
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

    const markdownContent = `
Enter the details below to toggle autoplay mode.

- **Guild ID**
- **Select Type Mode**
`;

    const autoplayOption = [
        { value: true, label: 'Active' },
        { value: false, label: 'Deactive' }
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'var(--bg-darker)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-light)',
            borderRadius: '4px',
            minHeight: '36px',
            boxShadow: 'none',
            transition: 'all var(--transition-fast)',
            '&:hover': {
                borderColor: 'var(--primary)',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--bg-darker)',
            padding: '4px',
            color: 'var(--text-light)',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-color)',
            marginTop: '4px',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'var(--hover-bg)' : 'transparent',
            color: state.isFocused ? 'var(--text-light)' : 'var(--text-gray)',
            padding: '6px 8px',
            transition: 'all var(--transition-fast)',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            '&:active': {
                backgroundColor: 'var(--primary)',
                color: 'var(--text-light)',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'var(--text-light)',
            fontWeight: '500',
            fontSize: '0.875rem',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'var(--text-gray)',
            fontStyle: 'normal',
            fontSize: '0.875rem',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'var(--text-gray)',
            padding: '0 4px',
            transition: 'all var(--transition-fast)',
            '&:hover': {
                color: 'var(--text-light)',
            },
        }),
        input: (provided) => ({
            ...provided,
            color: 'var(--text-light)',
            fontSize: '0.875rem',
            margin: '0',
            padding: '0',
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '2px 6px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            padding: '0 2px',
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: 'var(--text-gray)',
            padding: '0 4px',
            transition: 'all var(--transition-fast)',
            '&:hover': {
                color: 'var(--text-light)',
            },
        }),
    };

    return (
        <div id="autoplay" className="content">
            <div className="markdown-container">
                <h2>AutoPlay</h2>
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