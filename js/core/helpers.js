// Helper functions and utilities

class Helpers {
    /**
     * Debounce function to limit the rate at which a function can fire
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit the rate at which a function can fire
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     * @param {HTMLElement} el - Element to check
     * @param {number} offset - Offset from viewport edge
     * @returns {boolean} True if element is in viewport
     */
    static isInViewport(el, offset = 0) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 + offset &&
            rect.bottom >= 0 - offset
        );
    }

    /**
     * Get CSS variable value
     * @param {string} variable - CSS variable name
     * @returns {string} CSS variable value
     */
    static getCSSVariable(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    /**
     * Set CSS variable value
     * @param {string} variable - CSS variable name
     * @param {string} value - CSS variable value
     */
    static setCSSVariable(variable, value) {
        document.documentElement.style.setProperty(variable, value);
    }

    /**
     * Format phone number
     * @param {string} phone - Phone number to format
     * @returns {string} Formatted phone number
     */
    static formatPhone(phone) {
        return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
    }

    /**
     * Capitalize first letter of each word
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    static capitalize(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Create a unique ID
     * @returns {string} Unique ID
     */
    static generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Check if device is tablet
     * @returns {boolean} True if tablet device
     */
    static isTablet() {
        return /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
    }

    /**
     * Check if device is desktop
     * @returns {boolean} True if desktop device
     */
    static isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }

    /**
     * Get device type
     * @returns {string} Device type (mobile, tablet, desktop)
     */
    static getDeviceType() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    }

    /**
     * Sanitize HTML string
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Parse JSON safely
     * @param {string} str - JSON string to parse
     * @param {*} defaultValue - Default value if parsing fails
     * @returns {*} Parsed JSON or default value
     */
    static parseJSON(str, defaultValue = {}) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return defaultValue;
        }
    }

    /**
     * Scroll to element
     * @param {HTMLElement|string} element - Element or selector to scroll to
     * @param {Object} options - Scroll options
     */
    static scrollTo(element, options = {}) {
        const defaultOptions = {
            offset: 80,
            duration: 800,
            easing: 'easeInOutCubic'
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        let targetElement;
        if (typeof element === 'string') {
            targetElement = document.querySelector(element);
        } else {
            targetElement = element;
        }

        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - finalOptions.offset;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = Helpers.easing(timeElapsed, startPosition, distance, finalOptions.duration, finalOptions.easing);
            window.scrollTo(0, run);
            if (timeElapsed < finalOptions.duration) requestAnimationFrame(animation);
        }

        requestAnimationFrame(animation);
    }

    /**
     * Easing functions for animations
     */
    static easing(t, b, c, d, type = 'easeInOutCubic') {
        const easingFunctions = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInQuart: t => t * t * t * t,
            easeOutQuart: t => 1 - (--t) * t * t * t,
            easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
            easeInQuint: t => t * t * t * t * t,
            easeOutQuint: t => 1 + (--t) * t * t * t * t,
            easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
        };

        const easingFunction = easingFunctions[type] || easingFunctions.easeInOutCubic;
        const progress = Math.min(t / d, 1);
        return b + c * easingFunction(progress);
    }
}

// Export helpers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Helpers;
}