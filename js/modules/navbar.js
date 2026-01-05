// Navbar Module

class Navbar {
    /**
     * Initialize navbar
     * @param {HTMLElement} element - Navbar element
     */
    static init(element = document.querySelector('.main-header')) {
        if (!element) return;
        
        // Store navbar element
        Navbar.element = element;
        
        // Set up scroll effect
        Navbar.setupScrollEffect();
        
        // Set up active link highlighting
        Navbar.setupActiveLinks();
        
        // Set up mobile menu
        Navbar.setupMobileMenu();
        
        // Initial scroll state
        Navbar.handleScroll();
    }

    /**
     * Set up scroll effect
     */
    static setupScrollEffect() {
        window.addEventListener('scroll', Navbar.handleScroll);
    }

    /**
     * Handle scroll event
     */
    static handleScroll() {
        if (!Navbar.element) return;
        
        if (window.scrollY > 50) {
            Navbar.element.classList.add('scrolled');
        } else {
            Navbar.element.classList.remove('scrolled');
        }
        
        // Update active nav links
        Navbar.updateActiveLinks();
    }

    /**
     * Set up active link highlighting
     */
    static setupActiveLinks() {
        const navLinks = Navbar.element.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Close mobile menu if open
                Navbar.closeMobileMenu();
            });
        });
    }

    /**
     * Update active nav links based on scroll position
     */
    static updateActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = Navbar.element.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Set up mobile menu
     */
    static setupMobileMenu() {
        const navbarToggler = Navbar.element.querySelector('.navbar-toggler');
        if (!navbarToggler) return;
        
        navbarToggler.addEventListener('click', () => {
            const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
            
            // Add animation class
            if (!isExpanded) {
                Navbar.element.classList.add('menu-open');
            } else {
                Navbar.element.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!Navbar.element.contains(e.target) && 
                !e.target.classList.contains('navbar-toggler')) {
                Navbar.closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Navbar.closeMobileMenu();
            }
        });
    }

    /**
     * Close mobile menu
     */
    static closeMobileMenu() {
        const navbarCollapse = Navbar.element.querySelector('.navbar-collapse');
        const navbarToggler = Navbar.element.querySelector('.navbar-toggler');
        
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (navbarToggler) {
                navbarToggler.click();
            }
            Navbar.element.classList.remove('menu-open');
        }
    }

    /**
     * Toggle navbar visibility
     */
    static toggle() {
        if (!Navbar.element) return;
        
        const isHidden = Navbar.element.style.display === 'none';
        Navbar.element.style.display = isHidden ? 'block' : 'none';
    }

    /**
     * Show navbar
     */
    static show() {
        if (!Navbar.element) return;
        Navbar.element.style.display = 'block';
    }

    /**
     * Hide navbar
     */
    static hide() {
        if (!Navbar.element) return;
        Navbar.element.style.display = 'none';
    }

    /**
     * Change navbar background color
     * @param {string} color - CSS color value
     */
    static setBackgroundColor(color) {
        if (!Navbar.element) return;
        
        const navbar = Navbar.element.querySelector('.navbar');
        if (navbar) {
            navbar.style.backgroundColor = color;
        }
    }

    /**
     * Change navbar text color
     * @param {string} color - CSS color value
     */
    static setTextColor(color) {
        if (!Navbar.element) return;
        
        const navLinks = Navbar.element.querySelectorAll('.nav-link, .navbar-brand');
        navLinks.forEach(link => {
            link.style.color = color;
        });
    }

    /**
     * Reset navbar to default styles
     */
    static reset() {
        if (!Navbar.element) return;
        
        const navbar = Navbar.element.querySelector('.navbar');
        if (navbar) {
            navbar.style.backgroundColor = '';
        }
        
        const navLinks = Navbar.element.querySelectorAll('.nav-link, .navbar-brand');
        navLinks.forEach(link => {
            link.style.color = '';
        });
        
        Navbar.element.classList.remove('scrolled', 'menu-open');
    }

    /**
     * Get navbar height
     * @returns {number} Navbar height in pixels
     */
    static getHeight() {
        if (!Navbar.element) return 0;
        return Navbar.element.offsetHeight;
    }
}

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navbar;
}