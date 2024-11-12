// portfolio.js
let currentProject = 0;
const projects = document.querySelectorAll('.project');
const previews = document.querySelectorAll('.preview');

function showProject(index) {
    // Masquer tous les projets
    projects.forEach(project => project.classList.remove('active'));
    previews.forEach(preview => preview.classList.remove('active'));
    
    // Afficher le projet sélectionné
    projects[index].classList.add('active');
    previews[index].classList.add('active');
    currentProject = index;
}

function nextProject() {
    let next = (currentProject + 1) % projects.length;
    showProject(next);
}

function prevProject() {
    let prev = (currentProject - 1 + projects.length) % projects.length;
    showProject(prev);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    showProject(0);
});