// certifications.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('certModal');
    const closeBtn = document.querySelector('.close-btn');
    const certViewer = document.getElementById('certViewer');

    // Vérifier si les éléments existent avant de les utiliser
    if (!modal || !closeBtn || !certViewer) {
        console.log('Éléments de certification non trouvés sur cette page');
        return;
    }

    window.showCertDetails = (certId) => {
        const certPaths = {
            cert1: '/documents/certification1.pdf',
            cert2: '/documents/certification2.pdf',
            cert3: '/documents/certification3.pdf',
            cert4: '/documents/certification4.pdf',
            cert5: '/documents/DUT.pdf', // DUT
            certification5: '/documents/certification5.pdf' // Cybersécurité
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