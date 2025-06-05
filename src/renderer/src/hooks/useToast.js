// Import toast directly instead of using window.showToast
import { toast } from 'react-toastify';

// Toast configuration constants
const TOAST_POSITION = "bottom-right";
const TOAST_THEME = "dark";

const BASE_TOAST_STYLES = {
    background: 'var(--bg-darker)',
    color: 'var(--text-light)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    padding: '16px',
    marginBottom: '12px',
    minHeight: 'initial',
    width: 'auto',
    maxWidth: '400px'
};

const PROGRESS_STYLES = {
    background: 'var(--primary)',
    height: '3px',
};

const TOAST_OPTIONS = {
    position: TOAST_POSITION,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    pauseOnFocusLoss: false,
    theme: TOAST_THEME,
    style: BASE_TOAST_STYLES,
    progressStyle: PROGRESS_STYLES,
    bodyStyle: {
        margin: 0,
        padding: 0
    },
    closeButton: true
};

// Toast type configurations
const TOAST_TYPES = {
    PLAYER_START: {
        type: 'info',
        duration: 5000,
    },
    PLAYER_END: {
        type: 'warning',
        duration: 5000,
    },
    PLAYER_EMPTY: {
        type: 'warning',
        duration: 5000,
    },
    PLAYER_DESTROY: {
        type: 'warning',
        duration: 5000,
    },
};

export const useToast = () => {
    const showToast = (content, type, customDuration) => {
        if (!toast) return;
        try {
            toast.dismiss(type);
            const toastConfig = TOAST_TYPES[type] || TOAST_TYPES.PLAYER_START;
            const options = {
                ...TOAST_OPTIONS,
                autoClose: customDuration || toastConfig.duration,
                toastId: type,
                type: toastConfig.type,
            };
            const toastId = toast(content, options);
            return toastId;
        } catch (error) {
            //
        }
    };
    return { showToast };
}; 