import axios from 'axios';

/**
 * Custom hook for managing bot operations
 * @param {Object} tabs - Tabs state and functions
 * @param {Function} removeTab - Function to remove a tab
 * @param {Function} setCurrentTab - Function to set current tab
 * @returns {Object} Bot operation functions
 */
export const useBotOperations = (tabs, removeTab, setCurrentTab) => {
    const handleLogout = async (userId) => {
        if (!userId) return;

        try {
            const port = sessionStorage.getItem(`port_${userId}`);
            if (port) {
                try {
                    await axios.post(`http://localhost:${port}/logout`);
                } catch (error) {
                    console.warn('Server logout request failed:', error.message);
                }

                try {
                    await window.electronAPI.stopBot(userId);
                } catch (error) {
                    console.warn('Bot stop request failed:', error.message);
                }
                
                // Clear session data
                sessionStorage.removeItem(`port_${userId}`);
                sessionStorage.removeItem(`isLoggedIn_${userId}`);
                sessionStorage.removeItem(`username_${userId}`);
            }
        } catch (error) {
            console.error('Error during logout cleanup:', error);
        } finally {
            removeTab(userId);
            if (tabs.currentTab === userId) {
                setCurrentTab(null);
            }
        }
    };

    return { handleLogout };
}; 