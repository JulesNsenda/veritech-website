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
    } catch (error) {
        logError(error, 'toggleLanguage');
        // Fallback to French if there's an error
        if (lang !== 'fr') {
            toggleLanguage('fr');
        }
    }
}

// Modal functionality
function openModal(serviceId) {
    try {
        const modal = document.getElementById(serviceId);
        if (!modal) {
            throw new Error(`Modal with ID ${serviceId} not found`);
        }

        modal.style.display = 'flex';

        // Add event listener for closing on outside click
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal(serviceId);
            }
        });

        // Add escape key listener
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeModal(serviceId);
            }
        });
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
        modal.style.display = 'none';
    } catch (error) {
        logError(error, 'closeModal');
    }
}

// Smooth scroll functionality
function scrollToTop() {
    try {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } catch (error) {
        logError(error, 'scrollToTop');
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
    }
}

// Mobile menu functionality
let isMenuActive = false;

function toggleMenu() {
    try {
        const navMenu = document.querySelector(".nav-wrapper");
        if (!navMenu) {
            throw new Error('Navigation menu not found');
        }

        isMenuActive = !isMenuActive;
        navMenu.classList.toggle("active", isMenuActive);

        // Update aria-expanded state
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', isMenuActive.toString());
        }
    } catch (error) {
        logError(error, 'toggleMenu');
    }
}

function closeMenu() {
    try {
        const navMenu = document.querySelector(".nav-wrapper");
        if (!navMenu) {
            throw new Error('Navigation menu not found');
        }

        isMenuActive = false;
        navMenu.classList.remove("active");

        // Update aria-expanded state
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
        }
    } catch (error) {
        logError(error, 'closeMenu');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Set initial language based on stored preference or default to French
        const storedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
        toggleLanguage(storedLanguage);

        // Add scroll event listener for showing/hiding scroll-to-top button
        const homeButton = document.getElementById('home-button');
        if (homeButton) {
            window.addEventListener('scroll', function () {
                homeButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
            });
        }

        // Add click event listeners for closing modals
        document.querySelectorAll('.modal').forEach(modal => {
            const closeButton = modal.querySelector('.modal-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    closeModal(modal.id);
                });
            }
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
            if (modal.style.display === 'flex') {
                closeModal(modal.id);
            }
        });
    } catch (error) {
        logError(error, 'popstate');
    }
});