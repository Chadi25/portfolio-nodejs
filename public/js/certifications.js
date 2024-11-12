// certifications.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('certModal');
    const closeBtn = document.querySelector('.close-btn');
    const certViewer = document.getElementById('certViewer');

    window.showCertDetails = (certId) => {
        const certPaths = {
            cert1: '/documents/certification1.pdf',
            cert2: '/documents/certification2.pdf',
            cert3: '/documents/certification3.pdf',
            cert4: '/documents/certification4.pdf',
            cert5: '/documents/DUT.pdf'  // Ajout du chemin vers le DUT
        };
        
        certViewer.src = certPaths[certId];
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        certViewer.src = '';  // Nettoyer la source
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            certViewer.src = '';  // Nettoyer la source
        }
    };
});