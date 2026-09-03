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
      .replace(/\[/g, '')
      .replace(/\]/g, '')
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
      Chadi est un étudiant en <strong>BUT Réseaux & Télécommunications</strong> (Parcours IoM) à la recherche d'une <strong>alternance pour septembre 2025</strong>.<br><br>
      Je peux te parler de ses <strong>compétences techniques</strong> (réseaux, programmation, outils), de son <strong>stage chez JTEKT</strong>, de ses <strong>projets académiques</strong>, ou de ses <strong>certifications Cisco</strong>.<br><br>
      Pose-moi tes questions sur Chadi ! 🚀`;
      
      addMessage('assistant', welcomeMessage);
      
      // Ajouter le message d'accueil à l'historique
      messages.push({
        role: 'assistant',
        content: 'Salut ! Je suis Goku, le bot de Chadi Abouhnaik ! Chadi est un étudiant en BUT Réseaux & Télécommunications (Parcours IoM) à la recherche d\'une alternance pour septembre 2025. Je peux te parler de ses compétences techniques, de son stage chez JTEKT, de ses projets académiques, ou de ses certifications Cisco. Pose-moi tes questions sur Chadi !'
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
Tu es Goku, le bot de Chadi Abouhnaik. Tu dois TOUJOURS parler de Chadi à la troisième personne (il/elle), jamais à la première personne (je).

Voici les informations sur Chadi :

FORMATION : ${KNOWLEDGE_BASE.personal.formation} - ${KNOWLEDGE_BASE.personal.specialization}
OBJECTIF : ${KNOWLEDGE_BASE.personal.objective}
UNIVERSITÉ : ${KNOWLEDGE_BASE.personal.university}

COMPÉTENCES RÉSEAUX : ${(KNOWLEDGE_BASE.technical_skills.networks.skills || []).join(', ')}
COMPÉTENCES PROGRAMMATION : ${(KNOWLEDGE_BASE.technical_skills.programming.languages || []).join(', ')}

STAGE JTEKT (${KNOWLEDGE_BASE.experiences.stage_jtekt.duration}) :
${(KNOWLEDGE_BASE.experiences.stage_jtekt.projects || []).map(p => `- ${p.name} : ${p.description} (${(p.technologies || []).join(', ')})`).join('\n')}

PROJETS ACADÉMIQUES :
${Object.values(KNOWLEDGE_BASE.academic_projects || {}).map(p => `- ${p.title} : ${p.description} (${(p.technologies || []).join(', ')})`).join('\n')}

CERTIFICATIONS CISCO : ${(KNOWLEDGE_BASE.certifications.cisco || []).map(c => `${c.name} (${c.date})`).join(', ')}

${portfolioInfo ? '\n' + portfolioInfo : ''}
${certInfo ? '\n' + certInfo : ''}
${skillsInfo ? '\n' + skillsInfo : ''}

IMPORTANT : Tu es Goku, le bot de Chadi. Tu parles TOUJOURS de Chadi à la troisième personne. Tu dis "Chadi a", "Il maîtrise", "Il a fait", etc. JAMAIS "J'ai" ou "Je maîtrise".

RÈGLES DE RÉPONSE :
- Sois CONCIS et adapte ta réponse à la question
- Pour une salutation simple, réponds UNIQUEMENT "Salut ! Ça va bien ! Que veux-tu savoir sur Chadi ?"
- Pour une question spécifique, donne une réponse courte et précise (max 2-3 phrases)
- Évite les pavés inutiles, va droit au but
- N'énumère PAS toutes les compétences sauf si on te le demande spécifiquement
- Utilise les données des onglets si elles sont disponibles pour être plus précis

Réponds de manière naturelle et technique, en utilisant ces informations pour être précis. Question de l'utilisateur : ${userMsg}
`;
        } else {
          contextPrompt = `Tu es Goku, le bot de Chadi Abouhnaik. Chadi est étudiant en BUT Réseaux & Télécommunications, recherche alternance septembre 2025. Réponds de manière technique et professionnelle. Question: ${userMsg}`;
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

        // Si la réponse est vide, secours local immédiat
        if (!botResponse || typeof botResponse !== 'string' || botResponse.trim() === '') {
          console.warn('⚠️ Réponse vide du serveur, utilisation du fallback local');
          botResponse = "Je suis Goku, l'assistant virtuel de Chadi ! Je peux te renseigner sur ses **compétences réseaux & Cisco**, sa **programmation** (Python, PowerShell, JS), son **stage chez JTEKT**, ses **projets académiques** (Sentinelle 4.0, monitoring) ou sa recherche d'**alternance**. Que souhaites-tu savoir ?";
        }

        loadingMsg.remove();
        addMessage('assistant', markdownToHtml(botResponse));
        messages.push({ role: 'assistant', content: botResponse });
        console.log('✅ Message assistant affiché avec succès');

      } catch (error) {
        console.error('❌ Erreur lors de l\'échange avec le chatbot:', error);
        loadingMsg.remove();
        
        // Réponse intelligente locale adaptée à la question même en cas de coupure réseau
        let fallbackResponse = '';
        const userMsgLower = userMsg.toLowerCase();

        if (userMsgLower.match(/^(salut|bonjour|bonsoir|hello|hi|hey|coucou|yo|ça va|ca va)[\s!?]*$/i)) {
          fallbackResponse = "Salut ! Ça va très bien ! Je suis Goku, l'assistant de Chadi. Que veux-tu savoir sur son parcours ou ses projets ?";
        } else if (userMsgLower.includes('réseau') || userMsgLower.includes('cisco') || userMsgLower.includes('switch') || userMsgLower.includes('vlan')) {
          fallbackResponse = "Chadi maîtrise les **réseaux et la sécurité** : configuration de switchs/routeurs **Cisco**, **VLAN**, routage dynamique (**OSPF**), **VPN IPSec**, pare-feu (**pfSense**, Cisco ASA) et analyse avec **Wireshark**. Il a validé les modules **CCNA 1, 2 et 3** !";
        } else if (userMsgLower.includes('programm') || userMsgLower.includes('code') || userMsgLower.includes('dev') || userMsgLower.includes('python')) {
          fallbackResponse = "Chadi programme principalement en **Python**, **JavaScript (Node.js)**, **PowerShell** et **Bash**. Il conçoit des scripts d'automatisation d'infrastructure, des bots et des services web.";
        } else if (userMsgLower.includes('jtekt') || userMsgLower.includes('stage')) {
          fallbackResponse = "Lors de son **stage de 3 mois chez JTEKT**, Chadi a déployé un serveur **SFTP sécurisé**, participé au **Plan de Reprise d'Activité (PRA)**, et automatisé des tâches d'administration système avec **PowerShell**.";
        } else if (userMsgLower.includes('alternance') || userMsgLower.includes('recrut') || userMsgLower.includes('embauche')) {
          fallbackResponse = "Chadi recherche activement une **alternance dès septembre 2025** dans le cadre de son **Master au CNAM** (Réseaux, IoT et IA). Il est mobile en France et au Luxembourg !";
        } else if (userMsgLower.includes('certif') || userMsgLower.includes('ccna')) {
          fallbackResponse = "Chadi est issu de la **Cisco Networking Academy** : il a validé **CCNA 1**, **CCNA 2**, **CCNA 3** ainsi que **Cisco IT Essentials**, et prépare l'examen CCNA officiel.";
        } else {
          fallbackResponse = "Je suis Goku, l'assistant de Chadi ! Je peux te parler de ses **compétences en réseaux**, de son **développement**, de son **stage chez JTEKT**, de ses **projets** (Sentinelle 4.0) ou de son **Master au CNAM**. Que souhaites-tu découvrir ?";
        }
        
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