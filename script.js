document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Form Submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Just a visual feedback for the static page
            const btn = form.querySelector('button');
            if(btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Sent Successfully! <i class="fas fa-check"></i>';
                btn.style.backgroundColor = 'var(--color-success)';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    form.reset();
                }, 3000);
            }
        });
    });
    // Intersection Observer for scroll animations and stats counting
    const fadeUpElements = document.querySelectorAll('.fade-up');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const animateStats = () => {
        if (hasCounted) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if(isNaN(target)) return;

            const duration = 2000; // ms
            const step = Math.ceil(target / (duration / 16)); // approx 60fps
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.innerText = current;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
        hasCounted = true;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the stats container, trigger the count animation
                if (entry.target.classList.contains('stats-container')) {
                    animateStats();
                }
                
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    fadeUpElements.forEach(el => observer.observe(el));
});

// WhatsApp Order Function
window.orderWhatsApp = function(productName, btnElement) {
    const card = btnElement.closest('.product-card');
    const qtyInput = card.querySelector('.qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    
    // Ensure quantity is between 1 and 10
    const finalQty = Math.min(Math.max(qty, 1), 10);
    
    const message = `Hello! I would like to order:\n*${productName}*\nQuantity: ${finalQty}`;
    const phone = "94701950551";
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// Gallery Filtering and Lightbox
document.addEventListener('DOMContentLoaded', () => {
    // Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            masonryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // match transition time
                }
            });
        });
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    
    if (!lightbox) return;

    let currentImageIndex = 0;
    let visibleItems = Array.from(masonryItems);

    masonryItems.forEach((item) => {
        item.addEventListener('click', () => {
            visibleItems = Array.from(masonryItems).filter(i => i.style.display !== 'none');
            currentImageIndex = visibleItems.indexOf(item);
            showLightbox(item);
        });
    });

    function showLightbox(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('.masonry-title').innerText;
        
        lightboxImg.src = img.src;
        lightboxCaption.innerText = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
        showLightbox(visibleItems[currentImageIndex]);
    });

    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
        showLightbox(visibleItems[currentImageIndex]);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Premium Smooth Scroll for Journey Button
    const journeyBtn = document.getElementById('journey-scroll-btn');
    if(journeyBtn) {
        journeyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(!targetElement) return;

            // Optional: Offset for fixed header
            const headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800; // 800ms
            let start = null;

            // easeInOutQuad function
            const easeInOut = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };

            const animation = (currentTime) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = easeInOut(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    window.scrollTo(0, targetPosition); 
                }
            };

            requestAnimationFrame(animation);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});
