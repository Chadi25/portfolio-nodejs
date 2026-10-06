document.addEventListener('DOMContentLoaded', () => {
  // Éléments DOM
  const bubble = document.getElementById('chatbot-bubble');
  const widget = document.getElementById('chatbot-widget');
  const messagesDiv = document.getElementById('chatbot-messages');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const closeBtn = document.getElementById('chatbot-close');
  const minimizeBtn = document.getElementById('chatbot-minimize');
  const overlay = document.getElementById('chatbot-overlay');

  // Utiliser des variables globales pour la persistance
  window.welcomeMessageShown = window.welcomeMessageShown || false;
  window.messages = window.messages || [];
  let messages = window.messages;
  let isMinimized = false;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let welcomeMessageShown = window.welcomeMessageShown;

  // Fonction pour sauvegarder la position
  function savePosition(x, y) {
    localStorage.setItem('chatbotPosition', JSON.stringify({ x, y }));
  }

  // Fonction pour charger la position
  function loadPosition() {
    const saved = localStorage.getItem('chatbotPosition');
    if (saved) {
      const pos = JSON.parse(saved);
      
      // Vérifier si la position est raisonnable (dans l'écran)
      const maxX = window.innerWidth - 100; // 100px de marge
      const maxY = window.innerHeight - 100; // 100px de marge
      
      if (pos.x > maxX || pos.y > maxY || pos.x < 0 || pos.y < 0) {
        console.log('Position invalide détectée, réinitialisation...');
        // Position par défaut si la position sauvegardée est invalide
        bubble.style.left = 'auto';
        bubble.style.top = 'auto';
        bubble.style.bottom = '30px';
        bubble.style.right = '30px';
        // Supprimer la position invalide
        localStorage.removeItem('chatbotPosition');
      } else {
        // Utiliser la position sauvegardée
        bubble.style.left = pos.x + 'px';
        bubble.style.top = pos.y + 'px';
        bubble.style.bottom = 'auto';
        bubble.style.right = 'auto';
      }
    } else {
      // Position par défaut si aucune position sauvegardée
      bubble.style.left = 'auto';
      bubble.style.top = 'auto';
      bubble.style.bottom = '30px';
      bubble.style.right = '30px';
    }
  }

  // Fonction pour réinitialiser le flag d'accueil
  function resetWelcomeMessage() {
    welcomeMessageShown = false;
    messages = [];
    if (messagesDiv) {
      messagesDiv.innerHTML = '';
    }
    console.log('🔄 Message d\'accueil réinitialisé');
  }

  // Rendre les fonctions accessibles globalement
  window.resetWelcomeMessage = resetWelcomeMessage;
  window.cleanDuplicateMessages = cleanDuplicateMessages;
  window.resetPosition = resetPosition;

  // Fonction pour nettoyer les messages dupliqués
  function cleanDuplicateMessages() {
    const seenMessages = new Set();
    const uniqueMessages = [];
    
    messages.forEach(msg => {
      const messageKey = `${msg.role}-${msg.content}`;
      if (!seenMessages.has(messageKey)) {
        seenMessages.add(messageKey);
        uniqueMessages.push(msg);
      }
    });
    
    messages = uniqueMessages;
    
    // Vider et recharger les messages affichés
    if (messagesDiv) {
      messagesDiv.innerHTML = '';
      messages.forEach(msg => {
        addMessage(msg.role, msg.content);
      });
    }
  }

  // Fonction pour réinitialiser la position
  function resetPosition() {
    localStorage.removeItem('chatbotPosition');
    bubble.style.left = 'auto';
    bubble.style.top = 'auto';
    bubble.style.bottom = '30px';
    bubble.style.right = '30px';
    console.log('🔄 Position réinitialisée');
  }

  // Charger la position au démarrage
  loadPosition();

  // Debug simple
  console.log('Bulle Goku trouvée:', !!bubble);
  console.log('Widget trouvé:', !!widget);
  
  if (bubble) {
    console.log('Position initiale de la bulle:', bubble.style.bottom, bubble.style.right);
  }

  // Drag & Drop pour la bulle Goku
  if (bubble) {
    let startX, startY;
    let hasMoved = false;

    bubble.addEventListener('mousedown', (e) => {
      console.log('🖱️ Mousedown détecté sur Goku');
      // Permettre le drag sur toute la bulle, pas seulement l'image
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = bubble.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      bubble.style.cursor = 'grabbing';
      console.log('📍 Position de départ:', startX, startY);
      console.log('📍 Offset calculé:', dragOffset.x, dragOffset.y);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        console.log('🔄 Mousemove pendant drag');
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);
        
        // Si on a bougé de plus de 5px, considérer comme un drag
        if (deltaX > 5 || deltaY > 5) {
          hasMoved = true;
          console.log('✅ Drag confirmé');
        }
        
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // Limiter la position dans la fenêtre
        const maxX = window.innerWidth - bubble.offsetWidth;
        const maxY = window.innerHeight - bubble.offsetHeight;
        
        const finalX = Math.max(0, Math.min(x, maxX));
        const finalY = Math.max(0, Math.min(y, maxY));
        
        console.log('🎯 Nouvelle position calculée:', finalX, finalY);
        
        // Forcer la mise à jour visuelle
        bubble.style.transition = 'none';
        bubble.style.left = finalX + 'px';
        bubble.style.top = finalY + 'px';
        bubble.style.bottom = 'auto';
        bubble.style.right = 'auto';
        
        // Forcer le reflow
        bubble.offsetHeight;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        console.log('🖱️ Mouseup - Fin du drag');
        isDragging = false;
        bubble.style.cursor = 'pointer';
        
        // Restaurer la transition
        bubble.style.transition = 'all 0.3s ease';
        
        // Sauvegarder la position seulement si on a vraiment bougé
        if (hasMoved) {
          const rect = bubble.getBoundingClientRect();
          savePosition(rect.left, rect.top);
          console.log('💾 Position sauvegardée:', rect.left, rect.top);
        }
      }
    });

    // Support des événements touch pour mobile avec gestion du clic
    let touchStartTime = 0;
    let touchMoved = false;
    let touchStartPos = { x: 0, y: 0 };
    
    bubble.addEventListener('touchstart', (e) => {
      console.log('📱 Touchstart détecté sur Goku');
      touchStartTime = Date.now();
      touchMoved = false;
      isDragging = true;
      hasMoved = false;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      touchStartPos = { x: touch.clientX, y: touch.clientY };
      
      const rect = bubble.getBoundingClientRect();
      dragOffset.x = touch.clientX - rect.left;
      dragOffset.y = touch.clientY - rect.top;
      console.log('📍 Position de départ touch:', startX, startY);
      
      // Empêcher la propagation vers les autres gestionnaires d'événements
      e.stopPropagation();
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPos.x);
        const deltaY = Math.abs(touch.clientY - touchStartPos.y);
        
        // Si on a bougé de plus de 15px, considérer comme un drag
        if (deltaX > 15 || deltaY > 15) {
          touchMoved = true;
          hasMoved = true;
          console.log('✅ Drag touch confirmé');
          
          const x = touch.clientX - dragOffset.x;
          const y = touch.clientY - dragOffset.y;
          
          // Limiter la position dans la fenêtre
          const maxX = window.innerWidth - bubble.offsetWidth;
          const maxY = window.innerHeight - bubble.offsetHeight;
          
          const finalX = Math.max(0, Math.min(x, maxX));
          const finalY = Math.max(0, Math.min(y, maxY));
          
          console.log('🎯 Nouvelle position touch calculée:', finalX, finalY);
          
          // Forcer la mise à jour visuelle
          bubble.style.transition = 'none';
          bubble.style.left = finalX + 'px';
          bubble.style.top = finalY + 'px';
          bubble.style.bottom = 'auto';
          bubble.style.right = 'auto';
          
          // Forcer le reflow
          bubble.offsetHeight;
        }
        
        // Empêcher le scroll de la page et la propagation pendant le drag
        e.stopPropagation();
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      if (isDragging) {
        console.log('📱 Touchend - Fin du touch');
        isDragging = false;
        
        const touchDuration = Date.now() - touchStartTime;
        
        // Si c'était un tap court (< 300ms) et pas de mouvement, ouvrir le chatbot
        if (touchDuration < 300 && !touchMoved) {
          console.log('👆 Tap détecté - Ouverture du chatbot');
          openChatbot();
        } else if (touchMoved) {
          // Si c'était un drag, sauvegarder la position
          console.log('📱 Drag terminé - Sauvegarde position');
          bubble.style.transition = 'all 0.3s ease';
          
          const rect = bubble.getBoundingClientRect();
          savePosition(rect.left, rect.top);
          console.log('💾 Position touch sauvegardée:', rect.left, rect.top);
        }
        
        // Reset des variables
        touchMoved = false;
        hasMoved = false;
        
        // Empêcher la propagation
        e.stopPropagation();
      }
    }, { passive: true });

    // Clic pour desktop (fallback)
    bubble.addEventListener('click', (e) => {
      // Seulement si pas de touch récent (pour éviter double déclenchement)
      if (!touchMoved && !isDragging) {
        console.log('🖱️ Clic desktop détecté');
        openChatbot();
      }
    });
  }

  // Fonction pour ajouter un message
  function addMessage(role, content) {
    console.log('📝 addMessage appelé avec:', { role, content: content?.substring(0, 100) });
    
    // Vérifier que le contenu n'est pas vide
    if (!content || content.trim() === '') {
      console.error('❌ Contenu vide détecté pour le rôle:', role);
      // Utiliser un fallback intelligent selon le rôle
      if (role === 'assistant') {
        content = 'Désolé, je n\'ai pas pu traiter ta question. Mais je peux te parler des compétences de Chadi en réseaux, programmation, son stage chez JTEKT, ses projets ou ses certifications Cisco. Que veux-tu savoir ?';
      } else {
        content = 'Erreur: message vide';
      }
    }
    
    const msg = document.createElement('div');
    msg.className = `chatbot-msg ${role}`;

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'chatbot-avatar';

    if (role === 'assistant') {
      const img = document.createElement('img');
      img.src = '/images/goku.gif';
      img.alt = 'Goku';
      avatar.appendChild(img);
    } else {
      avatar.textContent = 'U';
    }

    // Contenu du message
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-msg-content';
    bubble.innerHTML = content;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesDiv.appendChild(msg);
    
    console.log('✅ Message ajouté avec succès:', content.substring(0, 50) + '...');
    
    // Auto-scroll vers le bas avec animation fluide
    scrollToBottom();
  }

  // Fonction pour scroller vers le bas de manière fluide
  function scrollToBottom() {
    if (messagesDiv) {
      // Utiliser requestAnimationFrame pour une animation fluide
      requestAnimationFrame(() => {
        messagesDiv.scrollTo({
          top: messagesDiv.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }

  // Fonction pour nettoyer le markdown et les balises du modèle
  function markdownToHtml(text) {
    return text
      // Nettoyer les balises de formatage du modèle
      .replace(/<s>/g, '')
      .replace(/<\/s>/g, '')
      .replace(/\[OUT\]/g, '')
      .replace(/\[\/OUT\]/g, '')
      .replace(/\[INST\]/g, '')
      .replace(/\[\/INST\]/g, '')
      // Nettoyer les espaces multiples
      .replace(/\s+/g, ' ')
      .trim()
      // Convertir le markdown
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  // Ouvrir le chatbot
  function openChatbot() {
    console.log('🔍 openChatbot appelé');
    console.log('📊 messages.length:', messages.length);
    console.log('🏁 welcomeMessageShown:', welcomeMessageShown);
    
    widget.classList.add('open');
    document.body.classList.add('chatbot-open'); // Ajouter classe pour bloquer navigation
    bubble.style.display = 'none';
    
    // Message d'accueil prédéfini (économie de crédits IA)
    // Vérifier si le message d'accueil a déjà été affiché
    if (messages.length === 0 && !welcomeMessageShown) {
      console.log('✅ Affichage du message d\'accueil');
      const welcomeMessage = `Salut ! Je suis Goku, le bot de Chadi Abouhnaik ! 😊<br><br>
      Chadi est élève-ingénieur en <strong>Master 2 Réseaux, Objets Connectés et IA au CNAM</strong> (2025–2027), fort de son expérience d'ingénieur stagiaire chez <strong>JTEKT</strong> (RAG souverain, Bastion Zero Trust, NAC Cisco 802.1X). Il recherche activement une <strong>alternance pour septembre 2026</strong> (Master 2) en France ou au Luxembourg !<br><br>
      Je peux te parler de ses <strong>réalisations chez JTEKT</strong>, de ses <strong>compétences techniques</strong> (IA, Zero Trust, réseaux Cisco, automatisation Python/Bash), de ses <strong>projets</strong> ou de ses <strong>certifications Cisco</strong>.<br><br>
      Pose-moi tes questions sur Chadi ! 🚀`;
      
      addMessage('assistant', welcomeMessage);
      
      // Ajouter le message d'accueil à l'historique
      messages.push({
        role: 'assistant',
        content: 'Salut ! Je suis Goku, le bot de Chadi Abouhnaik ! Chadi est élève-ingénieur en Master 2 Réseaux, Objets Connectés et IA au CNAM (2025–2027), fort de son expérience chez JTEKT (RAG souverain, Zero Trust, NAC Cisco). Il recherche activement une alternance pour septembre 2026 en France ou au Luxembourg. Pose-moi tes questions sur Chadi !'
      });
      
      // Marquer comme affiché
      welcomeMessageShown = true;
      window.welcomeMessageShown = true;
      window.messages = messages;
      console.log('✅ Message d\'accueil marqué comme affiché');
    } else {
      console.log('❌ Message d\'accueil non affiché - messages.length:', messages.length, 'welcomeMessageShown:', welcomeMessageShown);
    }
  }

  // Fermer le chatbot
  if (closeBtn && widget && bubble) {
    closeBtn.addEventListener('click', () => {
      widget.classList.remove('open');
      widget.classList.remove('minimized');
      document.body.classList.remove('chatbot-open'); // Retirer classe pour réactiver navigation
      isMinimized = false;
      bubble.style.display = 'flex';
      // Reset le bouton minimize
      if (minimizeBtn) {
        minimizeBtn.textContent = '−';
        minimizeBtn.title = 'Réduire';
      }
    });
  }

  // Réduire/Agrandir le chatbot
  if (minimizeBtn && widget) {
    minimizeBtn.addEventListener('click', () => {
      if (isMinimized) {
        // Agrandir
        widget.classList.remove('minimized');
        document.body.classList.add('chatbot-open'); // Réactiver blocage navigation
        minimizeBtn.textContent = '−';
        minimizeBtn.title = 'Réduire';
        // Remettre la bulle en position normale
        if (bubble) {
          // Si on a une position sauvegardée, l'utiliser
          const saved = localStorage.getItem('chatbotPosition');
          if (saved) {
            const pos = JSON.parse(saved);
            bubble.style.left = pos.x + 'px';
            bubble.style.top = pos.y + 'px';
            bubble.style.bottom = 'auto';
            bubble.style.right = 'auto';
          } else {
            // Sinon, position par défaut
            bubble.style.left = 'auto';
            bubble.style.top = 'auto';
            bubble.style.bottom = '30px';
            bubble.style.right = '30px';
          }
        }
      } else {
        // Réduire
        widget.classList.add('minimized');
        document.body.classList.remove('chatbot-open'); // Désactiver blocage navigation
        minimizeBtn.textContent = '+';
        minimizeBtn.title = 'Agrandir';
        // Déplacer la bulle pour éviter la superposition
        if (bubble) {
          bubble.style.bottom = '120px';
          bubble.style.right = '30px';
        }
      }
      isMinimized = !isMinimized;
    });
  }

  // Gestion du formulaire
  if (form && input && messagesDiv) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
      
    const userMsg = input.value.trim();
    if (!userMsg) return;
    
    console.log('📝 Nouveau message utilisateur:', userMsg);
    console.log('📊 Messages actuels:', messages.length);

      // Ajouter le message utilisateur
    addMessage('user', userMsg);
    messages.push({ role: 'user', content: userMsg });
    input.value = '';

      // Message de chargement
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chatbot-msg assistant loading';
      loadingMsg.innerHTML = `
        <div class="chatbot-avatar">
          <img src="/images/goku.gif" alt="Goku" />
        </div>
        <div class="chatbot-msg-content">Goku réfléchit...</div>
      `;
      messagesDiv.appendChild(loadingMsg);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      // Vérifier si c'est une salutation simple
      const isSimpleGreeting = /^(salut|bonjour|hello|hi|hey|ça va|ca va|comment ça va|comment ca va)$/i.test(userMsg.trim());
      
      if (isSimpleGreeting) {
        // Réponse directe pour les salutations
        setTimeout(() => {
          loadingMsg.remove();
          const greetingResponse = "Salut ! Ça va bien ! Que veux-tu savoir sur Chadi ?";
          addMessage('assistant', greetingResponse);
          messages.push({ role: 'assistant', content: greetingResponse });
        }, 500);
        return;
      }

      try {
        // Préparer le contexte avec les informations de Chadi
        let contextPrompt = "";
        if (window.KNOWLEDGE_BASE) {
          // Récupérer les données des onglets
          const tabData = window.getTabData ? window.getTabData() : { portfolio: [], certifications: [], skills: [] };
          
          // Construire le contexte avec les données des onglets
          let portfolioInfo = '';
          if (tabData.portfolio.length > 0) {
            portfolioInfo = `PROJETS PORTFOLIO ACTUELS :\n${tabData.portfolio.map(p => `- ${p.title} : ${p.description} (${p.technologies.join(', ')})`).join('\n')}`;
          }
          
          let certInfo = '';
          if (tabData.certifications.length > 0) {
            certInfo = `CERTIFICATIONS ACTUELLES :\n${tabData.certifications.map(c => `- ${c.name} (${c.date}) : ${c.description}`).join('\n')}`;
          }
          
          let skillsInfo = '';
          if (tabData.skills.length > 0) {
            skillsInfo = `COMPÉTENCES ACTUELLES :\n${tabData.skills.map(s => `- ${s.name}${s.level ? ` (${s.level})` : ''}`).join('\n')}`;
          }
          
          contextPrompt = `
Tu es Goku, l'assistant et compagnon de Chadi Abouhnaik sur son portfolio personnel !
Tu as la personnalité chaleureuse, dynamique, enthousiaste et motivante de Son Goku !
Tu parles de Chadi avec fierté et énergie à la troisième personne ("Chadi a fait...", "Il maîtrise...", "Chadi est...").

Voici les informations complètes et à jour sur Chadi (2026) :

FORMATION : ${KNOWLEDGE_BASE.personal.formation} (${KNOWLEDGE_BASE.personal.university})
OBJECTIF : ${KNOWLEDGE_BASE.personal.objective}
RECHERCHE : Alternance pour septembre 2026 (Master 2) en ingénierie réseaux, cybersécurité Zero Trust, IA industrielle (RAG) ou systèmes/cloud (mobile France / Luxembourg).

EXPÉRIENCE MAJEURE 2026 :
Stagiaire Ingénieur Systèmes, Réseaux & IA chez JTEKT Column Systems France (Mandeure, 25) - Février à Mai 2026.
Projets & Réalisations clés :
1. Moteur de Recherche Documentaire Hybride RAG (GenAI Industrielle) :
   - Problématique : Accès instantané à 450+ documentations techniques d'ingénierie sous stricte contrainte de souveraineté industrielle (zéro fuite de données, interdiction d'APIs cloud publiques).
   - Solution : Déploiement de LLMs locaux via Ollama (Llama 3, Mistral), indexation vectorielle dense avec FAISS, recherche hybride avec réordonnancement par Reciprocal Rank Fusion (RRF), interface & scripts d'ingestion en Python via API REST.
   - Impact : 450+ documents sensibles indexés, -40% sur le temps de recherche d'informations critiques, 100% souverain on-premise.
2. Bastion d'Accès Zero Trust Teleport & Hardening Système :
   - Solution : Bastion Teleport (Zero Trust Access Plane) à certificats éphémères (mTLS/SSH), suppression des clés statiques, RBAC granulaire, enregistrement vidéo des sessions d'administration.
   - Hardening : Durcissement de 15 serveurs Debian 12 en production industrielle (environnements chrootés, ACLs POSIX, suppression des vecteurs d'attaque).
   - Impact : 99,8% de disponibilité maintenue, 100% de traçabilité des sessions.
3. Contrôle d'Accès Réseau NAC 802.1X & Automatisation :
   - Déploiement de 802.1X (EAP-TLS / NPS RADIUS) sur 24 switchs Cisco 2960-X pour la segmentation dynamique des flux (Bureautique, Industriel, IoT).
   - Développement d'une suite de 12 scripts Python et Bash pour automatiser l'exploitation d'infrastructure et les audits.

AUTRES PROJETS :
- Sentinelle 4.0 : Plateforme de cybersécurité IoT avec sonde Suricata IDS et monitoring temps réel.
- Monitoring complet : Prometheus, Grafana, InfluxDB.
- Infrastructure SFTP sécurisée : Migration automatisée, chroots, ACLs POSIX sous Debian 12.

CERTIFICATIONS CISCO : ${(KNOWLEDGE_BASE.technical_skills.networks.certifications || []).join(', ')}

${portfolioInfo ? '\n' + portfolioInfo : ''}
${certInfo ? '\n' + certInfo : ''}
${skillsInfo ? '\n' + skillsInfo : ''}

RÈGLES DE RÉPONSE :
- Réponds de manière vivante, positive, fière et bien structurée (avec des puces ou paragraphes aérés).
- Ne répète JAMAIS d'intro robotique mécanique.
- Mets en valeur l'impact opérationnel et les chiffres clés de son expérience JTEKT (450+ docs, -40% temps, 15 serveurs durcis, 99.8% dispo, 24 switchs Cisco 802.1X, 12 scripts Python/Bash).
- Reste techniquement précis tout en gardant l'esprit héroïque et enthousiaste de Goku !

Question de l'utilisateur : ${userMsg}
`;
        } else {
          contextPrompt = `Tu es Goku, le bot enthousiaste de Chadi Abouhnaik ! Chadi est étudiant en Master 2 Réseaux, IoT et IA au CNAM, à la recherche d'une alternance pour septembre 2026. Réponds de manière dynamique et professionnelle. Question: ${userMsg}`;
        }

        // Timeout côté client de 25 secondes (pour laisser le temps à Vercel + OpenRouter)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        
        const response = await fetch('/api/chatbot', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: contextPrompt
              },
              {
                role: 'user',
                content: userMsg
              }
            ]
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        let data = {};
        try {
          data = await response.json();
        } catch (_) {
          data = {};
        }

        console.log('📡 Réponse reçue du serveur:', data);

        let botResponse = data.response || data.choices?.[0]?.message?.content || data.message || data.content;

        function buildFrontendFallback(text) {
          const u = (text || '').toLowerCase().trim();
          if (u.match(/^(salut|bonjour|bonsoir|hello|hi|hey|coucou|yo|ça va|ca va)[\s!?]*$/i)) {
            return "Salut ! Ça va très bien ! Je suis Goku, l'assistant virtuel de Chadi. Que veux-tu savoir sur son parcours, ses compétences ou ses projets chez JTEKT ?";
          } else if (u.includes('qui est') || u.includes('qui es-tu') || u.includes('présente') || u.includes('presente') || u.includes('chadi') || u.includes('bio')) {
            return "Chadi Abouhnaik est élève-ingénieur en **Master 2 Réseaux, Objets Connectés et IA au CNAM** (2025–2027), après un BUT Réseaux & Télécoms ! Fort de son expérience chez **JTEKT Column Systems** en **GenAI industrielle (RAG)**, **Zero Trust (Teleport)** et **sécurité réseau (NAC 802.1X, Cisco)**, il recherche activement une **alternance pour septembre 2026** (Master 2) en France ou au Luxembourg !";
          } else if (u.includes('jtekt') || u.includes('stage')) {
            return "Durant son expérience d'ingénieur stagiaire chez **JTEKT Column Systems France** (Février–Mai 2026), Chadi a mené 3 réalisations techniques majeures :\n\n- 🤖 **Moteur RAG Hybride Souverain** : Déploiement de LLMs locaux on-premise (Ollama Llama 3/Mistral, FAISS, RRF) pour indexer **450+ documentations techniques sensibles**, réduisant de **40%** le temps de recherche avec 100% de souveraineté on-premise.\n- 🛡️ **Bastion Zero Trust & Hardening** : Déploiement de **Teleport** (certificats éphémères mTLS/SSH, RBAC, vidéo des sessions) et durcissement de **15 serveurs Linux Debian 12** en production (chroot, ACLs POSIX) avec **99,8%** de disponibilité.\n- 🔌 **NAC 802.1X & Automatisation** : Déploiement 802.1X sur **24 commutateurs Cisco 2960-X** (segmentation dynamique) et suite de **12 scripts Python/Bash** d'exploitation d'infrastructure.";
          } else if (u.includes('rag') || u.includes('ia') || u.includes('ollama') || u.includes('faiss') || u.includes('intelligence')) {
            return "En GenAI industrielle, Chadi maîtrise la conception de pipelines **RAG (Retrieval-Augmented Generation)** 100% souverains :\n\n- Déploiement de LLMs locaux via **Ollama** (Llama 3, Mistral) sans fuite de données vers des clouds publics.\n- Indexation vectorielle dense et recherche sémantique via **FAISS** sur **450+ documents techniques**.\n- Recherche hybride combinant recherche lexicale et dense avec réordonnancement par **Reciprocal Rank Fusion (RRF)**.\n- Développement d'APIs REST et scripts d'ingestion en **Python**.";
          } else if (u.includes('zero trust') || u.includes('teleport') || u.includes('bastion') || u.includes('hardening')) {
            return "En architecture **Zero Trust & Hardening**, Chadi a déployé chez JTEKT le bastion **Teleport** :\n\n- Authentification basée sur des certificats éphémères (mTLS / SSH) sans clés statiques partagées.\n- Contrôle d'accès granulaire basé sur les rôles (**RBAC**) et enregistrement vidéo à **100%** des sessions d'administration.\n- Durcissement de **15 serveurs Linux Debian 12** en production (isolation chroot, gestion fine des ACLs POSIX et fermeture des vecteurs d'attaque).";
          } else if (u.includes('sait faire') || u.includes('faire quoi') || u.includes('compétence') || u.includes('competence') || u.includes('skills') || u.includes('savoir faire')) {
            return "Chadi possède un profil technique complet axé sur l'impact opérationnel :\n\n- 🤖 **Intelligence Artificielle & GenAI** : Moteurs RAG souverains (Ollama, FAISS, RRF, Python REST APIs).\n- 🛡️ **Cybersécurité & Zero Trust** : Bastion Teleport CE (mTLS/SSH), durcissement Linux Debian 12 (chroot, ACLs POSIX).\n- 🔌 **Réseaux Industriels** : NAC 802.1X sur 24 switchs Cisco 2960-X, segmentation dynamique VLANs, VPN IPSec, firewalls, CCNA 1, 2, 3.\n- ⚙️ **Automatisation & DevOps** : Suite de 12 scripts Python/Bash, PowerShell, Docker, monitoring Prometheus/Grafana.";
          } else if (u.includes('réseau') || u.includes('cisco') || u.includes('switch') || u.includes('vlan') || u.includes('802.1x')) {
            return "Chadi maîtrise les **réseaux et la sécurité** : déploiement du contrôle d'accès **NAC 802.1X** sur **24 switchs Cisco 2960-X**, **VLANs**, routage dynamique (**OSPF**), **VPN IPSec**, pare-feu (**pfSense**, Cisco ASA) et analyse avec **Wireshark**. Il a validé les modules **CCNA 1, 2 et 3** !";
          } else if (u.includes('programm') || u.includes('code') || u.includes('dev') || u.includes('python')) {
            return "Chadi programme principalement en **Python** (RAG, FAISS, APIs REST, 12 scripts d'exploitation), **JavaScript (Node.js)**, **PowerShell** et **Bash**. Il conçoit des scripts d'automatisation d'infrastructure, des bots et des services web.";
          } else if (u.includes('alternance') || u.includes('recrut') || u.includes('embauche')) {
            return "Chadi recherche activement une **alternance pour septembre 2026** dans le cadre de son **Master 2 au CNAM** (Réseaux, IoT et IA). Il est mobile en France et au Luxembourg !";
          } else if (u.includes('certif') || u.includes('ccna')) {
            return "Chadi est issu de la **Cisco Networking Academy** : il a validé **CCNA 1**, **CCNA 2**, **CCNA 3** ainsi que **Cisco IT Essentials**, et prépare l'examen CCNA officiel.";
          }
          return "Je suis Goku, l'assistant de Chadi ! Je peux te parler en détail de son **moteur RAG souverain**, de son **bastion Zero Trust Teleport**, de son déploiement **NAC 802.1X Cisco**, de ses compétences ou de son **Master au CNAM**. Que souhaites-tu découvrir ?";
        }

        // Si la réponse est vide, secours local intelligent
        if (!botResponse || typeof botResponse !== 'string' || botResponse.trim() === '') {
          console.warn('⚠️ Réponse vide du serveur, utilisation du fallback local');
          botResponse = buildFrontendFallback(userMsg);
        }

        loadingMsg.remove();
        addMessage('assistant', markdownToHtml(botResponse));
        messages.push({ role: 'assistant', content: botResponse });
        console.log('✅ Message assistant affiché avec succès');

      } catch (error) {
        console.error('❌ Erreur lors de l\'échange avec le chatbot:', error);
        loadingMsg.remove();
        
        const fallbackResponse = buildFrontendFallback(userMsg);
        addMessage('assistant', markdownToHtml(fallbackResponse));
        messages.push({ role: 'assistant', content: fallbackResponse });
      }
    });
  }

  // Focus sur l'input quand le chat s'ouvre
  if (widget && input) {
      const observer = new MutationObserver(() => {
        if (widget.classList.contains('open')) {
        setTimeout(() => input.focus(), 300);
        }
      });
      observer.observe(widget, { attributes: true, attributeFilter: ['class'] });
    }

  // Gestion des touches clavier
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });
  }

  console.log('Chatbot moderne et mobile chargé ! 🚀');
}); 