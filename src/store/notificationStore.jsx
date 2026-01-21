/* ════════════════════════════════════════
store/notificationStore.js
════════════════════════════════════════ */

import { toast } from 'react-toastify'

// Config par défaut des toasts
const defaultOptions = {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
}

const NotificationStore = {
    // Raccourcis par type
    success: (message, duration = 4000) => {
        toast.success(message, {
            ...defaultOptions,
            autoClose: duration,
            toastId: message
        })
    },

    error: (message, duration = 5000) => {
        toast.error(message, {
            ...defaultOptions,
            autoClose: duration,
            toastId: message
        })
    },

    warning: (message, duration = 4000) => {
        toast.warn(message, {
            ...defaultOptions,
            autoClose: duration,
            toastId: message
        })
    },

    info: (message, duration = 4000) => {
        toast.info(message, {
            ...defaultOptions,
            autoClose: duration,
            toastId: message
        })
    },
}

export default NotificationStore