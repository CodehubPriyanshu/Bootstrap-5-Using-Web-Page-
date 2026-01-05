// Smooth Scroll Module

class SmoothScroll {
    /**
     * Initialize smooth scrolling
     * @param {HTMLElement} element - Element to initialize on
     */
    static init(element = document) {
        // Add smooth scrolling to all anchor links
        const links = element.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile navbar if open
                    SmoothScroll.closeMobileNavbar();
                    
                    // Scroll to target
                    SmoothScroll.scrollToElement(targetElement);
                }
            });
        });
    }

    /**
     * Scroll to element with smooth animation
     * @param {HTMLElement} element - Element to scroll to
     */
    static scrollToElement(element) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80; // Offset for navbar
        const duration = 800;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (easeInOutCubic)
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const run = easeInOutCubic(progress) * distance + startPosition;
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Close mobile navbar if open
     */
    static closeMobileNavbar() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler) {
                navbarToggler.click();
            }
        }
    }

    /**
     * Scroll to top of page
     */
    static scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Scroll to bottom of page
     */
    static scrollToBottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    /**
     * Scroll to specific position
     * @param {number} position - Position to scroll to
     * @param {number} duration - Duration of scroll animation
     */
    static scrollToPosition(position, duration = 800) {
        const startPosition = window.pageYOffset;
        const distance = position - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (easeInOutCubic)
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const run = easeInOutCubic(progress) * distance + startPosition;
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }
}

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothScroll;
}