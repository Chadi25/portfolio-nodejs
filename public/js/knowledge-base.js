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
    systems: {
      skills: [
        "Windows Server (AD, DNS, DHCP, GPO, IIS)",
        "Linux (Debian, Ubuntu, CentOS, shell scripting Bash)",
        "Virtualization: VMware ESXi, Proxmox, Hyper-V",
        "Cloud platforms: Azure (VMs, IAM, storage), AWS (EC2, S3, IAM)"
      ]
    },
    
    networks: {
      skills: [
        "VLAN configuration, inter-VLAN routing",
        "Cisco switching & routing (ACL, OSPF, BGP basics)",
        "VPN IPSec configuration",
        "Firewall administration (Cisco ASA, pfSense)",
        "Network monitoring & IDS (Suricata, Wireshark)",
        "Protocoles TCP/IP, DHCP, DNS"
      ],
      certifications: [
        "Cisco CCNA 1 – Routing & Switching",
        "Cisco CCNA 2 – Switching, Routing & Wireless Essentials", 
        "Cisco CCNA 3 – Enterprise Networking, Security & Automation",
        "Cisco IT Essentials (hardware/software basics)"
      ]
    },
    
    databases: {
      skills: [
        "SQL Server (en apprentissage, motivé pour progresser)",
        "MySQL / MariaDB (expérience pratique)",
        "Oracle (première expérience pratique)",
        "MongoDB (projets académiques, bases NoSQL)",
        "Access (utilisé en laboratoires académiques)"
      ]
    },
    
    devops_automation: {
      skills: [
        "Ansible (playbooks pour déploiement de VMs)",
        "Terraform (infrastructure as code, utilisation en lab)",
        "Docker (conteneurs pour apps & monitoring)",
        "Kubernetes (pods, services, deployments)",
        "GitLab CI/CD (pipelines de base)",
        "PowerShell scripting (tâches comptes & serveurs)",
        "Python scripting (automatisation, APIs, traitement de données)"
      ]
    },
    
    monitoring_itms: {
      skills: [
        "Grafana & Prometheus (tableaux de bord & alertes)",
        "InfluxDB (stockage de données time-series)",
        "Nagios & Zabbix (supervision réseau)",
        "GLPI ITSM (gestion d'incidents, services, Formcreator)"
      ]
    },
    
    security: {
      skills: [
        "Plan de Reprise d'Activité (PRA) – backup/restore",
        "Incident response & vulnerability remediation",
        "Secure SFTP server deployment",
        "Access & identity management",
        "IoT security project (Sentinelle 4.0 with Suricata IDS)"
      ]
    },
    
    programming: {
      languages: [
        "Python (scripts d'automatisation, REST APIs)",
        "Java (projets académiques orientés objet)",
        "Node.js (petites apps & bots)",
        "C (programmation bas niveau de base)",
        "PHP basics (formulaires web & accès DB)",
        "JavaScript, HTML/CSS",
        "PowerShell, Bash"
      ],
      tools: [
        "Git & GitLab",
        "Visual Studio Code, IntelliJ",
        "Postman (test d'APIs)",
        "Office 365 suite"
      ]
    },
    
    softwares: [
      "Cisco Packet Tracer",
      "Wireshark",
      "VMware",
      "VirtualBox",
      "Microsoft Office"
    ]
  },
  
  experiences: {
    stage_jtekt: {
      company: "JTEKT Column Systems France",
      duration: "Stage 2025",
      role: "Stagiaire en informatique",
      projects: [
        {
          name: "Déploiement serveur SFTP sécurisé",
          description: "Déploiement d'un serveur SFTP sécurisé sur Debian",
          technologies: ["Debian", "SFTP", "Sécurité"]
        },
        {
          name: "Plan de Reprise d'Activité (PRA)",
          description: "Contribution au Plan de Reprise d'Activité",
          technologies: ["PRA", "Backup", "Restore"]
        },
        {
          name: "Automatisation des tâches",
          description: "Automatisation des tâches d'administration avec Bash & Python → réduction du temps de configuration de 30%",
          technologies: ["Bash", "Python", "Automatisation"]
        },
        {
          name: "Administration VMware et Cisco",
          description: "Administration VMware ESXi et Cisco ASA",
          technologies: ["VMware ESXi", "Cisco ASA"]
        },
        {
          name: "Amélioration documentation",
          description: "Amélioration de la documentation et des procédures pour l'équipe IT",
          technologies: ["Documentation", "Procédures"]
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