const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Charger les variables d'environnement depuis le .env à la racine du projet,
// même si le répertoire courant change
const dotenvResult = require('dotenv').config({
  path: path.join(__dirname, '.env')
});

console.log('🌍 __dirname =', __dirname);
console.log('🌍 process.cwd() =', process.cwd());
console.log('🌍 dotenv loaded =', !dotenvResult.error);
if (dotenvResult && dotenvResult.parsed) {
  console.log('🌍 dotenv keys =', Object.keys(dotenvResult.parsed));
}

const app = express();
// Remplacement de l'import node-fetch pour compatibilité CommonJS/v3+
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Utiliser le port de Vercel ou 3000 en local
const port = process.env.PORT || 3000;

// Configuration des variables d'environnement
// 1) On lit d'abord depuis process.env (cas Vercel / prod),
// 2) puis on fallback sur le .env parsé localement si besoin (gestion BOM / espaces).
let OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY && dotenvResult && dotenvResult.parsed) {
  const entries = Object.entries(dotenvResult.parsed);
  for (const [rawKey, value] of entries) {
    const normalizedKey = rawKey.replace(/\uFEFF/g, '').trim();
    if (normalizedKey === 'OPENROUTER_API_KEY') {
      OPENROUTER_API_KEY = value;
      break;
    }
  }
}

// Debug: Vérifier si l'API key est chargée
console.log('🔑 API Key chargée:', OPENROUTER_API_KEY ? 'OUI' : 'NON');
console.log('🔑 API Key longueur:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0);
console.log('🔑 API Key début:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.substring(0, 10) + '...' : 'N/A');

// Système anti-spam simple
const userRequests = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

// Middleware anti-spam
const rateLimit = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!userRequests.has(clientIP)) {
    userRequests.set(clientIP, []);
  }
  
  const userRequestsList = userRequests.get(clientIP);
  
  // Nettoyer les anciennes requêtes
  const recentRequests = userRequestsList.filter(time => now - time < RATE_LIMIT_WINDOW);
  userRequests.set(clientIP, recentRequests);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ 
      error: 'Trop de requêtes. Veuillez attendre un moment.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }
  
  recentRequests.push(now);
  next();
};

// Générateur de réponse locale (mode "offline" sans appel OpenRouter)
function buildLocalFallback(userMessageRaw = '') {
  const userMessage = (userMessageRaw || '').toLowerCase();
  let fallbackResponse = '';

  if (userMessage.match(/^(salut|bonjour|hello|hi|hey|ça va|ca va|comment ça va|comment ca va)[\s!?]*$/i)) {
    // Même réponse courte que côté frontend
    fallbackResponse = "Salut ! Ça va bien ! Que veux-tu savoir sur Chadi ?";
  } else if (
    userMessage.includes('réseau') ||
    userMessage.includes('cisco') ||
    userMessage.includes('switch') ||
    userMessage.includes('vlan')
  ) {
    fallbackResponse = "Chadi maîtrise les réseaux : configuration de VLAN, routage, sécurité et supervision. Il travaille avec Cisco Packet Tracer, Wireshark et prépare des certifications Cisco (type CCNA).";
  } else if (
    userMessage.includes('programm') ||
    userMessage.includes('code') ||
    userMessage.includes('dev') ||
    userMessage.includes('python') ||
    userMessage.includes('script')
  ) {
    fallbackResponse = "Chadi programme en Python, JavaScript, PowerShell et Bash. Il développe des scripts d’automatisation, des petits services Node.js et ce site portfolio, avec une approche très orientée pratique.";
  } else if (
    userMessage.includes('jtekt') ||
    userMessage.includes('stage') ||
    userMessage.includes('entreprise')
  ) {
    fallbackResponse = "Chadi a réalisé un stage chez JTEKT où il a travaillé sur des serveurs, la sécurité (PRA, SFTP), l’automatisation et la documentation IT. Il est à l’aise dans un environnement industriel exigeant.";
  } else if (
    userMessage.includes('projet') ||
    userMessage.includes('académique') ||
    userMessage.includes('monitoring') ||
    userMessage.includes('sentinelle')
  ) {
    fallbackResponse = "Chadi a mené plusieurs projets académiques : système de monitoring réseau, plateforme IoT/cyber (Sentinelle 4.0), bot Discord et scripts d’automatisation. Il aime relier réseaux, infra et code.";
  } else if (
    userMessage.includes('certif') ||
    userMessage.includes('cisco') ||
    userMessage.includes('ccna')
  ) {
    fallbackResponse = "Chadi suit le cursus Cisco Networking Academy et prépare le CCNA. Il a déjà des bases solides en routing, switching, sécurité et protocole réseau.";
  } else if (
    userMessage.includes('chadi') ||
    userMessage.includes('qui est') ||
    userMessage.includes('qui es-tu') ||
    userMessage.includes('étudiant')
  ) {
    fallbackResponse = "Chadi Abouhnaik est étudiant en BUT Réseaux & Télécommunications (parcours IoM), orienté réseaux, infra et automatisation. Il recherche une alternance à partir de septembre 2025 dans un environnement technique exigeant.";
  } else if (
    userMessage.includes('compétence') ||
    userMessage.includes('skills') ||
    userMessage.includes('savoir faire')
  ) {
    fallbackResponse = "Chadi a des compétences en réseaux (Cisco, VLAN, routage, sécurité), en systèmes (Windows Server, Linux, virtualisation) et en automation/dev (Python, PowerShell, Docker). Il aime documenter et industrialiser ce qu’il met en place.";
  } else {
    fallbackResponse = "Je suis le bot de Chadi. Je peux te parler de ses compétences réseaux, programmation, de son stage chez JTEKT, de ses projets académiques ou de ses certifications. Que veux-tu savoir précisément sur lui ?";
  }

  return fallbackResponse;
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(express.json({ limit: '1mb' })); // Limite la taille des requêtes

// Headers de sécurité
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

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

app.post('/api/chatbot', rateLimit, async (req, res) => {
  const { messages } = req.body;
  
  // Validation des données
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages invalides' });
  }
  
  // Validation de la taille des messages
  const totalLength = messages.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
  if (totalLength > 4000) {
    return res.status(400).json({ error: 'Message trop long' });
  }
  
  // Récupérer le dernier message utilisateur pour les fallbacks
  const lastUserMessage = messages[messages.length - 1]?.content || '';

  // Si aucune clé API n'est configurée, basculer en mode local "offline"
  if (!OPENROUTER_API_KEY) {
    console.warn('⚠️ OPENROUTER_API_KEY manquante - utilisation du mode local sans appel OpenRouter');
    const fallbackResponse = buildLocalFallback(lastUserMessage);
    return res.status(200).json({
      response: fallbackResponse,
      local: true
    });
  }
  
  try {
    console.log('🚀 Tentative d\'appel OpenRouter API...');
    console.log('🔑 Utilisation de l\'API key:', OPENROUTER_API_KEY.substring(0, 20) + '...');
    
    // Timeout de 8 secondes pour éviter le timeout Vercel de 10s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        // Ces deux en-têtes aident OpenRouter pour le routage et l'autorisation
        'HTTP-Referer': 'https://vercel.app',
        'X-Title': 'Portfolio Chatbot'
      },
      body: JSON.stringify({
        // Utiliser l’auto-routing pour éviter les indisponibilités ponctuelles d’un modèle gratuit
        model: 'openrouter/auto',
        messages,
        max_tokens: 500, // Augmenter pour des réponses complètes
        temperature: 0.7
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Réponse OpenRouter status:', response.status);
    console.log('📡 Réponse OpenRouter headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur OpenRouter:', errorText);
      // Propager l'erreur claire au client pour un affichage explicite
      return res.status(response.status).json({
        error: 'OpenRouter API error',
        code: response.status,
        details: errorText
      });
    }
    
    const data = await response.json();
    
    // Log pour debug (sans les messages sensibles)
    console.log('✅ API OpenRouter response status:', response.status);
    console.log('✅ Réponse reçue:', data.choices ? 'OUI' : 'NON');
    console.log('✅ Structure data:', JSON.stringify(data).substring(0, 200));
    
    // Extraire la réponse du modèle
    let botResponse = data.choices?.[0]?.message?.content || null;
    
    // Si pas de réponse dans choices, essayer d'autres chemins
    if (!botResponse) {
      console.warn('⚠️ Pas de réponse dans choices, recherche alternative...');
      botResponse = data.message?.content || data.content || data.text || null;
    }
    
    // Si toujours vide, utiliser le fallback local
    if (!botResponse || botResponse.trim() === '') {
      console.warn('⚠️ Réponse vide de l\'API, utilisation du fallback local');
      botResponse = buildLocalFallback(lastUserMessage);
    } else {
      // Nettoyer les balises de formatage du modèle
      botResponse = botResponse
        .replace(/<s>/g, '')
        .replace(/<\/s>/g, '')
        .replace(/\[OUT\]/g, '')
        .replace(/\[\/OUT\]/g, '')
        .replace(/\[INST\]/g, '')
        .replace(/\[\/INST\]/g, '')
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    console.log('🤖 Réponse bot finale:', botResponse ? botResponse.substring(0, 100) + '...' : 'VIDE');
    
    // Toujours renvoyer une réponse, même si vide (le frontend gérera)
    res.json({ response: botResponse || buildLocalFallback(lastUserMessage) });
  } catch (err) {
    console.error('💥 Erreur chatbot complète:', err);
    console.error('💥 Stack trace:', err.stack);
    
    // Gestion spécifique du timeout
    if (err.name === 'AbortError') {
      console.error('⏰ Timeout détecté - API trop lente');
      
      const fallbackResponse = buildLocalFallback(lastUserMessage);
      return res.status(408).json({ 
        response: fallbackResponse,
        timeout: true
      });
    }
    
    res.status(500).json({ error: 'Erreur chatbot', details: err.message });
  }
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