const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// Utiliser le port de Vercel ou 3000 en local
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Configuration des vues - chemin absolu explicite
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Routes
app.get('/', (req, res) => {
    res.render('home', { 
        title: 'Home',
        page: 'home'
    });
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio', { 
        title: 'Portfolio',
        page: 'portfolio'
    });
});

app.get('/certifications', (req, res) => {   
    try {
        res.render('certifications', { 
            title: 'Certifications',
            page: 'certifications'
        });
    } catch (error) {
        console.error('Error rendering certifications:', error);
        res.status(500).send('Error loading certifications page');
    }
});

app.get('/contact', (req, res) => {
    res.render('contact', { 
        title: 'Contact',
        page: 'contact'
    });
});

app.get('/resume', (req, res) => {
    res.render('resume', { 
        title: 'Resume',
        page: 'resume'
    });
});

// Gestionnaire d'erreur 404
app.use((req, res) => {
    res.status(404).render('home', {
        title: '404 - Not Found',
        page: 'home'
    });
});

// Export pour Vercel
module.exports = app;

// Démarrer le serveur seulement en développement
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}