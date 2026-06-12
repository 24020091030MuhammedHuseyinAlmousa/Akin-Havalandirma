// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger to X
    hamburger.classList.toggle('toggle');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});

// Active Link highlighting on Scroll (Intersection Observer)
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-links a');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                    moveNavSlider(item);
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Nav Slider Logic
const navSlider = document.querySelector('.nav-slider');
const navLinksContainer = document.querySelector('.nav-links');

function moveNavSlider(target) {
    if(!target || !navSlider) return;
    // Don't move if on mobile where nav-slider is hidden
    if(window.innerWidth <= 768) return;

    const navLinksRect = navLinksContainer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const left = targetRect.left - navLinksRect.left;
    const width = targetRect.width;
    
    navSlider.style.width = `${width}px`;
    navSlider.style.transform = `translateX(${left}px)`;
}

window.addEventListener('load', () => {
    // Delay slightly to ensure fonts/layout are ready
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-links a.active');
        if(activeLink) moveNavSlider(activeLink);
    }, 100);
});

window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav-links a.active');
    if(activeLink) moveNavSlider(activeLink);
});

// Slider (Projelerimiz)
const track = document.querySelector('.slider-track');
const originalSlides = Array.from(track.children);
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const dots = document.querySelectorAll('.dot');

// Infinite slider setup: clone first and last slides
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

track.appendChild(firstClone);
track.insertBefore(lastClone, originalSlides[0]);

const slides = Array.from(track.children);
let currentIndex = 1; // Start at the first original slide
let isTransitioning = false;

// Initial position to bypass the first clone without animation
track.style.transition = 'none';
track.style.transform = `translateX(-${currentIndex * 100}%)`;

function updateSlider(index) {
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots (adjust index because of clones)
    dots.forEach(dot => dot.classList.remove('active'));
    let dotIndex = index - 1;
    if (dotIndex < 0) dotIndex = originalSlides.length - 1;
    if (dotIndex >= originalSlides.length) dotIndex = 0;
    dots[dotIndex].classList.add('active');
}

track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (slides[currentIndex].id === 'first-clone') {
        track.style.transition = 'none';
        currentIndex = 1;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    if (slides[currentIndex].id === 'last-clone') {
        track.style.transition = 'none';
        currentIndex = slides.length - 2;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
});

let autoSlideInterval;
let autoSlideTimeout;
const AUTO_SLIDE_TIME = 5000;
const INTERACTION_DELAY = 7000;

function startAutoSlide(delay = AUTO_SLIDE_TIME) {
    clearInterval(autoSlideInterval);
    clearTimeout(autoSlideTimeout);
    
    if(delay === AUTO_SLIDE_TIME) {
        autoSlideInterval = setInterval(moveToNext, AUTO_SLIDE_TIME);
    } else {
        autoSlideTimeout = setTimeout(() => {
            moveToNext();
            startAutoSlide(AUTO_SLIDE_TIME);
        }, delay);
    }
}

function handleUserInteraction() {
    startAutoSlide(INTERACTION_DELAY);
}

function moveToNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateSlider(currentIndex);
}

function moveToPrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateSlider(currentIndex);
}

nextBtn.addEventListener('click', () => {
    moveToNext();
    handleUserInteraction();
});

prevBtn.addEventListener('click', () => {
    moveToPrev();
    handleUserInteraction();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isTransitioning || currentIndex === index + 1) return;
        isTransitioning = true;
        currentIndex = index + 1;
        updateSlider(currentIndex);
        handleUserInteraction();
    });
});

// Delay starting auto slide just to ensure everything is set up
setTimeout(() => startAutoSlide(AUTO_SLIDE_TIME), 100);

// Theme Toggle Logic
(() => {
    // getStoredTheme ve setTheme fonksiyonları index.html <head> kısmında tanımlı
    // O yüzden burada sadece etkileşim (UI) ve logo güncellemelerini hallediyoruz
    const getStoredTheme = () => localStorage.getItem('theme');
    const setStoredTheme = theme => localStorage.setItem('theme', theme);
    
    const navbarLogo = document.getElementById('navbar-logo');
    const footerLogo = document.getElementById('footer-logo');

    const updateLogos = (theme) => {
        if (theme === 'dark') {
            if (navbarLogo) navbarLogo.src = 'img/AkinHavalandirmaLogo4dark.webp';
        } else {
            if (navbarLogo) navbarLogo.src = 'img/AkinHavalandirmaLogo4light.webp';
        }
    };

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = theme => {
        let appliedTheme = theme;
        if (theme === 'auto') {
            appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', appliedTheme);
        updateLogos(appliedTheme);
    };

    const showActiveTheme = (theme) => {
        const activeThemeIcon = document.querySelector('.theme-toggle-btn .theme-icon-active use');
        const btnToActive = document.querySelector(`[data-theme-value="${theme}"]`);
        
        if (!btnToActive || !activeThemeIcon) return;

        const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');

        document.querySelectorAll('[data-theme-value]').forEach(element => {
            element.classList.remove('active');
        });

        btnToActive.classList.add('active');
        activeThemeIcon.setAttribute('href', svgOfActiveBtn);
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme());
            showActiveTheme('auto');
        } else {
            updateLogos(storedTheme);
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        // İlk yüklemede logoları da güncelle
        const initialTheme = getStoredTheme() || 'auto';
        const appliedTheme = initialTheme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : initialTheme;
        setTheme(initialTheme); // Temayı DOM'a uygula
        updateLogos(appliedTheme);
        showActiveTheme(initialTheme);

        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        const themeDropdown = document.getElementById('theme-dropdown');

        if(themeToggleBtn && themeDropdown) {
            themeToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                themeDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!themeDropdown.contains(e.target) && !themeToggleBtn.contains(e.target)) {
                    themeDropdown.classList.remove('show');
                }
            });

            document.querySelectorAll('[data-theme-value]').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-theme-value');
                    setStoredTheme(theme);
                    setTheme(theme);
                    showActiveTheme(theme);
                    themeDropdown.classList.remove('show');
                });
            });
        }
        
        // --- Anti-Spam E-Posta Koruması ---
        document.querySelectorAll('.protected-email').forEach(link => {
            const u = link.getAttribute('data-u');
            const d = link.getAttribute('data-d');
            if (u && d) {
                // E-postayı dinamik olarak birleştir
                const email = u + '@' + d;
                link.setAttribute('href', 'mailto:' + email);
                link.textContent = email;
            }
        });
        
    });
})();
