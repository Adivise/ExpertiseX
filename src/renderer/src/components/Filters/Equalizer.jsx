import { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownRenderer from '../../module/MDRender';

const Equalizer = ({ userId }) => {
    const [guildId, setGuildId] = useState('');
    const [response, setResponse] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [port, setPort] = useState('');
    const [bands, setBands] = useState(() => {
        // Try to load saved bands from session storage
        const savedBands = sessionStorage.getItem('equalizerBands');
        return savedBands ? JSON.parse(savedBands) : Array(14).fill(0);
    });

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

    // Save bands to session storage whenever they change
    useEffect(() => {
        sessionStorage.setItem('equalizerBands', JSON.stringify(bands));
    }, [bands]);

    const saveValues = async () => {
        try {
            const existingData = await window.electronAPI.getSessionData(userId) || {};
            await window.electronAPI.saveSessionData(userId, {
                ...existingData,
                guildId: guildId
            });
        } catch (error) {
            console.error('Error saving values:', error);
        }
    };

    const handleEqualizer = async (event) => {
        event.preventDefault();
        setResponse('');
        if (!isCooldown) {
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 3000);
            try {
                const { data } = await axios.post(`http://localhost:${port}/equalizer`, { 
                    guildId,
                    bands: bands.join(' ')
                });
                setResponse(data.content);
                await saveValues();
            } catch (error) {
                setResponse(
                    error.response?.data?.content
                        ? `Error: ${error.response.data.content}`
                        : `Error: ${error.message}`
                );
            }
        }
    };

    const handleReset = async () => {
        setBands(Array(14).fill(0));
        try {
            const { data } = await axios.post(`http://localhost:${port}/equalizer`, { 
                guildId,
                bands: 'reset'
            });
            setResponse(data.content);
            await saveValues();
        } catch (error) {
            setResponse(
                error.response?.data?.content
                    ? `Error: ${error.response.data.content}`
                    : `Error: ${error.message}`
            );
        }
    };

    const handleBandChange = (index, value) => {
        const newBands = [...bands];
        newBands[index] = Math.max(-10, Math.min(10, value));
        setBands(newBands);
    };

    return (
        <div id="equalizer" className="content">
            <div className="markdown-container">
                <h2>Equalizer</h2>
                <div className="description">
                    <p>Enter the details below to set the equalizer filter.</p>
                    <ul>
                        <li>Guild ID (ex: 1234567890)</li>
                    </ul>
                </div>
            </div>

            <form className="styled-form" onSubmit={handleEqualizer}>
                <input
                    type="text"
                    placeholder="Guild ID"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                />

                <div className="filter-controls" style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '20px'
                }}>
                    <button type="submit" disabled={isCooldown}>
                        {isCooldown ? 'Cooldown...' : 'Submit'}
                    </button>
                    <button type="button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>

            <div className="equalizer-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '12px',
                marginTop: '20px',
                marginBottom: '20px',
                padding: '20px',
                background: 'var(--bg-dark)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
                {bands.map((value, index) => (
                    <div key={index} className="equalizer-band" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s ease',
                        ':hover': {
                            background: 'var(--bg-darker)'
                        }
                    }}>
                        <input
                            type="range"
                            min="-10"
                            max="10"
                            value={value}
                            onChange={(e) => handleBandChange(index, parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                height: '120px',
                                writingMode: 'vertical-lr',
                                direction: 'rtl',
                                background: 'var(--bg-darker)',
                                borderRadius: '8px',
                                outline: 'none',
                                cursor: 'pointer',
                                transform: 'rotate(180deg)',
                                padding: '0 4px',
                                border: '1px solid var(--border-color)'
                            }}
                        />
                        <span style={{
                            color: 'var(--text-gray)',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: 'var(--bg-darker)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            minWidth: '32px',
                            textAlign: 'center'
                        }}>
                            {value}
                        </span>
                        <span style={{
                            color: 'var(--text-muted)',
                            fontSize: '11px',
                            fontWeight: '500'
                        }}>
                            Band {index + 1}
                        </span>
                    </div>
                ))}
            </div>

            {response && (
                <div className="response-container">
                    <MarkdownRenderer content={response} />
                </div>
            )}
        </div>
    );
};

export default Equalizer;
