document.addEventListener('DOMContentLoaded', () => {
    const terminalText = "Chadi.Abouhaik@portfolio:~$ ";
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
            // Afficher le message de bienvenue
            setTimeout(() => {
                terminalWelcome.classList.remove('hidden');
                // Attendre puis passer à la page principale
                setTimeout(() => {
                    terminalIntro.classList.add('fade-out');
                    setTimeout(() => {
                        terminalIntro.style.display = 'none';
                        mainContent.style.display = 'block';
                        // Initialiser les animations de la page principale
                        initMainPageAnimations();
                    }, 500);
                }, 1500);
            }, 500);
        }
    }

    // Démarrer l'animation du terminal
    setTimeout(typeWriter, 500);

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

    // Animation de défilement fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

