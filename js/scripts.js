// Utility function for logging errors
function logError(error, context) {
    console.error(`Error in ${context}:`, error);
}

// Language toggle functionality
function toggleLanguage(lang) {
    try {
        const enElements = document.querySelectorAll('.en');
        const frElements = document.querySelectorAll('.fr');

        if (!enElements.length && !frElements.length) {
            throw new Error('No language elements found');
        }

        if (lang === 'en') {
            enElements.forEach(el => el.style.display = 'block');
            frElements.forEach(el => el.style.display = 'none');
        } else if (lang === 'fr') {
            enElements.forEach(el => el.style.display = 'none');
            frElements.forEach(el => el.style.display = 'block');
        } else {
            throw new Error('Invalid language specified');
        }

        // Update toggle buttons
        const enToggle = document.getElementById('en-toggle');
        const frToggle = document.getElementById('fr-toggle');

        if (!enToggle || !frToggle) {
            throw new Error('Language toggle buttons not found');
        }

        enToggle.classList.toggle('active', lang === 'en');
        frToggle.classList.toggle('active', lang === 'fr');

        // Store language preference
        localStorage.setItem('preferredLanguage', lang);

        // Close the navigation menu if it's open
        const navWrapper = document.querySelector('.nav-wrapper');
        if (navWrapper && navWrapper.classList.contains('active')) {
            closeMenu();
        }
    } catch (error) {
        logError(error, 'toggleLanguage');
        if (lang !== 'fr') {
            toggleLanguage('fr');
        }
    }
}

// Modal functionality with animations
function openModal(serviceId) {
    try {
        const modal = document.getElementById(serviceId);
        if (!modal) {
            throw new Error(`Modal with ID ${serviceId} not found`);
        }

        modal.style.display = 'flex';
        // Add animation class after a brief delay to trigger transition
        requestAnimationFrame(() => {
            modal.classList.add('modal-active');
        });

        // Add event listener for closing on outside click
        const closeOnOutsideClick = (event) => {
            if (event.target === modal) {
                closeModal(serviceId);
            }
        };
        modal.addEventListener('click', closeOnOutsideClick);

        // Add escape key listener
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                closeModal(serviceId);
            }
        };
        document.addEventListener('keydown', closeOnEscape);

        // Store the event listeners for cleanup
        modal._closeListeners = {
            click: closeOnOutsideClick,
            keydown: closeOnEscape
        };
    } catch (error) {
        logError(error, 'openModal');
    }
}

function closeModal(serviceId) {
    try {
        const modal = document.getElementById(serviceId);
        if (!modal) {
            throw new Error(`Modal with ID ${serviceId} not found`);
        }

        // Remove animation class
        modal.classList.remove('modal-active');

        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';

            // Clean up event listeners
            if (modal._closeListeners) {
                modal.removeEventListener('click', modal._closeListeners.click);
                document.removeEventListener('keydown', modal._closeListeners.keydown);
                delete modal._closeListeners;
            }
        }, 300); // Match this with your CSS transition duration
    } catch (error) {
        logError(error, 'closeModal');
    }
}

// Enhanced scroll behavior
let lastScroll = 0;
let scrollTimer = null;

function handleScroll() {
    try {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('header');
        const homeButton = document.getElementById('home-button');

        // Header visibility
        if (header) {
            header.classList.toggle('header-hidden', currentScroll > lastScroll && currentScroll > 100);
            header.classList.toggle('header-compact', currentScroll > 50);
        }

        // Home button visibility
        if (homeButton) {
            homeButton.classList.toggle('visible', currentScroll > 300);
        }

        lastScroll = currentScroll;

        // Clear existing timer
        if (scrollTimer) clearTimeout(scrollTimer);

        // Set new timer
        scrollTimer = setTimeout(() => {
            if (header) header.classList.remove('header-hidden');
        }, 150);
    } catch (error) {
        logError(error, 'handleScroll');
    }
}

// Improved smooth scroll
function scrollToTop() {
    try {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers that don't support smooth scrolling
            const duration = 500;
            const start = window.pageYOffset;
            const startTime = performance.now();

            function scroll(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                window.scrollTo(0, start * (1 - easeInOutCubic(progress)));

                if (progress < 1) {
                    requestAnimationFrame(scroll);
                }
            }

            requestAnimationFrame(scroll);
        }
    } catch (error) {
        logError(error, 'scrollToTop');
        window.scrollTo(0, 0);
    }
}

// Easing function for smooth scroll
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Enhanced mobile menu functionality
let isMenuActive = false;

function toggleMenu() {
    try {
        const navWrapper = document.querySelector(".nav-wrapper");
        const hamburger = document.querySelector('.hamburger');
        const backdrop = document.querySelector('.nav-backdrop') || createBackdrop();

        if (!navWrapper || !hamburger) {
            throw new Error('Navigation elements not found');
        }

        isMenuActive = !isMenuActive;

        // Toggle classes with animation
        navWrapper.classList.toggle("active", isMenuActive);
        hamburger.classList.toggle("active", isMenuActive);
        backdrop.classList.toggle("active", isMenuActive);

        // Update accessibility attributes
        hamburger.setAttribute('aria-expanded', isMenuActive.toString());

        // Toggle body scroll
        document.body.style.overflow = isMenuActive ? 'hidden' : '';

    } catch (error) {
        logError(error, 'toggleMenu');
    }
}

function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', closeMenu);
    return backdrop;
}

function closeMenu() {
    try {
        const navWrapper = document.querySelector(".nav-wrapper");
        const hamburger = document.querySelector('.hamburger');
        const backdrop = document.querySelector('.nav-backdrop');

        if (!navWrapper) {
            throw new Error('Navigation menu not found');
        }

        isMenuActive = false;
        navWrapper.classList.remove("active");
        if (hamburger) {
            hamburger.classList.remove("active");
            hamburger.setAttribute('aria-expanded', 'false');
        }
        if (backdrop) {
            backdrop.classList.remove("active");
        }

        document.body.style.overflow = '';
    } catch (error) {
        logError(error, 'closeMenu');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Set initial language
        const storedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
        toggleLanguage(storedLanguage);

        // Initialize scroll handlers
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initialize home button
        const homeButton = document.getElementById('home-button');
        if (homeButton) {
            homeButton.style.opacity = '0';
            homeButton.style.display = 'flex';
            window.addEventListener('scroll', () => {
                const shouldShow = window.scrollY > 300;
                homeButton.style.opacity = shouldShow ? '1' : '0';
                homeButton.style.pointerEvents = shouldShow ? 'auto' : 'none';
            }, { passive: true });
        }

        // Initialize modals
        document.querySelectorAll('.modal').forEach(modal => {
            const closeButton = modal.querySelector('.modal-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    closeModal(modal.id);
                });
            }
        });

        // Initialize navigation links
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }

                // Smooth scroll to section
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Add resize handler for menu
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && isMenuActive) {
                    closeMenu();
                }
            }, 250);
        });

    } catch (error) {
        logError(error, 'DOMContentLoaded');
    }
});

// Handle browser back button for modals
window.addEventListener('popstate', function (event) {
    try {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.classList.contains('modal-active')) {
                closeModal(modal.id);
            }
        });
    } catch (error) {
        logError(error, 'popstate');
    }
});

// Add intersection observer for animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe sections and cards
    document.querySelectorAll('section, .service, .value-card').forEach(el => {
        observer.observe(el);
    });
};

// Initialize observers after DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}