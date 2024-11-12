const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
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
    res.render('certifications', { 
        title: 'Certifications',
        page: 'certifications'
    });
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});