/**
 * Adrika Designs - Interactive Website Script
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNavigation = document.querySelector('#primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && primaryNavigation) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            
            mobileNavToggle.setAttribute('aria-expanded', !isOpened);
            primaryNavigation.classList.toggle('active');
            
            // Toggle hamburger icon animation states if needed (not strict, but premium)
            mobileNavToggle.classList.toggle('open');
        });

        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                primaryNavigation.classList.remove('active');
                mobileNavToggle.classList.remove('open');
            });
        });
    }


    // ==========================================
    // 2. STICKY HEADER & BACK-TO-TOP BUTTON
    // ==========================================
    const header = document.querySelector('#header');
    const backToTopBtn = document.querySelector('#backToTop');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky Header states
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back-to-top button visibility
        if (scrollPos > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================
    // 3. ACTIVE NAVIGATION LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset header
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-list a[href*=${sectionId}]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightActiveLink);


    // ==========================================
    // 4. PORTFOLIO FILTER FUNCTIONALITY
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });
        });
    });


    // ==========================================
    // 5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => element.classList.add('active'));
    }


    // ==========================================
    // 6. FORM VALIDATION & WHATSAPP REDIRECT
    // ==========================================
    const contactForm = document.querySelector('#interiorContactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reload

            // Get form inputs
            const nameInput = document.querySelector('#clientName');
            const phoneInput = document.querySelector('#clientPhone');
            const locationInput = document.querySelector('#clientLocation');
            const serviceSelect = document.querySelector('#serviceRequired');
            const budgetSelect = document.querySelector('#budgetRange');
            const messageTextarea = document.querySelector('#clientMessage');

            // Reset validation states
            let isFormValid = true;
            document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('invalid'));

            // Name Validation
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Phone Validation (10 digits check)
            const phoneVal = phoneInput.value.replace(/\D/g, ''); // strip non-numeric
            if (phoneVal.length !== 10) {
                phoneInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Location Validation
            if (!locationInput.value.trim()) {
                locationInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Service Required Validation
            if (!serviceSelect.value) {
                serviceSelect.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Budget Range Validation
            if (!budgetSelect.value) {
                budgetSelect.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // If form is valid, redirect to WhatsApp
            if (isFormValid) {
                const name = nameInput.value.trim();
                const location = locationInput.value.trim();
                const service = serviceSelect.value;
                const budget = budgetSelect.value;
                const message = messageTextarea.value.trim() || 'No additional details provided.';

                // WhatsApp template formatting:
                // Hello Adrika Designs, my name is [Name]. I am from [Location]. I need help with [Service Required]. My budget range is [Budget Range]. Message: [Message]
                const whatsappMessage = `Hello Adrika Designs, my name is ${name}. I am from ${location}. I need help with ${service}. My budget range is ${budget}. Message: ${message}`;
                
                const encodedMsg = encodeURIComponent(whatsappMessage);
                const placeholderNumber = 'REPLACE_WITH_ACTUAL_PHONE_NUMBER';
                
                const whatsappUrl = `https://wa.me/${placeholderNumber}?text=${encodedMsg}`;

                // Redirect user to WhatsApp link in a new tab
                window.open(whatsappUrl, '_blank');
                
                // Clear the form after submission
                contactForm.reset();
            }
        });

        // Real-time validation clear on input change
        const inputsToWatch = contactForm.querySelectorAll('input, select');
        inputsToWatch.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('invalid');
                }
            });
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', () => {
                    if (input.value) {
                        input.parentElement.classList.remove('invalid');
                    }
                });
            }
        });
    }
});
