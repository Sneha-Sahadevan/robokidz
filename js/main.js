document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Page Load Transition
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);

    // 2. Sticky Header Scroll Effect
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 3. Mobile Navigation Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
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
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
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
    const galleryContainer = document.querySelector('.gallery-grid');
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
                const captionText = item.querySelector('.gallery-overlay h4').textContent;
                
                lightboxImg.src = img.src;
                lightboxCaption.textContent = captionText;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden'; // Stop scroll
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
});
