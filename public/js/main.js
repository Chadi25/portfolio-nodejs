document.addEventListener('DOMContentLoaded', () => {
    // Détection mobile au chargement
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
    }

    // S'assurer que la bulle Goku est visible
    const bubble = document.getElementById('chatbot-bubble');
    if (bubble) {
        bubble.style.display = 'flex';
        bubble.style.zIndex = '10000';
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
                        
                        // S'assurer que la bulle Goku reste visible APRÈS l'animation
                        const bubble = document.getElementById('chatbot-bubble');
                        if (bubble) {
                            bubble.style.display = 'flex';
                            bubble.style.zIndex = '99999';
                            bubble.style.visibility = 'visible';
                            bubble.style.opacity = '1';
                            console.log('Bulle Goku forcée visible après animation');
                        }
                    }, 500);
                }, 1500);
            }, 500);
        }
    }

    // Animations de la page principale
    function initMainPageAnimations() {
        const texts = [
            'Apprenti Ingénieur Réseaux & Sécurité (Master ROC)',
            'Spécialisé dans l\'industrialisation des infrastructures (IaC)',
            'Spécialisé dans les architectures Zero Trust'
        ];
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

        // Touch events (première déclaration)
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
        let accumulatedDelta = 0;
        let lastDirection = null;

        // Fonction pour vérifier si on scroll dans une zone spécifique
        function isScrollingInScrollableElement(target) {
            return target.closest('.chatbot-messages') || 
                   target.closest('.chatbot-widget') ||
                   target.closest('.chatbot-container') ||
                   target.closest('.chatbot-form') ||
                   document.body.classList.contains('chatbot-open');
        }

        window.addEventListener('wheel', (e) => {
            if (document.body.classList.contains('chatbot-open')) {
                // Si la chatbox est ouverte, on bloque la navigation par scroll
                return;
            }
            
            // Vérifier si l'utilisateur scrolle dans un élément spécifique avec scroll natif
            const target = e.target;
            
            if (isScrollingInScrollableElement(target)) {
                // Si on scrolle dans un élément avec scroll natif, on laisse le scroll natif
                console.log('Scroll dans un élément scrollable, navigation désactivée');
                return;
            }
            
            if (isCertificationsPage) {
                const element = document.scrollingElement || document.documentElement;
                const isAtTop = element.scrollTop === 0;
                const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                    e.preventDefault();
                    navigateToPage(e.deltaY > 0 ? 'next' : 'prev');
                }
            } else {
                // e.preventDefault(); // Scroll natif rétabli
                if (isTransitioning) return;

                // Accumulation du scroll pour trackpad
                const dominantDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                const direction = dominantDelta > 0 ? 'next' : 'prev';

                if (lastDirection && direction !== lastDirection) {
                    accumulatedDelta = 0; // On change de sens, on reset
                }
                lastDirection = direction;

                accumulatedDelta += dominantDelta;

                console.log('Trackpad debug:', 'accumulatedDelta:', accumulatedDelta, 'direction:', direction);

                if (Math.abs(accumulatedDelta) > 40) { // seuil à ajuster si besoin
                    navigateToPage(direction);
                    accumulatedDelta = 0;
                }
            }
        }, { passive: false });

        // Gestion des événements touch pour mobile (seconde déclaration - réutilise les variables existantes)
        let touchStartTime = 0;
        let isScrollingInChatbot = false;
        let touchStartElement = null;

        // Touch start
        document.addEventListener('touchstart', (e) => {
            const target = e.target;
            touchStartElement = target;
            isScrollingInChatbot = isScrollingInScrollableElement(target);
            
            // Vérifier aussi si on touche directement la bulle Goku
            if (target.closest('#chatbot-bubble')) {
                console.log('Touch sur bulle Goku détecté - navigation bloquée');
                isScrollingInChatbot = true;
                return;
            }
            
            if (isScrollingInChatbot) {
                console.log('Touch dans chatbot détecté - navigation bloquée');
                return;
            }

            // Seulement si on n'est pas dans le chatbot
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
            console.log('Touch start pour navigation:', touchStartX, touchStartY);
        }, { passive: true });

        // Touch move
        document.addEventListener('touchmove', (e) => {
            // Toujours vérifier si on est maintenant dans le chatbot
            const currentTarget = e.target;
            const nowInChatbot = isScrollingInScrollableElement(currentTarget);
            
            if (nowInChatbot || isScrollingInChatbot) {
                console.log('Touch move dans chatbot - scroll natif autorisé');
                return;
            }

            if (document.body.classList.contains('chatbot-open')) {
                console.log('Chatbot ouvert - navigation bloquée');
                e.preventDefault();
                return;
            }

            const touchCurrentY = e.touches[0].clientY;
            const touchCurrentX = e.touches[0].clientX;
            const deltaY = touchStartY - touchCurrentY;
            const deltaX = touchStartX - touchCurrentX;
            const touchDuration = Date.now() - touchStartTime;

            // Vérifier si c'est un swipe vertical significatif
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50 && touchDuration < 500) {
                console.log('Swipe détecté:', deltaY > 0 ? 'vers le bas' : 'vers le haut');
                e.preventDefault();
                
                if (isCertificationsPage) {
                    const element = document.scrollingElement || document.documentElement;
                    const isAtTop = element.scrollTop === 0;
                    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

                    if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
                        navigateToPage(deltaY > 0 ? 'next' : 'prev');
                    }
                } else {
                    navigateToPage(deltaY > 0 ? 'next' : 'prev');
                }
            }
        }, { passive: false });

        // Touch end
        document.addEventListener('touchend', () => {
            isScrollingInChatbot = false;
            touchStartElement = null;
        }, { passive: true });
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
