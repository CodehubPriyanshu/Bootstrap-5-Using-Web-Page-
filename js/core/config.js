// Configuration and constants

const Config = {
    // Animation settings
    ANIMATION: {
        SCROLL_OFFSET: 100,
        SCROLL_DURATION: 800,
        COUNTER_DURATION: 1500,
        STAGGER_DELAY: 100
    },
    
    // API endpoints (if any)
    API: {
        BASE_URL: '',
        ENDPOINTS: {
            CONTACT: '/api/contact',
            APPLICATION: '/api/application'
        }
    },
    
    // College information
    COLLEGE: {
        NAME: 'Pune University',
        LOCATION: 'Pune, Maharashtra',
        PHONE: '+91 20 2569 0000',
        EMAIL: 'admissions@puniversity.edu.in',
        ADDRESS: 'Ganeshkhind Road, Pune, Maharashtra 411007'
    },
    
    // Notification settings
    NOTIFICATION: {
        DURATION: 5000,
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            INFO: 'info',
            WARNING: 'warning'
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}