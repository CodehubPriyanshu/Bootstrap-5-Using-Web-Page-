// Notifications Module

class Notifications {
    /**
     * Initialize notifications
     * @param {HTMLElement} element - Element to initialize on
     */
    static init(element = document) {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            Notifications.createContainer();
        }
        
        // Add notification styles
        Notifications.addStyles();
    }

    /**
     * Create notification container
     */
    static createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    /**
     * Add notification styles
     */
    static addStyles() {
        // Check if styles already added
        if (document.querySelector('#notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 1080;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            }
            
            .notification {
                background: white;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                overflow: hidden;
                animation: slideIn 0.3s ease;
                transform: translateX(0);
            }
            
            .notification.notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification.notification-error {
                border-left: 4px solid #dc3545;
            }
            
            .notification.notification-info {
                border-left: 4px solid #17a2b8;
            }
            
            .notification.notification-warning {
                border-left: 4px solid #ffc107;
            }
            
            .notification-content {
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-light);
                line-height: 1;
                padding: 0;
                margin-left: 15px;
                transition: var(--transition-normal);
            }
            
            .notification-close:hover {
                color: var(--text-dark);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @media (max-width: 767px) {
                .notification-container {
                    max-width: calc(100% - 40px);
                    right: 10px;
                    left: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds (0 for persistent)
     * @returns {HTMLElement} Notification element
     */
    static show(message, type = Config.NOTIFICATION.TYPES.INFO, duration = Config.NOTIFICATION.DURATION) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Create notification content
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        // Create message span
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close notification');
        
        // Assemble notification
        content.appendChild(messageSpan);
        content.appendChild(closeButton);
        notification.appendChild(content);
        
        // Get container
        let container = document.getElementById('notification-container');
        if (!container) {
            Notifications.createContainer();
            container = document.getElementById('notification-container');
        }
        
        // Add to container
        container.appendChild(notification);
        
        // Add close event
        closeButton.addEventListener('click', () => {
            Notifications.hide(notification);
        });
        
        // Auto hide if duration is specified
        if (duration > 0) {
            setTimeout(() => {
                Notifications.hide(notification);
            }, duration);
        }
        
        // Return notification element for external control
        return notification;
    }

    /**
     * Hide notification
     * @param {HTMLElement} notification - Notification element to hide
     */
    static hide(notification) {
        if (!notification || !notification.parentNode) return;
        
        // Add slide out animation
        notification.style.animation = 'slideOut 0.3s ease forwards';
        
        // Remove after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Hide all notifications
     */
    static hideAll() {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notifications = container.querySelectorAll('.notification');
        notifications.forEach(notification => {
            Notifications.hide(notification);
        });
    }

    /**
     * Show success notification
     * @param {string} message - Success message
     * @param {number} duration - Duration in milliseconds
     * @returns {HTMLElement} Notification element
     */
    static success(message, duration = Config.NOTIFICATION.DURATION) {
        return Notifications.show(message, Config.NOTIFICATION.TYPES.SUCCESS, duration);
    }

    /**
     * Show error notification
     * @param {string} message - Error message
     * @param {number} duration - Duration in milliseconds
     * @returns {HTMLElement} Notification element
     */
    static error(message, duration = Config.NOTIFICATION.DURATION) {
        return Notifications.show(message, Config.NOTIFICATION.TYPES.ERROR, duration);
    }

    /**
     * Show info notification
     * @param {string} message - Info message
     * @param {number} duration - Duration in milliseconds
     * @returns {HTMLElement} Notification element
     */
    static info(message, duration = Config.NOTIFICATION.DURATION) {
        return Notifications.show(message, Config.NOTIFICATION.TYPES.INFO, duration);
    }

    /**
     * Show warning notification
     * @param {string} message - Warning message
     * @param {number} duration - Duration in milliseconds
     * @returns {HTMLElement} Notification element
     */
    static warning(message, duration = Config.NOTIFICATION.DURATION) {
        return Notifications.show(message, Config.NOTIFICATION.TYPES.WARNING, duration);
    }

    /**
     * Get all active notifications
     * @returns {Array} Array of notification elements
     */
    static getAll() {
        const container = document.getElementById('notification-container');
        if (!container) return [];
        
        return Array.from(container.querySelectorAll('.notification'));
    }

    /**
     * Get notification count
     * @returns {number} Number of active notifications
     */
    static getCount() {
        return Notifications.getAll().length;
    }

    /**
     * Clear all notifications
     */
    static clear() {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        container.innerHTML = '';
    }

    /**
     * Set notification position
     * @param {string} position - CSS position (top-left, top-right, bottom-left, bottom-right)
     */
    static setPosition(position = 'top-right') {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        // Remove existing position classes
        container.classList.remove('top-left', 'top-right', 'bottom-left', 'bottom-right');
        
        // Add new position class
        container.classList.add(position);
        
        // Update styles based on position
        const positions = {
            'top-left': { top: '100px', left: '20px', right: 'auto', bottom: 'auto' },
            'top-right': { top: '100px', right: '20px', left: 'auto', bottom: 'auto' },
            'bottom-left': { bottom: '20px', left: '20px', right: 'auto', top: 'auto' },
            'bottom-right': { bottom: '20px', right: '20px', left: 'auto', top: 'auto' }
        };
        
        const pos = positions[position] || positions['top-right'];
        Object.assign(container.style, pos);
    }
}

// Initialize notifications when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Notifications.init();
});

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notifications;
}