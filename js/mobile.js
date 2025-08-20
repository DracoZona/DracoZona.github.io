// Mobile navigation and scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile elements if they don't exist
    createMobileElements();
    
    // Initialize mobile functionality
    initMobileNav();
    initScrollToTop();
});

function createMobileElements() {
    const header = document.querySelector('.header .container');
    
    // Add hamburger menu if it doesn't exist
    if (!document.querySelector('.hamburger')) {
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(hamburger);
    }
    
    // Add mobile navigation if it doesn't exist
    if (!document.querySelector('.mobile-nav')) {
        const nav = document.querySelector('.nav');
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        
        // Add header with close button
        const navHeader = document.createElement('div');
        navHeader.className = 'mobile-nav-header';
        navHeader.innerHTML = `
            <div class="mobile-nav-title">Navigation</div>
            <button class="mobile-close-btn">×</button>
        `;
        mobileNav.appendChild(navHeader);
        
        // Clone navigation links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            const mobileLink = link.cloneNode(true);
            mobileNav.appendChild(mobileLink);
        });
        
        document.body.appendChild(mobileNav);
    }
    
    // Add mobile overlay if it doesn't exist
    if (!document.querySelector('.mobile-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        document.body.appendChild(overlay);
    }
    
    // Add scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-to-top')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);
    }
}

function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-overlay');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    
    // Close menu when clicking on links
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}

function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    window.addEventListener('scroll', toggleScrollButton);
    scrollBtn.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleScrollButton();
}