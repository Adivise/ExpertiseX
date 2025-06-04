/**
 * Custom hook for managing session storage
 * @returns {Object} Session storage management functions
 */
export const useSessionStorage = () => {
    const setSessionData = (userId, username, port) => {
        sessionStorage.setItem(`isLoggedIn_${userId}`, 'true');
        sessionStorage.setItem(`port_${userId}`, port.toString());
        sessionStorage.setItem(`username_${userId}`, username);
    };

    const clearSessionData = (userId) => {
        sessionStorage.removeItem(`port_${userId}`);
        sessionStorage.removeItem(`isLoggedIn_${userId}`);
        sessionStorage.removeItem(`username_${userId}`);
    };

    const getPort = (userId) => sessionStorage.getItem(`port_${userId}`);

    return {
        setSessionData,
        clearSessionData,
        getPort
    };
}; 