// resume.js
document.addEventListener('DOMContentLoaded', () => {
    const codeContent = document.querySelector('.code-content');
    const lineNumbers = document.querySelector('.line-numbers');
    
    // Générer les numéros de ligne
    const lines = codeContent.innerHTML.split('\n').length;
    for(let i = 1; i <= lines; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
    }
});