// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initMobileMenu();
    initBackToTop();
    initCurrentYear();
    initSmoothScroll();
    initNavbarScroll();
    initServiceFilter();
    initAnimations();
    initLazyLoading();
    initServiceWorker();
});

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // Hide preloader when page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Remove preloader from DOM after animation
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (!mobileMenuBtn || !navLinks) return;
    
    // Create mobile menu container
    const mobileMenuContainer = document.createElement('div');
    mobileMenuContainer.className = 'mobile-menu-container';
    mobileMenuContainer.style.cssText = `
        position: fixed;
        top: 0;
        right: -300px;
        width: 300px;
        height: 100vh;
        background: var(--dark-card);
        z-index: 1001;
        padding: 80px 30px 30px;
        transition: right 0.3s ease;
        box-shadow: -5px 0 30px rgba(0,0,0,0.5);
        overflow-y: auto;
    `;
    
    // Clone nav links for mobile
    const mobileNavLinks = navLinks.cloneNode(true);
    mobileNavLinks.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0;
        list-style: none;
    `;
    
    // Style mobile nav links
    mobileNavLinks.querySelectorAll('a').forEach(link => {
        link.style.cssText = `
            display: block;
            padding: 15px;
            color: var(--white);
            text-decoration: none;
            border-bottom: 1px solid var(--dark-gray);
            font-size: 1.1rem;
            transition: all 0.3s ease;
        `;
        
        link.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(0,102,204,0.1)';
            this.style.paddingLeft = '25px';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.paddingLeft = '15px';
        });
    });
    
    mobileMenuContainer.appendChild(mobileNavLinks);
    document.body.appendChild(mobileMenuContainer);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    `;
    document.body.appendChild(overlay);
    
    // Toggle mobile menu
    let isMenuOpen = false;
    
    function openMobileMenu() {
        mobileMenuContainer.style.right = '0';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        body.style.overflow = 'hidden';
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        isMenuOpen = true;
    }
    
    function closeMobileMenu() {
        mobileMenuContainer.style.right = '-300px';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        body.style.overflow = '';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        isMenuOpen = false;
    }
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking a link
    mobileNavLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !mobileMenuContainer.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    // Internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                if (href.startsWith('#')) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== SERVICE FILTER =====
function initServiceFilter() {
    const serviceFilter = document.getElementById('serviceFilter');
    if (!serviceFilter) return;
    
    serviceFilter.addEventListener('change', function() {
        const selectedService = this.value;
        if (selectedService) {
            window.location.href = `/services.html#${selectedService}`;
        }
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add stagger delay for child elements
                    if (entry.target.classList.contains('services-grid') ||
                        entry.target.classList.contains('values-grid')) {
                        const items = entry.target.children;
                        Array.from(items).forEach((item, index) => {
                            item.style.animationDelay = `${index * 0.1}s`;
                            item.classList.add('animate-in');
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .value-card, .service-detail, .section-title'
        );
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    // Add loaded class
                    img.classList.add('loaded');
                    
                    // Stop observing
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===== SERVICE WORKER =====
function initServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/assets/js/service-worker.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful:', registration.scope);
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
}

// ===== FORM HANDLING =====
// This will be in a separate form-handler.js file
function initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Pre-fill service from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = serviceParam;
        }
    }
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Prepare form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Add metadata
            data.timestamp = new Date().toISOString();
            data.page_url = window.location.href;
            
            // Send to Google Sheets (replace with your Google Apps Script URL)
            const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Show success message
            showNotification('Message sent successfully! We\'ll contact you within 24 hours.', 'success');
            this.reset();
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to send message. Please email us directly.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" style="background:none;border:none;color:white;cursor:pointer;margin-left:10px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Log Core Web Vitals
    if ('PerformanceObserver' in window) {
        try {
            const po = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(entry.name + ': ' + entry.startTime);
                }
            });
            
            po.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });
        } catch (e) {
            console.log('PerformanceObserver not supported');
        }
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Script error:', e);
    
    // Send error to analytics (if you have one)
    // analytics.trackError(e);
    
    // Prevent default error handling
    e.preventDefault();
});

// ===== POLYFILLS =====
// Add necessary polyfills for older browsers
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPreloader,
        initMobileMenu,
        initBackToTop,
        initCurrentYear,
        initSmoothScroll,
        initNavbarScroll,
        initServiceFilter,
        initAnimations,
        initLazyLoading,
        initServiceWorker,
        initFormHandler,
        showNotification,
        initPerformanceMonitoring
    };
}
