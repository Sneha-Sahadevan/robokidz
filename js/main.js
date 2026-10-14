document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Page Load Transition
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);

    // 2. Sticky Header Scroll Effect
    const header = document.querySelector('.header') || document.querySelector('.ref-header');
    const handleScroll = () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 3. Mobile Navigation Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle') || document.querySelector('.ref-mobile-toggle');
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('.ref-nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.setAttribute('aria-expanded', 'false');

        const closeMobileMenu = () => {
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        };

        const toggleMobileMenu = (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open', isOpen);
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('menu-open', isOpen);
        };

        mobileToggle.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking a nav link or CTA button inside
        const navLinks = navMenu.querySelectorAll('a, .nav-link, .btn');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // 4. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after showing
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });

    // 5. Statistics Counter Animation
    const statsSection = document.querySelector('.mission-stats');
    const statNums = document.querySelectorAll('.mission-stat-num');
    
    if (statsSection && statNums.length > 0) {
        let countStarted = false;
        
        const countUp = () => {
            statNums.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'), 10);
                const suffix = num.getAttribute('data-suffix') || '';
                let current = 0;
                const duration = 2000; // 2 seconds
                const increment = Math.ceil(target / (duration / 16)); // ~60fps
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        num.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        num.textContent = current + suffix;
                    }
                }, 16);
            });
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countStarted) {
                    countStarted = true;
                    countUp();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // 6. FAQ Accordion Animation
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs first
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // 7. Gallery Category Filters
    const filterBtns = document.querySelectorAll('.filter-btn, .gal-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item, .gal-card');
    
    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active button states
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        // Trigger soft fade animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        // Wait for transition before hiding
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    // 8. Gallery Lightbox Modal
    const galleryContainer = document.querySelector('.gallery-grid, .gal-grid');
    if (galleryContainer) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="" alt="Zoomed view">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const captionElem = item.querySelector('.gallery-overlay h4, .gal-card-caption, .gallery-overlay');
                const captionText = captionElem ? captionElem.textContent.trim() : '';
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = captionText;
                    lightbox.classList.add('open');
                    document.body.style.overflow = 'hidden'; // Stop scroll
                }
            });
        });
        
        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = ''; // Resume scroll
        };
        
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // 9. Interactive Form Submission Hook
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;
            
            // Visual loading state
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 50 50" style="animation: rotateGear 1s linear infinite; fill: currentColor;">
                    <path d="M25,5A20,20 0 0,0 5,25A20,20 0 0,0 25,45A20,20 0 0,0 45,25A20,20 0 0,0 25,5M25,10A15,15 0 0,1 40,25A15,15 0 0,1 25,40A15,15 0 0,1 10,25A15,15 0 0,1 25,10Z" opacity="0.25"/>
                    <path d="M40,25A15,15 0 0,0 25,10V5A20,20 0 0,1 45,25Z"/>
                </svg>
                Sending...
            `;
            
            // Simulating API callback
            setTimeout(() => {
                submitBtn.innerHTML = `<span>🎉</span> Sent Successfully!`;
                submitBtn.style.backgroundColor = 'var(--accent-green)';
                submitBtn.style.boxShadow = '0 8px 24px rgba(52, 199, 89, 0.25)';
                
                // Clear fields
                contactForm.reset();
                
                // Reset button state after 3 seconds
                setTimeout(() => {
                    submitBtn.style.pointerEvents = 'all';
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.boxShadow = '';
                }, 3000);
            }, 1500);
        });
    }

    // 10. Program Details Popup Modals Handler (All 4 Programs)
    const programModals = {
        inhouse: document.getElementById('inhouseProgramModal'),
        innovation: document.getElementById('innovationProgramModal'),
        afterschool: document.getElementById('afterschoolProgramModal'),
        workshop: document.getElementById('workshopProgramModal')
    };

    const openProgramModal = (modalKey) => {
        const modal = programModals[modalKey];
        if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeAllProgramModals = () => {
        Object.values(programModals).forEach(modal => {
            if (modal && modal.classList.contains('open')) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
        document.body.style.overflow = '';
    };

    // Event Delegation for Opening Modals
    document.addEventListener('click', (e) => {
        const inhouseBtn = e.target.closest('#openInhouseModal, .open-inhouse-modal, a[href="#in-house"], a[href="programs.html#in-house"]');
        const innovationBtn = e.target.closest('#openInnovationModal, .open-innovation-modal, a[href="#innovation-labs"], a[href="programs.html#innovation-labs"]');
        const afterschoolBtn = e.target.closest('#openAfterschoolModal, .open-afterschool-modal, a[href="#afterschool-program"], a[href="programs.html#afterschool-program"]');
        const workshopBtn = e.target.closest('#openWorkshopModal, .open-workshop-modal, a[href="#workshops"], a[href="programs.html#workshops"]');

        const isProgramsPage = window.location.pathname.endsWith('programs.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

        if (inhouseBtn && isProgramsPage) {
            e.preventDefault();
            closeAllProgramModals();
            openProgramModal('inhouse');
        } else if (innovationBtn && isProgramsPage) {
            e.preventDefault();
            closeAllProgramModals();
            openProgramModal('innovation');
        } else if (afterschoolBtn && isProgramsPage) {
            e.preventDefault();
            closeAllProgramModals();
            openProgramModal('afterschool');
        } else if (workshopBtn && isProgramsPage) {
            e.preventDefault();
            closeAllProgramModals();
            openProgramModal('workshop');
        }

        // Close when clicking X button or backdrop
        if (e.target.closest('.program-modal-close')) {
            closeAllProgramModals();
        } else if (e.target.classList.contains('program-modal-backdrop')) {
            closeAllProgramModals();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllProgramModals();
        }
    });

    // Auto-open modal if URL hash is present
    const checkHashModal = () => {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#in-house' || hash === '#inhouse') {
            openProgramModal('inhouse');
        } else if (hash === '#innovation-labs' || hash === '#innovation') {
            openProgramModal('innovation');
        } else if (hash === '#afterschool-program' || hash === '#afterschool') {
            openProgramModal('afterschool');
        } else if (hash === '#workshops' || hash === '#workshop') {
            openProgramModal('workshop');
        }
    };
    checkHashModal();

    // 10. Floating Social Media Popup Widget (Shared Component across all pages)
    const initFloatingSocialWidget = () => {
        if (document.getElementById('floatingSocialWidget')) return;

        const widget = document.createElement('div');
        widget.id = 'floatingSocialWidget';
        widget.className = 'fsw-widget';
        widget.setAttribute('aria-label', 'Social Media Connect Widget');

        widget.innerHTML = `
            <div class="fsw-popup" id="fswPopup" role="dialog" aria-label="Social media channels">
                <a href="https://www.linkedin.com/company/robokidz-innovative-solutions-pvt-ltd/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="fsw-link fsw-link-linkedin" 
                   aria-label="Connect on LinkedIn" 
                   title="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span class="fsw-tooltip">LinkedIn</span>
                </a>
                <a href="https://www.instagram.com/robokidz_stemrobotics?psln=MXRjODAyNG9sY2lkYg==" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="fsw-link fsw-link-instagram" 
                   aria-label="Follow on Instagram" 
                   title="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span class="fsw-tooltip">Instagram</span>
                </a>
            </div>
            <button class="fsw-toggle-btn" 
                    id="fswToggleBtn" 
                    type="button" 
                    aria-label="Connect with us on social media" 
                    aria-expanded="false" 
                    aria-controls="fswPopup">
                <span class="fsw-icon fsw-icon-social" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                </span>
                <span class="fsw-icon fsw-icon-close" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </span>
            </button>
        `;

        document.body.appendChild(widget);

        const toggleBtn = widget.querySelector('#fswToggleBtn');

        const toggleWidget = (e) => {
            e.stopPropagation();
            const isOpen = widget.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        };

        const closeWidget = () => {
            if (widget.classList.contains('open')) {
                widget.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        };

        toggleBtn.addEventListener('click', toggleWidget);

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target)) {
                closeWidget();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeWidget();
            }
        });
    };

    initFloatingSocialWidget();
});
