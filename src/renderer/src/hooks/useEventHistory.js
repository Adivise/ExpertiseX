// Static map to store event history across component remounts
const eventHistory = new Map();

/**
 * Get the event history map
 * @returns {Map} The event history map
 */
export const getEventHistory = () => eventHistory;

/**
 * Add an event to the history
 * @param {string} key - The unique key for the event
 * @param {Object} event - The event data
 */
export const addEvent = (key, event) => {
    eventHistory.set(key, event);
};

/**
 * Check if an event exists in history
 * @param {string} key - The unique key for the event
 * @returns {boolean} Whether the event exists
 */
export const hasEvent = (key) => {
    return eventHistory.has(key);
};

/**
 * Clear all events for a specific bot
 * @param {string} botId - The bot ID to clear events for
 */
export const clearBotEvents = (botId) => {
    for (const [key] of eventHistory) {
        if (key.startsWith(`${botId}:`)) {
            eventHistory.delete(key);
        }
    }
}; 