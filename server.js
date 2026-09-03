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

// Helper pour récupérer proprement les variables d'environnement (avec gestion BOM / espaces)
function getEnv(key) {
  if (process.env[key]) return process.env[key].trim();
  if (dotenvResult && dotenvResult.parsed) {
    for (const [rawKey, value] of Object.entries(dotenvResult.parsed)) {
      const normalizedKey = rawKey.replace(/\uFEFF/g, '').trim();
      if (normalizedKey === key && value) {
        return value.trim();
      }
    }
  }
  return '';
}

const GEMINI_API_KEY = getEnv('GEMINI_API_KEY');
const OPENROUTER_API_KEY = getEnv('OPENROUTER_API_KEY');
const GROQ_API_KEY = getEnv('GROQ_API_KEY');

// Debug: Afficher les fournisseurs IA configurés
console.log('🤖 Fournisseurs IA configurés :');
console.log('   - Google Gemini :', GEMINI_API_KEY ? '✅ OUI' : '❌ NON');
console.log('   - OpenRouter    :', OPENROUTER_API_KEY ? '✅ OUI' : '❌ NON');
console.log('   - Groq          :', GROQ_API_KEY ? '✅ OUI' : '❌ NON');

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

// Générateur de réponse locale intelligent (mode fallback 100% infaillible)
function buildLocalFallback(userMessageRaw = '') {
  const userMessage = (userMessageRaw || '').toLowerCase().trim();
  let fallbackResponse = '';

  if (userMessage.match(/^(salut|bonjour|bonsoir|hello|hi|hey|coucou|yo|ça va|ca va|comment ça va|comment ca va)[\s!?]*$/i)) {
    fallbackResponse = "Salut ! Ça va très bien, merci ! Je suis Goku, l'assistant virtuel de Chadi. Que souhaites-tu savoir sur son parcours, ses compétences ou ses projets ?";
  } else if (
    userMessage.includes('alternance') ||
    userMessage.includes('recrut') ||
    userMessage.includes('embauche') ||
    (userMessage.includes('stage') && !userMessage.includes('jtekt')) ||
    userMessage.includes('contrat') ||
    userMessage.includes('dispo') ||
    userMessage.includes('mobile') ||
    userMessage.includes('luxembourg')
  ) {
    fallbackResponse = "Chadi recherche activement une **alternance dès septembre 2025** dans le cadre de son Master (Réseaux, Objets Connectés et IA au CNAM). Il cible des opportunités en **ingénierie réseaux**, **administration systèmes / cloud**, **DevOps** ou **cybersécurité**. Il est mobile en France et au Luxembourg !";
  } else if (
    userMessage.includes('formation') ||
    userMessage.includes('étude') ||
    userMessage.includes('etude') ||
    userMessage.includes('cnam') ||
    userMessage.includes('master') ||
    userMessage.includes('but') ||
    userMessage.includes('diplôme') ||
    userMessage.includes('diplome') ||
    userMessage.includes('école') ||
    userMessage.includes('ecole') ||
    userMessage.includes('université') ||
    userMessage.includes('universite')
  ) {
    fallbackResponse = "Chadi prépare actuellement un **Master Réseaux, Objets Connectés et Intelligence Artificielle au CNAM** (2025–2027). Il est titulaire d'un **BUT Réseaux & Télécommunications** (parcours Internet des Objets et Mobilité) obtenu à l'Université Marie et Louis Pasteur (2022–2025).";
  } else if (
    userMessage.includes('jtekt') ||
    (userMessage.includes('stage') && userMessage.includes('jtekt')) ||
    userMessage.includes('entreprise')
  ) {
    fallbackResponse = "Lors de son **stage de 3 mois chez JTEKT**, Chadi a travaillé dans un environnement industriel exigeant : déploiement d'un **serveur SFTP sécurisé**, participation au **Plan de Reprise d'Activité (PRA)** avec tests de sauvegarde/restauration, **automatisation de tâches d'administration avec PowerShell**, et migration de serveurs Windows/Linux.";
  } else if (
    userMessage.includes('sentinelle') ||
    userMessage.includes('monitoring') ||
    userMessage.includes('projet') ||
    userMessage.includes('académique') ||
    userMessage.includes('iot') ||
    userMessage.includes('suricata') ||
    userMessage.includes('grafana')
  ) {
    fallbackResponse = "Chadi a réalisé plusieurs projets techniques marquants : **Sentinelle 4.0** (plateforme de cybersécurité IoT avec sonde Suricata IDS et alertes automatisées), une **infrastructure de monitoring réseau complète** (Prometheus, Grafana, InfluxDB), un **bot Discord interactif**, et ce **portfolio web full-stack**.";
  } else if (
    userMessage.includes('réseau') ||
    userMessage.includes('reseau') ||
    userMessage.includes('cisco') ||
    userMessage.includes('switch') ||
    userMessage.includes('routeur') ||
    userMessage.includes('vlan') ||
    userMessage.includes('ospf') ||
    userMessage.includes('bgp') ||
    userMessage.includes('vpn') ||
    userMessage.includes('ipsec') ||
    userMessage.includes('firewall') ||
    userMessage.includes('pfsense') ||
    userMessage.includes('wireshark')
  ) {
    fallbackResponse = "Chadi possède de solides compétences en **réseaux et sécurité** : configuration de switchs et routeurs Cisco, segmentation par **VLANs** et routage inter-VLAN, règles de sécurité (**ACL**), routage dynamique (**OSPF**, notions BGP), tunnels **VPN IPSec**, pare-feu (Cisco ASA, pfSense) et analyse de paquets avec **Wireshark**.";
  } else if (
    userMessage.includes('certif') ||
    userMessage.includes('ccna')
  ) {
    fallbackResponse = "Chadi suit le cursus **Cisco Networking Academy** et a validé les certifications académiques : **CCNA 1** (Routing & Switching), **CCNA 2** (Switching, Routing & Wireless), **CCNA 3** (Enterprise Networking, Security & Automation) ainsi que **Cisco IT Essentials**. Il prépare activement l'examen officiel CCNA.";
  } else if (
    userMessage.includes('programm') ||
    userMessage.includes('code') ||
    userMessage.includes('dev') ||
    userMessage.includes('python') ||
    userMessage.includes('script') ||
    userMessage.includes('powershell') ||
    userMessage.includes('bash') ||
    userMessage.includes('javascript') ||
    userMessage.includes('node')
  ) {
    fallbackResponse = "En programmation et automatisation, Chadi développe en **Python**, **JavaScript (Node.js)**, **PowerShell** et **Bash**. Il a également des notions en **C**, **Java**, **PHP** et **SQL**, et utilise quotidiennement **Git**, **Docker** et **VS Code**.";
  } else if (
    userMessage.includes('système') ||
    userMessage.includes('systeme') ||
    userMessage.includes('linux') ||
    userMessage.includes('windows server') ||
    userMessage.includes('active directory') ||
    userMessage.includes('vmware') ||
    userMessage.includes('proxmox') ||
    userMessage.includes('virtualisation')
  ) {
    fallbackResponse = "Côté systèmes, Chadi administre **Windows Server** (Active Directory, DNS, DHCP, GPO, IIS) et **Linux** (Debian, Ubuntu, CentOS). Il est à l'aise avec la virtualisation sous **VMware ESXi**, **Proxmox** et **Hyper-V**, ainsi qu'avec les conteneurs **Docker**.";
  } else if (
    userMessage.includes('devops') ||
    userMessage.includes('ansible') ||
    userMessage.includes('terraform') ||
    userMessage.includes('cloud') ||
    userMessage.includes('azure') ||
    userMessage.includes('aws') ||
    userMessage.includes('kubernetes')
  ) {
    fallbackResponse = "En DevOps & Cloud, Chadi utilise **Ansible** pour automatiser les déploiements, **Terraform** pour l'Infrastructure as Code (IaC), **Docker** et **Kubernetes** pour la conteneurisation, ainsi que des plateformes Cloud comme **Azure** et **AWS**.";
  } else if (
    userMessage.includes('langue') ||
    userMessage.includes('anglais') ||
    userMessage.includes('toeic')
  ) {
    fallbackResponse = "Chadi est de langue maternelle française, possède un niveau d'anglais professionnel certifié par un **TOEIC de 855 points**, et a des notions orales en arabe.";
  } else if (
    userMessage.includes('contact') ||
    userMessage.includes('cv') ||
    userMessage.includes('resume') ||
    userMessage.includes('mail') ||
    userMessage.includes('email') ||
    userMessage.includes('linkedin')
  ) {
    fallbackResponse = "Tu peux contacter Chadi via le formulaire de l'onglet **_contact** de ce portfolio, ou télécharger son CV complet depuis l'onglet **_resume** !";
  } else if (
    userMessage.includes('chadi') ||
    userMessage.includes('qui est') ||
    userMessage.includes('qui es-tu') ||
    userMessage.includes('présente') ||
    userMessage.includes('presente') ||
    userMessage.includes('bio')
  ) {
    fallbackResponse = "Chadi Abouhnaik est étudiant en Master Réseaux, Objets Connectés et IA au CNAM. Passionné d'infrastructures réseaux, d'automatisation et de cybersécurité, il recherche une alternance pour relever de grands défis techniques !";
  } else if (
    userMessage.includes('compétence') ||
    userMessage.includes('competence') ||
    userMessage.includes('skills') ||
    userMessage.includes('savoir faire')
  ) {
    fallbackResponse = "Les compétences clés de Chadi reposent sur 4 piliers : **Réseaux & Sécurité** (Cisco, VLAN, OSPF, VPN, firewalls), **Systèmes & Virtualisation** (Windows Server, Linux, VMware), **Automatisation & Dev** (Python, PowerShell, Bash, Docker) et **Supervision IT** (Grafana, Prometheus).";
  } else {
    fallbackResponse = "Je suis Goku, l'assistant de Chadi ! Je peux te renseigner sur ses **compétences réseaux**, son **développement** (Python, PowerShell, JS), son **stage chez JTEKT**, ses **projets académiques** (Sentinelle 4.0, monitoring), ses **certifications Cisco** ou sa recherche d'**alternance**. Que veux-tu savoir ?";
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

// Nettoyage des balises potentielles renvoyées par certains modèles
function cleanBotResponse(text) {
  if (!text) return '';
  return text
    .replace(/<s>/g, '')
    .replace(/<\/s>/g, '')
    .replace(/\[OUT\]/g, '')
    .replace(/\[\/OUT\]/g, '')
    .replace(/\[INST\]/g, '')
    .replace(/\[\/INST\]/g, '')
    .trim();
}

// Provider 1: Google Gemini (direct REST API, ultra-rapide < 2s, 1500 req/jour gratuites)
async function callGemini(systemPrompt, userMsg, apiKey, timeoutMs = 5500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const models = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nQuestion de l'utilisateur : ${userMsg}` }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 600,
          temperature: 0.7
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`⚠️ Gemini API (${model}) erreur HTTP ${response.status}:`, errText);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        clearTimeout(timeoutId);
        return text;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('⚠️ Gemini API timeout');
        break;
      }
      console.warn(`⚠️ Échec appel Gemini (${model}):`, err.message);
    }
  }

  clearTimeout(timeoutId);
  return null;
}

// Provider 2: OpenRouter (avec routeur openrouter/free et modèles de secours gratuits)
async function callOpenRouter(messages, apiKey, timeoutMs = 5500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://portfolio-nodejs.vercel.app',
        'X-Title': 'Portfolio Chadi'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        models: [
          'openrouter/free',
          'meta-llama/llama-3.3-70b-instruct:free',
          'qwen/qwen-2.5-coder-32b-instruct:free'
        ],
        messages,
        max_tokens: 500,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.warn('⚠️ OpenRouter API erreur HTTP', response.status, errText);
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || data.message?.content || data.content || null;
    return text || null;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('⚠️ OpenRouter API indisponible ou timeout:', err.message);
    return null;
  }
}

// Provider 3: Groq (ultra-rapide, Llama 3.3 70B si configuré)
async function callGroq(messages, apiKey, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 500,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.warn('⚠️ Groq API erreur HTTP', response.status, errText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('⚠️ Groq API indisponible ou timeout:', err.message);
    return null;
  }
}

app.post('/api/chatbot', rateLimit, async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Validation des données
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages invalides' });
    }
    
    // Validation de la taille des messages
    const totalLength = messages.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
    if (totalLength > 6000) {
      return res.status(400).json({ error: 'Message trop long' });
    }
    
    // Récupérer le dernier message utilisateur et l'instruction système
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const systemMsgObj = messages.find(m => m.role === 'system');
    const systemPrompt = systemMsgObj ? systemMsgObj.content : "Tu es Goku, l'assistant virtuel de Chadi Abouhnaik.";

    let botResponse = null;
    let source = 'local';

    // 1. Essai avec Google Gemini (rapide < 2s, 1500 req/jour gratuites)
    const geminiKey = getEnv('GEMINI_API_KEY');
    if (!botResponse && geminiKey) {
      console.log('🚀 Tentative d\'appel Google Gemini API...');
      botResponse = await callGemini(systemPrompt, lastUserMessage, geminiKey, 5500);
      if (botResponse) {
        source = 'gemini';
        console.log('✅ Réponse générée via Google Gemini');
      }
    }

    // 2. Essai avec Groq (ultra-rapide si configuré)
    const groqKey = getEnv('GROQ_API_KEY');
    if (!botResponse && groqKey) {
      console.log('🚀 Tentative d\'appel Groq API...');
      botResponse = await callGroq(messages, groqKey, 5000);
      if (botResponse) {
        source = 'groq';
        console.log('✅ Réponse générée via Groq');
      }
    }

    // 3. Essai avec OpenRouter (modèles gratuits openrouter/free)
    const openrouterKey = getEnv('OPENROUTER_API_KEY');
    if (!botResponse && openrouterKey) {
      console.log('🚀 Tentative d\'appel OpenRouter API...');
      botResponse = await callOpenRouter(messages, openrouterKey, 5500);
      if (botResponse) {
        source = 'openrouter';
        console.log('✅ Réponse générée via OpenRouter');
      }
    }

    // 4. Moteur de connaissances local infaillible (si aucune API n'a pu répondre)
    if (!botResponse || botResponse.trim() === '') {
      console.log('ℹ️ Utilisation du moteur de connaissances local (fallback infaillible)');
      botResponse = buildLocalFallback(lastUserMessage);
      source = 'local';
    } else {
      botResponse = cleanBotResponse(botResponse);
    }

    // Toujours renvoyer HTTP 200 avec une réponse valide
    return res.status(200).json({
      response: botResponse,
      source: source,
      success: true
    });
  } catch (err) {
    console.error('💥 Erreur inattendue chatbot route:', err);
    // Même en cas d'exception inattendue, ne jamais laisser le visiteur sans réponse
    const fallbackResponse = buildLocalFallback(req.body?.messages?.[req.body.messages.length - 1]?.content || '');
    return res.status(200).json({
      response: fallbackResponse,
      source: 'local_fallback',
      success: true
    });
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

// Démarrer le serveur seulement si exécuté directement (pas via import Vercel/tests)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}