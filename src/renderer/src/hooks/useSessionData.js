/**
 * Custom hook for managing session data (guildId and voiceId)
 * @returns {Object} Session data management functions
 */
export const useSessionData = () => {
    const saveSessionData = async (userId, guildId, voiceId) => {
        try {
            await window.electronAPI.saveSessionData(userId, { guildId, voiceId });
        } catch (error) {
            console.error('Error saving session data:', error);
        }
    };

    const getSessionData = async (userId) => {
        try {
            return await window.electronAPI.getSessionData(userId);
        } catch (error) {
            console.error('Error getting session data:', error);
            return null;
        }
    };

    return {
        saveSessionData,
        getSessionData
    };
}; 