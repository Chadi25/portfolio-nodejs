// portfolio.js
let currentProject = 0;
const projects = document.querySelectorAll('.project');
const previews = document.querySelectorAll('.preview');

function showProject(index) {
    // Masquer tous les projets
    projects.forEach(project => project && project.classList.remove('active'));
    previews.forEach(preview => preview && preview.classList.remove('active'));

    // Afficher le projet sélectionné
    if (projects[index] && previews[index]) {
        projects[index].classList.add('active');
        previews[index].classList.add('active');
        currentProject = index;

        // Remet le scroll INTERNE du projet à zéro
        const content = projects[index].querySelector('.project-content');
        if (content) content.scrollTop = 0;
    }
}

function nextProject() {
    let next = (currentProject + 1) % projects.length;
    showProject(next);
}

function prevProject() {
    let prev = (currentProject - 1 + projects.length) % projects.length;
    showProject(prev);
}

// Navigation clavier : flèches gauche / droite
document.addEventListener('keydown', (e) => {
    // Ignorer si l'utilisateur tape dans un champ ou si le chatbot est actif
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (document.body.classList.contains('chatbot-open')) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextProject();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevProject();
    }
});

// Navigation par scroll / molette sur la page portfolio
// (désactivé si on scrolle dans ou près du bloc .project-content / barre latérale)
let wheelTimeout;
let wheelLock = false;
let accumulatedDelta = 0;

window.addEventListener('wheel', (e) => {
    if (!projects || projects.length === 0) return;

    // 1. Si la cible est dans le bloc de contenu du projet, laisser défiler le texte
    if (e.target.closest('.project-content')) {
        accumulatedDelta = 0;
        return;
    }

    // 2. Vérification par coordonnées pour sécuriser la zone de la barre latérale
    const activeProject = projects[currentProject];
    if (activeProject) {
        const content = activeProject.querySelector('.project-content');
        if (content) {
            const rect = content.getBoundingClientRect();
            // Marge pour couvrir la scrollbar et éviter tout saut accidentel
            if (
                e.clientX >= rect.left - 10 &&
                e.clientX <= rect.right + 30 &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                accumulatedDelta = 0;
                return;
            }
        }
    }

    if (wheelLock) return;

    // Reset de l'accumulation après un court silence
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        accumulatedDelta = 0;
    }, 250);

    const dominantDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    // Réinitialiser en cas d'inversion de direction
    if ((accumulatedDelta > 0 && dominantDelta < 0) || (accumulatedDelta < 0 && dominantDelta > 0)) {
        accumulatedDelta = 0;
    }

    accumulatedDelta += dominantDelta;

    // Seuil adapté pour éviter l'extrême sensibilité au trackpad
    const SCROLL_THRESHOLD = 120;

    if (Math.abs(accumulatedDelta) >= SCROLL_THRESHOLD) {
        if (accumulatedDelta > 0) {
            nextProject();
        } else {
            prevProject();
        }
        accumulatedDelta = 0;
        wheelLock = true;
        setTimeout(() => {
            wheelLock = false;
        }, 900); // Cooldown pour absorber l'inertie du trackpad
    }
}, { passive: true });

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    showProject(0);
});