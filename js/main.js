// Main JavaScript Entry Point

// Import configuration and helpers
import Config from './core/config.js';
import Helpers from './core/helpers.js';

// Import modules
import SmoothScroll from './modules/smooth-scroll.js';
import Animations from './modules/animations.js';
import Navbar from './modules/navbar.js';
import Notifications from './modules/notifications.js';
import Counters from './modules/counters.js';

// Main application class
class PuneUniversityApp {
    constructor() {
        this.config = Config;
        this.helpers = Helpers;
        this.modules = {
            smoothScroll: SmoothScroll,
            animations: Animations,
            navbar: Navbar,
            notifications: Notifications,
            counters: Counters
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('Pune University MBA Program - Initializing');
        
        // Check for browser compatibility
        this.checkCompatibility();
        
        // Initialize modules
        this.initModules();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up analytics (if any)
        this.setupAnalytics();
        
        // Set up service worker (if any)
        this.setupServiceWorker();
        
        console.log('Pune University MBA Program - Initialized');
    }

    /**
     * Check browser compatibility
     */
    checkCompatibility() {
        // Check for required features
        const requiredFeatures = [
            'querySelector',
            'addEventListener',
            'classList',
            'requestAnimationFrame',
            'IntersectionObserver'
        ];
        
        const missingFeatures = requiredFeatures.filter(feature => {
            return !(feature in document) && !(feature in window);
        });
        
        if (missingFeatures.length > 0) {
            console.warn('Missing features:', missingFeatures);
            this.showCompatibilityWarning();
        }
    }

    /**
     * Show compatibility warning
     */
    showCompatibilityWarning() {
        const warning = document.createElement('div');
        warning.className = 'compatibility-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <h3>Browser Compatibility Notice</h3>
                <p>Your browser may not support all features of this website. 
                For the best experience, please use the latest version of Chrome, 
                Firefox, Safari, or Edge.</p>
                <button class="btn btn-sm btn-primary" onclick="this.parentNode.parentNode.remove()">
                    Dismiss
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .compatibility-warning {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: #fff3cd;
                border: 1px solid #ffecb5;
                border-radius: 8px;
                padding: 15px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 400px;
            }
            
            .warning-content h3 {
                color: #856404;
                margin-top: 0;
                font-size: 1.2rem;
            }
            
            .warning-content p {
                color: #856404;
                margin-bottom: 15px;
                font-size: 0.95rem;
            }
            
            @media (max-width: 767px) {
                .compatibility-warning {
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(warning);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 10000);
    }

    /**
     * Initialize all modules
     */
    initModules() {
        // Initialize each module
        Object.values(this.modules).forEach(module => {
            if (typeof module.init === 'function') {
                module.init();
            }
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Window load event
        window.addEventListener('load', () => {
            this.onWindowLoad();
        });

        // Before print event
        window.addEventListener('beforeprint', () => {
            this.onBeforePrint();
        });

        // After print event
        window.addEventListener('afterprint', () => {
            this.onAfterPrint();
        });

        // Online/offline events
        window.addEventListener('online', () => {
            this.onOnline();
        });

        window.addEventListener('offline', () => {
            this.onOffline();
        });

        // Page visibility events
        document.addEventListener('visibilitychange', () => {
            this.onVisibilityChange();
        });
    }

    /**
     * Set up analytics
     */
    setupAnalytics() {
        // This is where you would initialize Google Analytics or other analytics tools
        // Example:
        // if (typeof gtag !== 'undefined') {
        //     gtag('config', 'GA_MEASUREMENT_ID');
        // }
        
        // For now, we'll just log page views
        console.log('Page viewed:', window.location.pathname);
    }

    /**
     * Set up service worker
     */
    setupServiceWorker() {
        // Check if service workers are supported
        if ('serviceWorker' in navigator) {
            // Register service worker
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope:', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }

    /**
     * Window load handler
     */
    onWindowLoad() {
        // Update page load time in footer
        const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Show welcome notification on first visit
        if (!localStorage.getItem('visited')) {
            setTimeout(() => {
                this.modules.notifications.info(
                    'Welcome to Pune University MBA Program! Explore our courses and facilities.',
                    8000
                );
                localStorage.setItem('visited', 'true');
            }, 2000);
        }
    }

    /**
     * Before print handler
     */
    onBeforePrint() {
        // Hide unnecessary elements before printing
        document.querySelectorAll('.no-print').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show print-only elements
        document.querySelectorAll('.print-only').forEach(el => {
            el.style.display = 'block';
        });
    }

    /**
     * After print handler
     */
    onAfterPrint() {
        // Restore hidden elements after printing
        document.querySelectorAll('.no-print').forEach(el => {
            el.style.display = '';
        });
        
        // Hide print-only elements
        document.querySelectorAll('.print-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    /**
     * Online handler
     */
    onOnline() {
        this.modules.notifications.success('You are back online!', 3000);
    }

    /**
     * Offline handler
     */
    onOffline() {
        this.modules.notifications.warning('You are offline. Some features may not work.', 5000);
    }

    /**
     * Visibility change handler
     */
    onVisibilityChange() {
        if (document.hidden) {
            console.log('Page hidden');
        } else {
            console.log('Page visible');
        }
    }

    /**
     * Get application version
     * @returns {string} Application version
     */
    getVersion() {
        return '1.0.0';
    }

    /**
     * Get application information
     * @returns {Object} Application info
     */
    getInfo() {
        return {
            name: 'Pune University MBA Program',
            version: this.getVersion(),
            modules: Object.keys(this.modules),
            config: this.config.COLLEGE
        };
    }

    /**
     * Reset application state
     */
    reset() {
        // Reset all modules
        Object.values(this.modules).forEach(module => {
            if (typeof module.reset === 'function') {
                module.reset();
            }
        });
        
        // Clear notifications
        this.modules.notifications.clear();
        
        // Reset visited flag
        localStorage.removeItem('visited');
        
        console.log('Application reset');
    }

    /**
     * Destroy application
     */
    destroy() {
        // Clean up modules
        Object.values(this.modules).forEach(module => {
            if (typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // Remove event listeners
        window.removeEventListener('load', this.onWindowLoad);
        window.removeEventListener('beforeprint', this.onBeforePrint);
        window.removeEventListener('afterprint', this.onAfterPrint);
        window.removeEventListener('online', this.onOnline);
        window.removeEventListener('offline', this.onOffline);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        
        console.log('Application destroyed');
    }
}

// Initialize application when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new PuneUniversityApp();
    
    // Make app available globally for debugging
    window.PuneUniversityApp = app;
});

// Export application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PuneUniversityApp;
}