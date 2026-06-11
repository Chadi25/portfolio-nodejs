// resume.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('documentModal');
    const closeBtn = document.querySelector('.close-btn');
    const documentViewer = document.getElementById('documentViewer');
    const modalTitle = document.getElementById('modalTitle');
    const pdfViewer = document.getElementById('pdfViewer');

    // Vérifier si les éléments existent avant de les utiliser
    if (!modal || !closeBtn || !documentViewer) {
        console.log('Éléments de resume non trouvés sur cette page');
        return;
    }

    window.showDocument = (documentPath, title) => {
        const fullPath = `/documents/${documentPath}`;
        
        // Mettre à jour le titre du modal
        modalTitle.textContent = title;
        
        // Afficher le document dans le modal
        documentViewer.src = fullPath;
        modal.style.display = 'block';
        
        // Masquer le PDF principal
        if (pdfViewer) {
            pdfViewer.style.display = 'none';
        }
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        documentViewer.src = '';
        
        // Remettre le PDF principal
        if (pdfViewer) {
            pdfViewer.style.display = 'block';
        }
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            documentViewer.src = '';
            
            // Remettre le PDF principal
            if (pdfViewer) {
                pdfViewer.style.display = 'block';
            }
        }
    };
});