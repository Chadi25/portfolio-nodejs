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
// (désactivé si on scrolle dans le bloc .project-content)
let wheelTimeout;
let wheelLock = false;

window.addEventListener('wheel', (e) => {
    // Si la roulette est sur le contenu interne, on laisse défiler normalement
    if (e.target.closest('.project-content')) return;
    if (wheelLock) return;

    if (Math.abs(e.deltaY) > 30 || Math.abs(e.deltaX) > 30) {
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (delta > 0) {
            nextProject();
        } else {
            prevProject();
        }
        wheelLock = true;
        setTimeout(() => { wheelLock = false; }, 700);
    }
}, { passive: true });

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    showProject(0);
});