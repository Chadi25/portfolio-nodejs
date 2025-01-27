document.addEventListener('DOMContentLoaded', () => {
    // Détection mobile au chargement
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
    }

    const terminalText = "Chadi.Abouhnaik@portfolio:~$ ";
    const typingText = document.getElementById('typing-text');
    const terminalWelcome = document.querySelector('.terminal-welcome');
    const terminalIntro = document.getElementById('terminal-intro');
    const mainContent = document.getElementById('main-content');
    let index = 0;

    // Animation de typing simple
    function typeWriter() {
        if (index < terminalText.length) {
            typingText.textContent += terminalText.charAt(index);
            index++;
            setTimeout(typeWriter, Math.random() * 50 + 50);
        } else {
            setTimeout(() => {
                terminalWelcome.classList.remove('hidden');
                setTimeout(() => {
                    terminalIntro.classList.add('fade-out');
                    setTimeout(() => {
                        terminalIntro.style.display = 'none';
                        mainContent.style.display = 'block';
                        initMainPageAnimations();
                        initNavigation();
                    }, 500);
                }, 1500);
            }, 500);
        }
    }

    // Animations de la page principale
    function initMainPageAnimations() {
        const texts = ['Étudiant', 'en Réseaux et Télécoms', 'motivé', 'en recherche d\'une entreprise'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseTime = 2000;

        function type() {
            const typingElement = document.querySelector('.typing-text');
            if (!typingElement) return;

            const currentText = texts[textIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            typingElement.textContent = currentText.substring(0, charIndex);

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, pauseTime);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
            }
        }

        type();
    }

    // Navigation fluide entre les pages
    function initNavigation() {
        const pageRoutes = [
            { name: 'home', path: '/' },
            { name: 'portfolio', path: '/portfolio' },
            { name: 'certifications', path: '/certifications' },
            { name: 'resume', path: '/resume' },
            { name: 'contact', path: '/contact' }
        ];

        const currentPath = window.location.pathname;
        const currentIndex = pageRoutes.findIndex(page => 
            page.path === currentPath || 
            (currentPath === '/' && page.path === '/') ||
            (currentPath !== '/' && page.path === currentPath)
        );

        const isCertificationsPage = currentPath === '/certifications';
        let isTransitioning = false;
        let lastNavTime = Date.now();
        const navCooldown = 800;

        function navigateToPage(direction) {
            const now = Date.now();
            if (isTransitioning || (now - lastNavTime) < navCooldown) return;
            
            let nextIndex = currentIndex;
            if (direction === 'next' && currentIndex < pageRoutes.length - 1) {
                nextIndex++;
            } else if (direction === 'prev' && currentIndex > 0) {
                nextIndex--;
            } else {
                return;
            }

            if (nextIndex >= 0 && nextIndex < pageRoutes.length) {
                isTransitioning = true;
                lastNavTime = now;
                document.body.classList.add('page-transitioning');
                
                setTimeout(() => {
                    window.location.href = pageRoutes[nextIndex].path;
                }, 500);

                setTimeout(() => {
                    isTransitioning = false;
                }, navCooldown);
            }
        }

        // Gestion du scroll indicator
        document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
            if (isCertificationsPage) {
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            } else {
                navigateToPage('next');
            }
        });

        // Touch events
        let touchStartY = 0;
        let touchStartX = 0;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (e) => {
            if (!isTransitioning) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
                navigateToPage(deltaX > 0 ? 'next' : 'prev');
            } else if (isCertificationsPage) {
                const element = document.scrollingElement || document.documentElement;
                const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
                const isAtTop = element.scrollTop === 0;

                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (isAtBottom && deltaY > 0) {
                        navigateToPage('next');
                    } else if (isAtTop && deltaY < 0) {
                        navigateToPage('prev');
                    }
                }
            } else if (Math.abs(deltaY) > minSwipeDistance) {
                navigateToPage(deltaY > 0 ? 'next' : 'prev');
            }
        }, { passive: true });

        // Wheel events
        let wheelTimeout;
        window.addEventListener('wheel', (e) => {
            if (isCertificationsPage) {
                const element = document.scrollingElement || document.documentElement;
                const isAtTop = element.scrollTop === 0;
                const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                    e.preventDefault();
                    navigateToPage(e.deltaY > 0 ? 'next' : 'prev');
                }
            } else {
                e.preventDefault();
                if (isTransitioning) return;

                clearTimeout(wheelTimeout);
                wheelTimeout = setTimeout(() => {
                    if (Math.abs(e.deltaY) > 30) {
                        navigateToPage(e.deltaY > 0 ? 'next' : 'prev');
                    }
                }, 50);
            }
        }, { passive: false });
    }

    // Démarrer l'animation du terminal
    if (document.getElementById('terminal-intro')) {
        setTimeout(typeWriter, 500);
    } else {
        initNavigation();
    }
    
});

// Menu hamburger toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
  }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
  });
});

// Adjust viewport height for mobile browsers
const adjustViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

window.addEventListener('resize', adjustViewportHeight);
adjustViewportHeight();
