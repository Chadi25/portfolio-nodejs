// contact.js
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '{ sending... }';
        button.disabled = true;

        // Préparer les paramètres avec votre template
        const templateParams = {
            from_name: document.getElementById('_name').value,
            from_email: document.getElementById('_email').value,
            message: document.getElementById('_message').value,
            to_name: 'Chadi', // Vous pouvez personnaliser ceci
            reply_to: document.getElementById('_email').value
        };

        // Envoyer l'email avec vos IDs
        emailjs.send('service_vjb4q4g', 'template_zbk21l9', templateParams)
            .then(() => {
                // Success
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = '// Message sent successfully!';
                contactForm.appendChild(successMessage);
                contactForm.reset();
                
                // Retirer le message après 3 secondes
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            })
            .catch((error) => {
                // Error
                console.error('Error:', error);
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = '// Failed to send message. Please try again.';
                contactForm.appendChild(errorMessage);
                
                // Retirer le message d'erreur après 3 secondes
                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
            })
            .finally(() => {
                // Reset button
                button.textContent = '{ send_message }';
                button.disabled = false;
            });
    });
});