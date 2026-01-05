// Animations Module

class Animations {
    /**
     * Initialize animations
     * @param {HTMLElement} element - Element to initialize on
     */
    static init(element = document) {
        // Set up scroll animations
        Animations.setupScrollAnimations();
        
        // Set up hover animations
        Animations.setupHoverAnimations();
        
        // Set up intersection observer for complex animations
        Animations.setupIntersectionObserver();
        
        // Set up parallax effect
        Animations.setupParallax();
    }

    /**
     * Set up scroll animations
     */
    static setupScrollAnimations() {
        // Add scroll event listener for fade-in animations
        window.addEventListener('scroll', Animations.handleScrollAnimations);
        
        // Trigger once on load
        setTimeout(() => {
            Animations.handleScrollAnimations();
        }, 100);
    }

    /**
     * Handle scroll animations
     */
    static handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
        
        animatedElements.forEach(element => {
            if (Helpers.isInViewport(element, 100)) {
                element.classList.add('visible');
            }
        });
    }

    /**
     * Set up hover animations
     */
    static setupHoverAnimations() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.course-card, .highlight-card, .stat-card');
        
        cards.forEach(card => {
            // Add mouseenter event
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s ease';
            });
            
            // Add touch event for mobile
            card.addEventListener('touchstart', () => {
                card.classList.add('hover-effect');
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('hover-effect');
                }, 300);
            });
        });
        
        // Add hover effects to buttons
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '';
            });
        });
    }

    /**
     * Set up intersection observer
     */
    static setupIntersectionObserver() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            // Set up observer for staggered animations
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add animation class based on element type
                        if (entry.target.classList.contains('course-card') || 
                            entry.target.classList.contains('highlight-card')) {
                            const delay = entry.target.dataset.delay || 0;
                            entry.target.style.animationDelay = `${delay}ms`;
                            entry.target.classList.add('animate-in');
                        }
                        
                        // For stat cards, animate the numbers
                        if (entry.target.classList.contains('stat-card')) {
                            Animations.animateStatNumbers(entry.target);
                        }
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe elements
            const cardsToObserve = document.querySelectorAll('.course-card, .highlight-card, .stat-card');
            cardsToObserve.forEach((card, index) => {
                card.dataset.delay = index * 100; // Stagger animation
                observer.observe(card);
            });
        }
    }

    /**
     * Animate stat numbers
     * @param {HTMLElement} statCard - Stat card element
     */
    static animateStatNumbers(statCard) {
        const numberElement = statCard.querySelector('.stat-number');
        if (!numberElement) return;
        
        const originalText = numberElement.textContent;
        const numberValue = parseInt(originalText);
        
        // Only animate if it's a number
        if (isNaN(numberValue)) return;
        
        // Check if already animated
        if (numberElement.classList.contains('animated')) return;
        
        // Mark as animated
        numberElement.classList.add('animated');
        
        // Clear the text
        numberElement.textContent = '0';
        
        // Animate counting up
        let startTimestamp = null;
        const duration = 1500; // 1.5 seconds
        
        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentNumber = Math.floor(easeOutQuart * numberValue);
            numberElement.textContent = currentNumber + originalText.replace(numberValue, '');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                numberElement.textContent = originalText;
            }
        }
        
        window.requestAnimationFrame(step);
    }

    /**
     * Set up parallax effect
     */
    static setupParallax() {
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                // Apply parallax to background if it exists
                const background = heroSection.querySelector('.hero-background');
                if (background) {
                    background.style.transform = `translate3d(0px, ${rate}px, 0px)`;
                }
            });
        }
    }

    /**
     * Add CSS animation keyframes
     */
    static addAnimationKeyframes() {
        // Check if styles already added
        if (document.querySelector('#animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
            
            @keyframes bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Reset all animations
     */
    static reset() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .animate-in');
        animatedElements.forEach(element => {
            element.classList.remove('visible', 'animate-in', 'animated');
        });
    }

    /**
     * Trigger animations manually
     */
    static trigger() {
        Animations.handleScrollAnimations();
    }
}

// Add animation keyframes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Animations.addAnimationKeyframes();
});

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animations;
}