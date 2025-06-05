import React from 'react';

export const SuggestionItem = ({ suggestion, onSelect }) => {
    const formatDuration = (duration) => {
        if (!duration) return '';
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <button 
            className="suggestion-item"
            onClick={() => onSelect(suggestion)}
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                borderRadius: '4px',
                gap: '12px'
            }}
        >
            <div 
                className="suggestion-thumbnail"
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    flexShrink: 0
                }}
            >
                <img 
                    src={suggestion.thumbnail} 
                    alt={suggestion.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
            <div 
                className="suggestion-content"
                style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'left'
                }}
            >
                <div 
                    className="suggestion-title"
                    style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--text-light)',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {suggestion.name}
                </div>
                <div 
                    className="suggestion-subtitle"
                    style={{
                        fontSize: '12px',
                        color: 'var(--text-gray)'
                    }}
                >
                    {formatDuration(suggestion.duration)}
                </div>
            </div>
        </button>
    );
}; 