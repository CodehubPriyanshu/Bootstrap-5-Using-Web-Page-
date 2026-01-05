// Event handling and initialization

class EventManager {
    constructor() {
        this.modules = new Map();
        this.events = new Map();
    }

    /**
     * Initialize all modules
     */
    init() {
        this.initializeModules();
        this.setupEventListeners();
        this.setupResizeHandler();
        this.setupScrollHandler();
    }

    /**
     * Initialize all registered modules
     */
    initializeModules() {
        // Find all elements with data-module attribute
        const moduleElements = document.querySelectorAll('[data-module]');
        
        moduleElements.forEach(element => {
            const moduleNames = element.dataset.module.split(' ');
            
            moduleNames.forEach(moduleName => {
                this.initializeModule(moduleName, element);
            });
        });
    }

    /**
     * Initialize a specific module
     * @param {string} moduleName - Name of the module
     * @param {HTMLElement} element - Element to initialize module on
     */
    initializeModule(moduleName, element) {
        // Map module names to their initialization functions
        const moduleMap = {
            'smooth-scroll': SmoothScroll.init,
            'animations': Animations.init,
            'navbar': Navbar.init,
            'notifications': Notifications.init,
            'counters': Counters.init
        };

        if (moduleMap[moduleName]) {
            if (!this.modules.has(moduleName)) {
                this.modules.set(moduleName, new Set());
            }
            
            moduleMap[moduleName](element);
            this.modules.get(moduleName).add(element);
            
            console.log(`Module "${moduleName}" initialized on`, element);
        } else {
            console.warn(`Module "${moduleName}" not found`);
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Window load event
        window.addEventListener('load', () => {
            this.onWindowLoad();
        });

        // DOM content loaded event
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMContentLoaded();
        });

        // Before unload event
        window.addEventListener('beforeunload', () => {
            this.onBeforeUnload();
        });

        // Error handling
        window.addEventListener('error', (event) => {
            this.onError(event);
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            this.onUnhandledRejection(event);
        });
    }

    /**
     * Setup resize handler with debouncing
     */
    setupResizeHandler() {
        const handleResize = Helpers.debounce(() => {
            this.onResize();
        }, 250);

        window.addEventListener('resize', handleResize);
        this.events.set('resize', handleResize);
    }

    /**
     * Setup scroll handler with throttling
     */
    setupScrollHandler() {
        const handleScroll = Helpers.throttle(() => {
            this.onScroll();
        }, 100);

        window.addEventListener('scroll', handleScroll);
        this.events.set('scroll', handleScroll);
    }

    /**
     * Window load handler
     */
    onWindowLoad() {
        console.log('Window loaded');
        
        // Trigger animations after page is fully loaded
        setTimeout(() => {
            Animations.handleScrollAnimations();
        }, 500);

        // Update statistics
        Counters.animateAll();
    }

    /**
     * DOM content loaded handler
     */
    onDOMContentLoaded() {
        console.log('DOM content loaded');
        
        // Initialize scroll to top button
        this.initScrollToTop();
        
        // Initialize form handling
        this.initForms();
        
        // Initialize apply buttons
        this.initApplyButtons();
    }

    /**
     * Window resize handler
     */
    onResize() {
        // Handle responsive behaviors
        const deviceType = Helpers.getDeviceType();
        
        // Update body class for device type
        document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        document.body.classList.add(`device-${deviceType}`);
        
        // Re-initialize modules if needed
        this.handleResponsiveModules();
    }

    /**
     * Window scroll handler
     */
    onScroll() {
        // Handle scroll animations
        Animations.handleScrollAnimations();
        
        // Handle navbar scroll effect
        Navbar.handleScroll();
        
        // Handle scroll to top button visibility
        this.handleScrollToTop();
    }

    /**
     * Before unload handler
     */
    onBeforeUnload() {
        // Cleanup if needed
        console.log('Page unloading');
    }

    /**
     * Error handler
     */
    onError(event) {
        console.error('Error:', event.error);
        
        // Show user-friendly error message
        Notifications.show(
            'An error occurred. Please try again later.',
            Config.NOTIFICATION.TYPES.ERROR
        );
    }

    /**
     * Unhandled promise rejection handler
     */
    onUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Show user-friendly error message
        Notifications.show(
            'Something went wrong. Please try again.',
            Config.NOTIFICATION.TYPES.ERROR
        );
    }

    /**
     * Handle responsive modules
     */
    handleResponsiveModules() {
        // Reinitialize modules that need to respond to resize
        this.modules.forEach((elements, moduleName) => {
            if (moduleName === 'animations') {
                elements.forEach(element => {
                    Animations.handleScrollAnimations();
                });
            }
        });
    }

    /**
     * Initialize scroll to top button
     */
    initScrollToTop() {
        const scrollButton = document.getElementById('scrollToTop');
        if (!scrollButton) return;

        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Handle scroll to top button visibility
     */
    handleScrollToTop() {
        const scrollButton = document.getElementById('scrollToTop');
        if (!scrollButton) return;

        if (window.scrollY > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    }

    /**
     * Initialize forms
     */
    initForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Simple form validation
                const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('is-invalid');
                    } else {
                        input.classList.remove('is-invalid');
                    }
                });
                
                if (isValid) {
                    // In a real application, submit the form data to a server
                    Notifications.show(
                        'Form submitted successfully! We will contact you soon.',
                        Config.NOTIFICATION.TYPES.SUCCESS
                    );
                    form.reset();
                } else {
                    Notifications.show(
                        'Please fill in all required fields.',
                        Config.NOTIFICATION.TYPES.ERROR
                    );
                }
            });
        });
    }

    /**
     * Initialize apply buttons
     */
    initApplyButtons() {
        const applyButtons = document.querySelectorAll('.apply-btn, .hero-apply-btn, .btn-apply-footer');
        
        applyButtons.forEach(button => {
            // If it's a link to #apply, let smooth scrolling handle it
            if (button.getAttribute('href') === '#apply') {
                return;
            }
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Scroll to apply section
                const applySection = document.getElementById('apply');
                if (applySection) {
                    Helpers.scrollTo(applySection, {
                        offset: 80,
                        duration: 800
                    });
                    
                    // Show a confirmation message
                    Notifications.show(
                        'Application form will be available soon. Please check back later or contact admissions office.',
                        Config.NOTIFICATION.TYPES.INFO
                    );
                } else {
                    Notifications.show(
                        'Thank you for your interest! Our admissions team will contact you soon.',
                        Config.NOTIFICATION.TYPES.SUCCESS
                    );
                }
            });
        });
    }

    /**
     * Destroy all modules and clean up
     */
    destroy() {
        // Remove event listeners
        this.events.forEach((handler, eventName) => {
            window.removeEventListener(eventName, handler);
        });
        
        // Clear modules
        this.modules.clear();
        this.events.clear();
    }
}

// Initialize event manager when DOM is ready
let eventManager;

document.addEventListener('DOMContentLoaded', () => {
    eventManager = new EventManager();
    eventManager.init();
});

// Export event manager
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventManager;
}