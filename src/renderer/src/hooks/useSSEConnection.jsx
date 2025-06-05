import React, { useCallback, useRef, useEffect } from 'react';
import { useToast } from './useToast';
import { Played, Ended, Destroyed } from './components/ToastContent';

const RECONNECT_DELAY = 5000;
const DEFAULT_THUMBNAIL = 'https://i.imgur.com/4M34hi2.png';

// Keep track of all active connections
const activeConnections = new Map();

export const useSSEConnection = () => {
    const { showToast } = useToast();

    const connect = useCallback((userId) => {
        if (activeConnections.has(userId)) return;

        const port = sessionStorage.getItem(`port_${userId}`);
        if (!port) return;

        const url = `http://localhost:${port}/song-events`;

        try {
            const eventSource = new EventSource(url);
            activeConnections.set(userId, {
                eventSource,
                reconnectTimeout: null
            });

            eventSource.addEventListener('playerStart', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const toastContent = (
                        <Played
                            song={{ 
                                name: data.name || 'Unknown Song', 
                                url: data.url, 
                                thumbnail: data.thumbnail || DEFAULT_THUMBNAIL,
                                author: data.author 
                            }} 
                            bot={{
                                name: data.botUsername,
                                avatar: data.botAvatar
                            }}
                            duration={data.duration}
                        />
                    );
                    showToast(toastContent, 'PLAYER_START');
                } catch (error) {
                    //
                }
            });

            eventSource.addEventListener('playerEnd', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const toastContent = (
                        <Ended 
                            bot={{
                                name: data.botUsername,
                                avatar: data.botAvatar
                            }}
                        />
                    );
                    showToast(toastContent, 'PLAYER_END');
                } catch (error) {
                    //
                }
            });

            eventSource.addEventListener('playerDestroy', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const toastContent = (
                        <Destroyed 
                            bot={{
                                name: data.botUsername,
                                avatar: data.botAvatar
                            }}
                        />
                    );
                    showToast(toastContent, 'PLAYER_DESTROY');
                } catch (error) {
                    //
                }
            });

            eventSource.addEventListener('connected', (event) => {
            });

            eventSource.onerror = (error) => {
                disconnect(userId);
                scheduleReconnect(userId);
            };

        } catch (error) {
            //
        }
    }, [showToast]);

    const disconnect = useCallback((userId) => {
        const connection = activeConnections.get(userId);
        if (connection) {
            if (connection.eventSource) {
                connection.eventSource.close();
            }
            if (connection.reconnectTimeout) {
                clearTimeout(connection.reconnectTimeout);
            }
            activeConnections.delete(userId);
        }
    }, []);

    const scheduleReconnect = useCallback((userId) => {
        const connection = activeConnections.get(userId);
        if (connection) {
            if (connection.reconnectTimeout) {
                clearTimeout(connection.reconnectTimeout);
            }
            connection.reconnectTimeout = setTimeout(() => {
                if (!activeConnections.has(userId)) {
                    connect(userId);
                }
            }, RECONNECT_DELAY);
        }
    }, [connect]);

    return { connect, disconnect };
}; 