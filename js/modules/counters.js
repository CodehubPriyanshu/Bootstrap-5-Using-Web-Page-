// Counters Module

class Counters {
    /**
     * Initialize counters
     * @param {HTMLElement} element - Element to initialize on
     */
    static init(element = document) {
        // Find all counter elements
        Counters.counters = element.querySelectorAll('.stat-number[data-count]');
        
        // Set up intersection observer for counters
        Counters.setupObserver();
        
        // Initialize any counters that are already in view
        Counters.checkCounters();
    }

    /**
     * Set up intersection observer for counters
     */
    static setupObserver() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: animate all counters immediately
            Counters.animateAll();
            return;
        }
        
        // Create observer
        Counters.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Counters.animateCounter(entry.target);
                    Counters.observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        
        // Observe all counters
        Counters.counters.forEach(counter => {
            Counters.observer.observe(counter);
        });
    }

    /**
     * Check and animate counters that are in view
     */
    static checkCounters() {
        Counters.counters.forEach(counter => {
            if (Helpers.isInViewport(counter, 100)) {
                Counters.animateCounter(counter);
                
                // Stop observing if already animated
                if (Counters.observer) {
                    Counters.observer.unobserve(counter);
                }
            }
        });
    }

    /**
     * Animate a single counter
     * @param {HTMLElement} counterElement - Counter element to animate
     */
    static animateCounter(counterElement) {
        // Check if already animated
        if (counterElement.classList.contains('animated')) {
            return;
        }
        
        // Get target value
        const target = parseInt(counterElement.getAttribute('data-count'));
        if (isNaN(target)) return;
        
        // Get suffix (if any)
        const originalText = counterElement.textContent;
        const suffix = originalText.replace(/\d+/g, '');
        
        // Mark as animated
        counterElement.classList.add('animated');
        
        // Animate counting
        let current = 0;
        const increment = target / 50; // 50 frames
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 50;
        
        function updateCounter() {
            current += increment;
            if (current < target) {
                counterElement.textContent = Math.floor(current) + suffix;
                setTimeout(updateCounter, stepTime);
            } else {
                counterElement.textContent = target + suffix;
            }
        }
        
        updateCounter();
    }

    /**
     * Animate all counters immediately
     */
    static animateAll() {
        Counters.counters.forEach(counter => {
            Counters.animateCounter(counter);
        });
    }

    /**
     * Reset all counters
     */
    static reset() {
        Counters.counters.forEach(counter => {
            counter.classList.remove('animated');
            const target = counter.getAttribute('data-count');
            const suffix = counter.textContent.replace(/\d+/g, '');
            counter.textContent = '0' + suffix;
        });
        
        // Re-observe counters if observer exists
        if (Counters.observer) {
            Counters.counters.forEach(counter => {
                Counters.observer.observe(counter);
            });
        }
    }

    /**
     * Create a new counter element
     * @param {number} value - Counter value
     * @param {string} label - Counter label
     * @param {string} icon - Counter icon (optional)
     * @returns {HTMLElement} Counter element
     */
    static create(value, label, icon = null) {
        // Create counter container
        const container = document.createElement('div');
        container.className = 'stat-card text-center';
        
        // Create counter value
        const counterValue = document.createElement('div');
        counterValue.className = 'stat-number';
        counterValue.setAttribute('data-count', value);
        counterValue.textContent = '0';
        
        // Create counter label
        const counterLabel = document.createElement('div');
        counterLabel.className = 'stat-text';
        counterLabel.textContent = label;
        
        // Assemble counter
        container.appendChild(counterValue);
        container.appendChild(counterLabel);
        
        // Add icon if provided
        if (icon) {
            const counterIcon = document.createElement('div');
            counterIcon.className = 'stat-icon';
            counterIcon.innerHTML = `<i class="${icon}"></i>`;
            container.insertBefore(counterIcon, counterValue);
        }
        
        return container;
    }

    /**
     * Add a new counter to the page
     * @param {number} value - Counter value
     * @param {string} label - Counter label
     * @param {string} targetSelector - Selector for target element
     * @param {string} icon - Counter icon (optional)
     */
    static add(value, label, targetSelector, icon = null) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.error(`Target element not found: ${targetSelector}`);
            return;
        }
        
        const counter = Counters.create(value, label, icon);
        target.appendChild(counter);
        
        // Re-initialize counters to include new one
        Counters.init();
    }

    /**
     * Update an existing counter
     * @param {string} selector - Counter selector
     * @param {number} newValue - New counter value
     */
    static update(selector, newValue) {
        const counter = document.querySelector(selector);
        if (!counter) {
            console.error(`Counter not found: ${selector}`);
            return;
        }
        
        const counterValue = counter.querySelector('.stat-number');
        if (!counterValue) return;
        
        // Update data-count attribute
        counterValue.setAttribute('data-count', newValue);
        
        // Reset animation
        counterValue.classList.remove('animated');
        const suffix = counterValue.textContent.replace(/\d+/g, '');
        counterValue.textContent = '0' + suffix;
        
        // Re-observe if observer exists
        if (Counters.observer) {
            Counters.observer.observe(counterValue);
        }
    }

    /**
     * Get counter value
     * @param {string} selector - Counter selector
     * @returns {number} Counter value
     */
    static getValue(selector) {
        const counter = document.querySelector(selector);
        if (!counter) return 0;
        
        const counterValue = counter.querySelector('.stat-number');
        if (!counterValue) return 0;
        
        const currentText = counterValue.textContent;
        const currentValue = parseInt(currentText);
        return isNaN(currentValue) ? 0 : currentValue;
    }

    /**
     * Get all counter values
     * @returns {Object} Object with counter values
     */
    static getAllValues() {
        const values = {};
        
        Counters.counters.forEach((counter, index) => {
            const id = counter.id || `counter-${index}`;
            values[id] = Counters.getValue(`#${id}`);
        });
        
        return values;
    }
}

// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Counters.init();
});

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Counters;
}