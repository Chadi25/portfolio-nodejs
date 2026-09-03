// Base de connaissances de Chadi Abouhnaik
window.KNOWLEDGE_BASE = {
  personal: {
    name: "Chadi Abouhnaik",
    formation: "Master Réseaux, Objets Connectés et Intelligence Artificielle",
    previous_degree: "BUT Réseaux & Télécommunications",
    specialization: "Parcours IoM (Internet des Objets Mobilité)",
    university: "CNAM (2025–2027)",
    previous_university: "Université Marie et Louis Pasteur (2022–2025)",
    objective: "Évolution vers des infrastructures IT critiques à grande échelle",
    location: "France / Luxembourg (mobile)",
    languages: {
      french: "natif",
      english: "TOEIC 855 – niveau professionnel",
      arabic: "notions de base (oral)"
    }
  },
  
  technical_skills: {
    artificial_intelligence: {
      skills: [
        "RAG (Retrieval-Augmented Generation) industriel & souverain",
        "Déploiement LLMs locaux on-premise via Ollama (Llama 3, Mistral)",
        "Indexation vectorielle dense & recherche sémantique avec FAISS",
        "Recherche hybride & réordonnancement par Reciprocal Rank Fusion (RRF)",
        "LangChain, Embeddings vectoriels, pipelines d'ingestion de données",
        "Développement d'APIs REST en Python pour IA générative"
      ]
    },

    systems_security: {
      skills: [
        "Bastion Zero Trust Teleport CE (certificats éphémères mTLS/SSH, RBAC)",
        "Hardening Linux Debian 12 en production (chroot, ACLs POSIX)",
        "Contrôle d'accès réseau NAC 802.1X (EAP-TLS, NPS RADIUS, AD CS)",
        "Windows Server (Active Directory, DNS, DHCP, GPO, IIS, LDAPS)",
        "Linux avancé (Debian 12, Ubuntu, CentOS, Shell Bash)",
        "Virtualisation & Haute Disponibilité : VMware ESXi, Proxmox, Hyper-V",
        "Cloud platforms : Azure, AWS",
        "Plan de Reprise d'Activité (PRA) et maintien en condition opérationnelle (MCO)"
      ]
    },
    
    networks: {
      skills: [
        "Commutateurs Cisco 2960-X (24 switchs administrés et durcis)",
        "Segmentation dynamique des flux par VLANs (Bureautique, Industriel, IoT)",
        "Authentification 802.1X (C3PL / MAB / EAP-TLS)",
        "Cisco switching & routing (ACLs, OSPF, notions BGP)",
        "Tunnels VPN IPSec & Pare-feu (Cisco ASA, pfSense)",
        "Surveillance & analyse de trames (Suricata IDS, Wireshark)",
        "Protocoles industriels et d'infrastructure TCP/IP, DHCP, DNS"
      ],
      certifications: [
        "Cisco CCNA 1 – Routing & Switching",
        "Cisco CCNA 2 – Switching, Routing & Wireless Essentials", 
        "Cisco CCNA 3 – Enterprise Networking, Security & Automation",
        "Cisco IT Essentials (hardware/software basics)"
      ]
    },
    
    devops_automation: {
      skills: [
        "Suite de 12 scripts Python & Bash pour l'exploitation d'infrastructure",
        "Docker & conteneurisation d'applications / monitoring",
        "Kubernetes (pods, services, deployments)",
        "Ansible (playbooks de déploiement) & Terraform (IaC)",
        "PowerShell scripting (administration serveurs et Active Directory)",
        "Python scripting (APIs REST, RAG, automatisation, parsing XML)",
        "Git & GitLab CI/CD"
      ]
    },
    
    monitoring_itms: {
      skills: [
        "Grafana & Prometheus (tableaux de bord & alertes)",
        "InfluxDB (stockage time-series)",
        "Nagios & Zabbix (supervision réseau)",
        "GLPI ITSM (gestion de parc et incidents)"
      ]
    },
    
    programming: {
      languages: [
        "Python (GenAI, RAG, APIs REST, automatisation)",
        "Bash / Shell (scripts d'exploitation système Linux)",
        "PowerShell (administration Windows & AD)",
        "JavaScript (Node.js, Express, frontend)",
        "Java, C, SQL",
        "HTML5 / CSS3"
      ],
      tools: [
        "Git & GitLab",
        "Ollama, FAISS, LangChain",
        "Teleport CE",
        "Visual Studio Code",
        "Postman",
        "Docker"
      ]
    }
  },
  
  experiences: {
    stage_jtekt: {
      company: "JTEKT Column Systems France",
      location: "Mandeure (25)",
      period: "Février 2026 – Mai 2026",
      role: "Stagiaire Ingénieur Systèmes, Réseaux & IA",
      summary: "Sécurisation et maintien en condition opérationnelle (MCO) de l'infrastructure industrielle, déploiement d'un accès Zero Trust et conception d'un moteur de recherche documentaire IA (RAG) souverain.",
      metrics: {
        indexed_docs: "450+ documents industriels sensibles indexés",
        search_reduction: "40% de réduction du temps de recherche documentaire",
        sovereignty: "100% souverain on-premise (zéro fuite de données, sans cloud externe)",
        availability: "99,8% de disponibilité de l'infrastructure maintenue",
        auditability: "100% traçabilité et auditabilité des sessions d'administration",
        cisco_switches: "24 switchs Cisco 2960-X configurés en NAC 802.1X",
        scripts: "12 scripts Python et Bash développés pour l'exploitation"
      },
      projects: [
        {
          name: "Projet A — Moteur de Recherche Documentaire Hybride RAG (GenAI Industrielle)",
          problem: "Accéder instantanément à plus de 450 documentations techniques et rapports d'ingénierie complexes, avec contrainte absolue de souveraineté et confidentialité industrielle (interdiction d'API Cloud publiques).",
          solution: "Déploiement de LLM locaux on-premise via Ollama (Llama 3, Mistral), indexation vectorielle dense avec FAISS, pipeline hybride lexical/dense avec réordonnancement par Reciprocal Rank Fusion (RRF), et API REST en Python.",
          results: "450+ documents indexés, réduction de 40% du temps de recherche pour les ingénieurs, 100% souverain on-premise sans fuite de données.",
          technologies: ["RAG", "GenAI", "Ollama", "FAISS", "LangChain", "RRF", "Python REST API"]
        },
        {
          name: "Projet B — Bastion d'Accès Zero Trust & Durcissement Système",
          problem: "Remplacer les accès SSH directs et hétérogènes par un modèle d'accès unifié, auditable et conforme aux exigences de cybersécurité industrielle.",
          solution: "Déploiement du bastion d'accès Teleport (Zero Trust Access Plane) basé sur des certificats éphémères (mTLS/SSH), suppression des clés statiques, RBAC granulaire, enregistrement vidéo des sessions, et hardening de 15 serveurs Debian 12 en production (chroot, ACLs POSIX).",
          results: "99,8% de disponibilité maintenue, 100% d'auditabilité des sessions d'administration.",
          technologies: ["Zero Trust", "Teleport CE", "Debian 12", "Hardening", "mTLS", "RBAC", "ACLs POSIX"]
        },
        {
          name: "Projet C — Contrôle d'Accès Réseau NAC 802.1X & Automatisation",
          problem: "Sécurisation de la couche d'accès physique contre les intrusions et le spoofing MAC, avec segmentation dynamique des flux.",
          solution: "Déploiement de 802.1X (EAP-TLS / MAB) sur 24 switchs Cisco 2960-X avec serveur NPS RADIUS et AD CS pour le cloisonnement strict bureautique/industriel/IoT. Développement de 12 scripts Python et Bash d'automatisation d'exploitation.",
          results: "24 switchs Cisco 2960-X sécurisés, 12 scripts d'exploitation et d'hygiène IT opérationnels.",
          technologies: ["NAC 802.1X", "Cisco 2960-X", "VLANs", "NPS RADIUS", "Python", "Bash", "AD CS"]
        },
        {
          name: "Projet D — Infrastructure SFTP Sécurisée & Automatisation de Migration",
          problem: "Migration d'un ancien serveur FileZilla obsolète vers un environnement sécurisé et haute disponibilité.",
          solution: "Déploiement sur Debian 12 sécurisé, volume 1 To, chroots SFTP, ACLs POSIX, persistance systemd mount, parsing XML automatisé en Python et déploiement Bash.",
          results: "Migration 100% automatisée sans interruption de service.",
          technologies: ["Debian 12", "Python", "Bash", "SFTP", "systemd", "ACLs POSIX"]
        }
      ]
    },
    
    sentinelle_40: {
      title: "Sentinelle 4.0 (Plateforme Cyber IoT)",
      description: "Projet académique - Plateforme de simulation pour infrastructures IoT",
      technologies: ["Docker", "Kubernetes", "Grafana", "InfluxDB", "Suricata IDS"],
      achievements: [
        "Développement d'une plateforme de simulation pour infrastructures IoT",
        "Déploiement de conteneurs avec Docker & Kubernetes",
        "Implémentation du monitoring temps réel avec Grafana & InfluxDB",
        "Intégration de l'IDS Suricata pour la détection d'incidents",
        "Collaboration en équipe pour documenter et présenter les résultats"
      ]
    }
  },
  
  academic_projects: {
    monitoring_system: {
      title: "Système de monitoring réseau",
      description: "Développement d'un système de surveillance des équipements réseau",
      technologies: ["Python", "SNMP", "Monitoring"],
      duration: "3 mois"
    },
    
    discord_bot: {
      title: "Bot Discord pour l'école",
      description: "Bot Discord pour automatiser les tâches administratives",
      technologies: ["Python", "Discord API", "Bot"],
      duration: "2 mois"
    },
    
    portfolio_website: {
      title: "Site web portfolio",
      description: "Site web personnel pour présenter ses compétences",
      technologies: ["HTML/CSS", "JavaScript", "Node.js", "Express"],
      duration: "1 mois"
    },
    
    automation_scripts: {
      title: "Scripts d'automatisation",
      description: "Scripts PowerShell et Python pour automatiser les tâches",
      technologies: ["PowerShell", "Python", "Automatisation"],
      duration: "Ongoing"
    }
  },
  
  certifications: {
    cisco: [
      {
        name: "CCNA",
        status: "En cours",
        date: "2024-2025",
        description: "Cisco Certified Network Associate"
      },
      {
        name: "Cisco Networking Academy",
        status: "Obtenue",
        date: "2024",
        description: "Formation Cisco de base"
      }
    ],
    
    other: [
      {
        name: "Formation sécurité informatique",
        status: "Obtenue",
        date: "2024",
        description: "Formation en cybersécurité"
      }
    ]
  },
  
  languages: [
    "Français (Natif)",
    "Anglais (TOEIC 855 – niveau professionnel)",
    "Arabe (notions de base - oral)"
  ],
  
  soft_skills: [
    "Rigoureux & méthodique",
    "Curiosité & apprentissage rapide",
    "Résolution de problèmes & esprit analytique",
    "Proactivité & adaptabilité",
    "Travail d'équipe en contexte multi-sites, multi-profils",
    "Communication claire (capable d'expliquer des sujets techniques simplement)",
    "Compétences en documentation & reporting",
    "Esprit international – motivé par les environnements multiculturels"
  ],
  
  career_goals: [
    "Progresser en optimisation & administration de bases de données SQL Server",
    "Renforcer les compétences DevOps & automatisation (Terraform, Ansible, pipelines CI/CD)",
    "Acquérir une expertise en infrastructures cloud & hybrides (VMware, Azure, AWS)",
    "Développer une expertise cybersécurité appliquée à l'IoT, cloud & réseaux",
    "Contribuer à des infrastructures IT critiques à grande échelle",
    "Évoluer dans des environnements internationaux & multiculturels"
  ],
  
  keywords_for_job_market: [
    "SQL Server",
    "Windows Server",
    "Active Directory",
    "PowerShell",
    "Automatisation",
    "Terraform",
    "Ansible",
    "Docker",
    "Kubernetes",
    "VMware",
    "Cloud (Azure, AWS)",
    "Network Security",
    "Incident Response",
    "IoT Security",
    "GLPI ITSM",
    "Grafana",
    "Monitoring"
  ],
  
  interests: [
    "Réseaux et télécommunications",
    "Cybersécurité",
    "Automatisation",
    "Innovation technologique",
    "Gaming"
  ]
};

// Fonction pour récupérer les données des onglets
window.getTabData = function() {
  const tabData = {
    portfolio: [],
    certifications: [],
    skills: []
  };
  
  // Récupérer les projets du portfolio - sélecteurs plus génériques
  const portfolioItems = document.querySelectorAll('.portfolio-item, .project-card, .project, [class*="project"], [class*="portfolio"], .card, .item');
  portfolioItems.forEach(item => {
    const title = item.querySelector('.title, h3, h4, .name, [class*="title"], [class*="name"]')?.textContent?.trim();
    const description = item.querySelector('.description, p, .desc, [class*="desc"]')?.textContent?.trim();
    const technologies = Array.from(item.querySelectorAll('.tech, .technology, .tag, [class*="tech"], [class*="tag"]')).map(tag => tag.textContent.trim());
    
    if (title && title.length > 2) { // Éviter les titres trop courts
      tabData.portfolio.push({
        title: title,
        description: description || '',
        technologies: technologies
      });
    }
  });
  
  // Récupérer les certifications - sélecteurs plus génériques
  const certItems = document.querySelectorAll('.certification-item, .cert-card, .cert, [class*="cert"], .card, .item');
  certItems.forEach(item => {
    const name = item.querySelector('.name, h3, h4, .title, [class*="title"], [class*="name"]')?.textContent?.trim();
    const date = item.querySelector('.date, .year, [class*="date"], [class*="year"]')?.textContent?.trim();
    const description = item.querySelector('.description, p, .desc, [class*="desc"]')?.textContent?.trim();
    
    if (name && name.length > 2) { // Éviter les noms trop courts
      tabData.certifications.push({
        name: name,
        date: date || '',
        description: description || ''
      });
    }
  });
  
  // Récupérer les compétences - sélecteurs plus génériques
  const skillItems = document.querySelectorAll('.skill-item, .skill-card, .skill, [class*="skill"], .card, .item');
  skillItems.forEach(item => {
    const name = item.querySelector('.name, h3, h4, .title, [class*="title"], [class*="name"]')?.textContent?.trim();
    const level = item.querySelector('.level, .progress, [class*="level"], [class*="progress"]')?.textContent?.trim();
    
    if (name && name.length > 2) { // Éviter les noms trop courts
      tabData.skills.push({
        name: name,
        level: level || ''
      });
    }
  });
  
  // Debug: afficher ce qui a été trouvé
  console.log('📊 Données trouvées dans les onglets:', tabData);
  
  return tabData;
}; 