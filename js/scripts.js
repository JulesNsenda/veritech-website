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

function toggleFaq(element) {
    // Toggle active class on the clicked item
    element.parentElement.classList.toggle('active');

    // Close other open FAQs
    const allFaqs = document.querySelectorAll('.faq-item');
    allFaqs.forEach(faq => {
        if (faq !== element.parentElement && faq.classList.contains('active')) {
            faq.classList.remove('active');
        }
    });
}

// Enhanced dropdown menu for mobile
document.addEventListener('DOMContentLoaded', function () {
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const content = this.nextElementSibling;
                const isVisible = content.style.display === 'block';

                // Close all other dropdowns first
                document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });

                // Toggle current dropdown
                content.style.display = isVisible ? 'none' : 'block';
            }
        });
    });
});

// Add this to your scripts.js file
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('faqSearch');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    let activeCategory = 'all';

    // Search functionality
    function filterFAQs() {
        const searchTerm = searchInput.value.toLowerCase();

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h4.en').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p.en').textContent.toLowerCase();
            const category = item.closest('.faq-category').getAttribute('data-category');

            const matchesSearch = question.includes(searchTerm) || answer.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Show/hide categories based on whether they have visible items
        document.querySelectorAll('.faq-category').forEach(category => {
            const hasVisibleItems = category.querySelectorAll('.faq-item:not(.hidden)').length > 0;
            category.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }

    // Category filter functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active category and filter
            activeCategory = button.getAttribute('data-category');
            filterFAQs();
        });
    });

    // Search input event
    searchInput.addEventListener('input', filterFAQs);

    // Add data-category attributes to FAQ categories
    document.querySelectorAll('.faq-category').forEach(category => {
        const title = category.querySelector('h3.en').textContent.toLowerCase();
        if (title.includes('infrastructure')) category.setAttribute('data-category', 'infrastructure');
        else if (title.includes('document')) category.setAttribute('data-category', 'document-processing');
        else if (title.includes('security')) category.setAttribute('data-category', 'security');
        else if (title.includes('integration')) category.setAttribute('data-category', 'integration');
        else if (title.includes('hardware')) category.setAttribute('data-category', 'hardware');
        else if (title.includes('performance')) category.setAttribute('data-category', 'performance');
        else if (title.includes('implementation')) category.setAttribute('data-category', 'implementation');
    });
});

// Move these inside DOMContentLoaded
let currentSlide = 0;

function showSlide(n, slides, dots) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Handle circular rotation
    currentSlide = n;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    // Show current slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function moveCarousel(direction) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    showSlide(currentSlide + direction, slides, dots);
}

function jumpToSlide(n) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    showSlide(n, slides, dots);
}

// Initialize carousel within DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    try {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');

        if (!slides.length || !dots.length) {
            console.warn('Carousel elements not found');
            return;
        }

        // Initialize first slide
        showSlide(0, slides, dots);

        // Set up auto-advance
        let autoAdvance = setInterval(() => moveCarousel(1), 5000);

        // Add pause on hover
        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            // Pause on hover
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoAdvance);
            });

            // Resume on mouse leave
            carousel.addEventListener('mouseleave', () => {
                autoAdvance = setInterval(() => moveCarousel(1), 5000);
            });

            // Add touch support
            let touchStartX = 0;
            let touchEndX = 0;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                const swipeThreshold = 50; // minimum distance for a swipe
                const difference = touchStartX - touchEndX;

                if (Math.abs(difference) > swipeThreshold) {
                    if (difference > 0) {
                        // Swiped left, show next slide
                        moveCarousel(1);
                    } else {
                        // Swiped right, show previous slide
                        moveCarousel(-1);
                    }
                }
            }
        }

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                moveCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                moveCarousel(1);
            }
        });

    } catch (error) {
        console.error('Error initializing carousel:', error);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseStudies = document.querySelectorAll('.case-study');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.dataset.filter;

            caseStudies.forEach(study => {
                if (filter === 'all' || study.dataset.category === filter) {
                    study.style.display = 'block';
                } else {
                    study.style.display = 'none';
                }
            });
        });
    });

    // CTA button functionality
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Scroll to contact form
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

function sendMail(button) {
    try {
        const subject = button.getAttribute('data-subject');
        const email = "info@veritech-rdc.com"; 
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
        window.location.href = mailtoLink;
    } catch (error) {
        console.error("Error generating mailto link:", error);
    }
}
