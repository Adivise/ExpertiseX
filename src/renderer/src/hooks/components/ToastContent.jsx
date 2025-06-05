import React from 'react';
import { formatDuration } from '../../utils/format';

// Common styles for all toasts
const TOAST_STYLES = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    color: 'var(--text-light)',
    fontSize: '14px',
    fontWeight: '500'
};

const ICON_STYLES = {
    color: 'var(--primary)',
    fontSize: '16px'
};

const BOT_NAME_STYLES = {
    color: 'var(--text-gray)',
    fontSize: '12px',
    opacity: 0.8
};

// Styles specific to Played toast
const THUMBNAIL_STYLES = {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    objectFit: 'cover',
    flexShrink: 0
};

const PLAYED_CONTENT_STYLES = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    flex: 1,
    maxWidth: 'calc(100% - 56px)'
};

const SONG_NAME_STYLES = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-light)',
    maxWidth: '100%',
    lineHeight: '1.4'
};

// Update TOAST_STYLES for Played component
const PLAYED_TOAST_STYLES = {
    ...TOAST_STYLES,
    padding: '12px',
    gap: '12px'
};

/**
 * Component for displaying currently playing song
 */
export const Played = ({ song, bot, duration }) => {
    const formattedDuration = formatDuration(duration);
    const displayName = song.name || 'Unknown Song';
    const truncatedName = displayName.length > 45 ? displayName.substring(0, 42) + '...' : displayName;

    return (
        <div style={PLAYED_TOAST_STYLES}>
            <img 
                src={song.thumbnail || 'https://i.imgur.com/4M34hi2.png'} 
                alt={truncatedName}
                style={THUMBNAIL_STYLES}
                onError={(e) => {
                    e.target.src = 'https://i.imgur.com/4M34hi2.png';
                }}
            />
            <div style={PLAYED_CONTENT_STYLES}>
                <span style={SONG_NAME_STYLES} title={displayName}>
                    {truncatedName}
                </span>
                {bot?.name && (
                    <span style={BOT_NAME_STYLES}>
                        by {bot.name} • {formattedDuration}
                    </span>
                )}
            </div>
        </div>
    );
};

/**
 * Component for displaying ended song
 */
export const Ended = ({ bot }) => {
    return (
        <div style={TOAST_STYLES}>
            <span style={ICON_STYLES}>⏹️</span>
            <span>Player is Ended</span>
            {bot?.name && (
                <span style={BOT_NAME_STYLES}>
                    by {bot.name}
                </span>
            )}
        </div>
    );
};

/**
 * Component for displaying destroyed player
 */
export const Destroyed = ({ bot }) => {
    return (
        <div style={TOAST_STYLES}>
            <span style={ICON_STYLES}>💥</span>
            <span>Player is Destroyed</span>
            {bot?.name && (
                <span style={BOT_NAME_STYLES}>
                    by {bot.name}
                </span>
            )}
        </div>
    );
};