import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  ShieldCheck, 
  Database, 
  Workflow, 
  CheckCircle2, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  ChevronRight,
  Printer,
  ExternalLink
} from 'lucide-react';

export const SpecificationBook: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<number>(1);
  const [copiedDiagram, setCopiedDiagram] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDiagram(id);
    setTimeout(() => setCopiedDiagram(null), 2000);
  };

  const sections = [
    { id: 1, title: '1. Vision & Objectifs du Projet' },
    { id: 2, title: '2. Utilisateurs & Matrice RACI' },
    { id: 3, title: '3. Fonctionnalités Détaillées' },
    { id: 4, title: '4. Workflow des Demandes & Délais' },
    { id: 5, title: '5. Conception UX/UI & Ergonomie' },
    { id: 6, title: '6. Architecture Technique' },
    { id: 7, title: '7. Sécurité & Réglementation INPDP' },
    { id: 8, title: '8. Modèle de Données (ERD)' },
    { id: 9, title: '9. Spécification des API REST' },
    { id: 10, title: '10. Arborescence Complète du Site' },
    { id: 11, title: '11. Stratégie de Notifications' },
    { id: 12, title: '12. Tableaux de Bord & KPI' },
    { id: 13, title: '13. Génération de Documents Officiels' },
    { id: 14, title: '14. Scénarios Parcours Utilisateurs' },
    { id: 15, title: '15. Design System Tunisie Telecom' },
    { id: 16, title: '16. Plan de Développement (8 Phases)' },
    { id: 17, title: '17. Périmètre MVP vs Version 2' },
    { id: 18, title: '18. Stratégie de Tests & Qualité' },
    { id: 19, title: '19. Déploiement Entreprise & CI/CD' },
    { id: 20, title: '20. Risques, Recommandations & Diagrammes' }
  ];

  const mermaidArchitecture = `graph TD
    subgraph Client [Postes de Travail & Mobiles TT]
        EMP[Employé - Navigateur Web / Mobile PWA]
        SOC[Assistante Sociale - Console Instruction]
        MGR[Responsable Social - Validation & Visa]
        ADM[Admin DSI - Console Gouvernance]
    end

    subgraph Perimetre_Securite [Zone DMZ & Sécurité Tunisie Telecom]
        WAF[WAF / Reverse Proxy NGINX TT]
        SSO[Connecteur SSO SAML 2.0 / Active Directory TT]
        API_GW[API Gateway & Rate Limiter]
    end

    subgraph App_Tier [Cluster d'Application Privé]
        API_SRV[Serveur Backend Node.js / NestJS]
        AUTH_MOD[Module Auth & RBAC]
        WORKFLOW_ENG[Moteur de Workflow & SLA]
        DOC_GEN[Générateur PDF & Cachet Numérique]
        NOTIF_ENG[Service Notifications Email/SMS TT]
    end

    subgraph Data_Tier [Zone Données Hautement Sécurisée]
        PG[(Base de Données PostgreSQL Chiffrée)]
        DOC_STORE[(Stockage Objet S3 / MinIO Chiffré AES-256)]
        AUDIT_LOG[(Journal d'Audit Immuable INPDP)]
        HSM[KMS Interne TT - Gestion des Clés de Chiffrement]
    end

    Client -->|HTTPS / TLS 1.3| WAF
    WAF --> API_GW
    API_GW --> SSO
    API_GW --> API_SRV
    API_SRV --> AUTH_MOD
    API_SRV --> WORKFLOW_ENG
    API_SRV --> DOC_GEN
    API_SRV --> NOTIF_ENG
    API_SRV --> PG
    DOC_GEN --> DOC_STORE
    API_SRV --> DOC_STORE
    API_SRV --> AUDIT_LOG
    DOC_STORE -.->|Clés maîtres| HSM`;

  const mermaidERD = `erDiagram
    EMPLOYEES ||--o{ APPLICATIONS : "soumet"
    EMPLOYEES {
        string id PK
        string matricule UK
        string nom_prenom
        string email_tt
        string telephone
        string direction_regionale
        string grade
        string situation_familiale
        int nb_enfants
    }

    ASSISTANCE_TYPES ||--o{ APPLICATIONS : "concerne"
    ASSISTANCE_TYPES {
        string id PK
        string code UK
        string libelle_fr
        string libelle_ar
        decimal plafond_tnd
        int sla_jours
        boolean commission_requise
        boolean actif
    }

    APPLICATIONS ||--o{ UPLOADED_DOCUMENTS : "comporte"
    APPLICATIONS ||--o{ APPLICATION_STATUS_HISTORY : "trace"
    APPLICATIONS ||--o{ COMMENTS : "dialogue"
    APPLICATIONS ||--o| DECISIONS : "aboutit"
    APPLICATIONS {
        string id PK
        string numero_reference UK
        string employee_id FK
        string category_id FK
        string statut
        decimal montant_demande
        decimal montant_propose
        decimal montant_valide
        string priorite
        timestamp created_at
    }

    REQUIRED_DOCUMENTS }o--|| ASSISTANCE_TYPES : "exige"
    REQUIRED_DOCUMENTS {
        string id PK
        string category_id FK
        string code
        string nom_document
        boolean obligatoire
        int taille_max_mo
    }

    UPLOADED_DOCUMENTS {
        string id PK
        string application_id FK
        string document_def_id FK
        string nom_fichier
        string hash_sha256
        string statut_conformite
        timestamp uploaded_at
    }

    DECISIONS {
        string id PK
        string application_id FK
        string decideur_id
        string decision_type
        decimal montant_accorde
        string motivation
        string numero_pv
        timestamp date_decision
    }

    AUDIT_LOGS {
        string id PK
        string user_id
        string action
        string ressource
        string ip_address
        timestamp timestamp
        string gravite
    }`;

  const mermaidWorkflow = `stateDiagram-v2
    [*] --> Brouillon : Agent initialise
    Brouillon --> Soumise : Dépôt avec pièces obligatoires
    Soumise --> En_cours_etude : Prise en charge Assistante Sociale
    En_cours_etude --> Info_Demandee : Pièce manquante ou non conforme
    Info_Demandee --> En_cours_etude : Collaborateur téléverse complément
    En_cours_etude --> Dossier_Complet : Enquête sociale terminée
    Dossier_Complet --> En_attente_validation : Transmission avec proposition de montant
    En_attente_validation --> Validee : Visa favorable Chef de Division / Commission
    En_attente_validation --> Refusee : Motif de rejet administratif ou barème dépassé
    En_attente_validation --> En_cours_etude : Demande de réinstruction
    Validee --> Cloturee : Virement exécuté par la Trésorerie TT
    Refusee --> Cloturee : Notification motivée
    Cloturee --> [*]`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-[#002b59] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#009FE3]/20 text-[#38bdf8] px-3 py-1 rounded-full text-xs font-bold border border-[#009FE3]/30 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Cahier des Charges Technique & Fonctionnel • Document d'Ingénierie Senior
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Plateforme d’Aide Sociale des Employés de Tunisie Telecom
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Dossier de conception intégrale (20 chapitres), architecture logicielle distribuée, modèle de données relationnel, matrice de sécurité INPDP et workflows d'instruction dématérialisée.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-slate-100 text-[#003366] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Imprimer / Exporter PDF
          </button>
        </div>
      </div>

      {/* Main Layout: Left Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">
        {/* Left Sidebar Table of Contents */}
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
            Sommaire du Cahier des Charges
          </div>
          <div className="space-y-0.5">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                  selectedSection === sec.id
                    ? 'bg-[#003366] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span className="truncate">{sec.title}</span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedSection === sec.id ? 'text-[#009FE3]' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Viewport */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-8 max-w-4xl text-slate-800 leading-relaxed text-xs sm:text-sm">
          {/* SECTION 1 */}
          {selectedSection === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                1. Objectif du Projet & Vision Stratégique
              </h2>
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">1.1 Problématique à Résoudre</h3>
                <p>
                  Tunisie Telecom, opérateur national historique des télécommunications en Tunisie, emploie des milliers de collaborateurs répartis sur l’ensemble des gouvernorats (siège social, directions régionales, centres techniques, agences commerciales Espace TT). Actuellement, la gestion des demandes d'aides sociales et de secours repose sur des processus largement manuels ou semi-papier (fiches navettes, dépôts de dossiers physiques, courriers postaux internes, échanges d'emails non centralisés).
                </p>
                <p>
                  Ce fonctionnement engendre plusieurs difficultés majeures :
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
                  <li><strong>Délais de traitement allongés :</strong> Un dossier d’aide médicale urgente peut mettre 15 à 30 jours à transiter entre une région éloignée et la commission centrale à Tunis.</li>
                  <li><strong>Risque de perte ou de dispersion des pièces médicales :</strong> Documents sensibles transmis en copies papier avec risques de confidentialité.</li>
                  <li><strong>Manque de visibilité pour l'agent :</strong> L'employé ignore l'état d'avancement de sa demande sans relancer manuellement son assistante sociale.</li>
                  <li><strong>Charge administrative lourde pour le service social :</strong> Saisie redondante, relances téléphoniques pour pièces manquantes, archivage physique encombrant.</li>
                  <li><strong>Non-conformité potentielle avec la réglementation INPDP :</strong> Dispersion des données médicales et financières privées.</li>
                </ul>

                <h3 className="font-bold text-sm text-slate-900 pt-2">1.2 Objectifs Fonctionnels & Organisationnels</h3>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
                  <li><strong>Centralisation unifiée :</strong> Un portail intranet unique accessible 24/7 pour tous les salariés de Tunisie Telecom.</li>
                  <li><strong>Dématérialisation zéro papier :</strong> Téléversement des justificatifs chiffrés et vérification en ligne.</li>
                  <li><strong>Workflow transparent et audité :</strong> Traçabilité horodatée de chaque étape avec alertes automatiques.</li>
                  <li><strong>Pilotage budgétaire temps réel :</strong> Visibilité financière immédiate sur les fonds d'aide sociale consommés et restants.</li>
                </ul>

                <h3 className="font-bold text-sm text-slate-900 pt-2">1.3 Bénéfices Attendus</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <div className="font-bold text-[#003366] text-xs mb-1">Pour les Employés TT :</div>
                    <p className="text-xs text-slate-600">Dépôt autonome, équité de traitement, confidentialité garantie, notifications par SMS/Email et réduction drastique du délai d'obtention de l'aide.</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="font-bold text-emerald-900 text-xs mb-1">Pour le Service Social TT :</div>
                    <p className="text-xs text-slate-600">Suppression des tâches de saisie manuelle, dossiers complets dès le départ grâce aux contrôles dynamiques, outils d'arbitrage et signature électronique.</p>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 pt-2">1.4 Indicateurs Clés de Succès (KPIs)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2.5">Indicateur</th>
                        <th className="p-2.5">Situation Actuelle (Papier)</th>
                        <th className="p-2.5">Objectif Cible (Plateforme)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-semibold">Délai moyen d’instruction</td>
                        <td className="p-2.5 text-rose-700 font-bold">18 à 25 jours</td>
                        <td className="p-2.5 text-emerald-700 font-bold">≤ 5 jours ouvrés</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Taux de dossiers complets dès le dépôt</td>
                        <td className="p-2.5 text-rose-700 font-bold">35%</td>
                        <td className="p-2.5 text-emerald-700 font-bold">≥ 85%</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Satisfaction collaborateurs (Enquête RH)</td>
                        <td className="p-2.5 text-rose-700 font-bold">42%</td>
                        <td className="p-2.5 text-emerald-700 font-bold">≥ 90%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2 */}
          {selectedSection === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                2. Utilisateurs & Matrice RACI
              </h2>
              <div className="space-y-4">
                <p>
                  La plateforme distingue strictement quatre profils opérationnels et un organe collégial :
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">1. Employé (Tout collaborateur TT actif)</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Droits :</strong> Déposer une demande pour soi ou ses ayants-droit, consulter l’avancement de ses propres dossiers, téléverser des compléments, échanger des messages avec l'assistante sociale, télécharger récépissés et décisions. <em>Interdiction absolue d'accéder aux dossiers de tiers.</em>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">2. Assistante / Agent Social</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Droits :</strong> Consulter la file active des dossiers de son périmètre géographique, vérifier la conformité légale et médicale des pièces, demander des compléments, rédiger des notes internes confidentielles, formuler un avis médico-social et proposer un montant d'aide.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">3. Responsable du Service Social / Comité d'Action Sociale</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Droits :</strong> Arbitrer les dossiers transmis, statuer définitivement (Validation, Rejet motivé, Demande de réinstruction), signer numériquement les décisions d’octroi, ordonner le mandatement à la trésorerie TT et piloter le budget global.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">4. Administrateur Technique (DSI / Sécurité TT)</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Droits :</strong> Paramétrer les types d'aides, plafonds, pièces requises et formulaires, gérer les comptes et rôles RBAC, auditer les logs de sécurité (sans visibilité sur le contenu des dossiers médicaux, conformément au secret professionnel et aux directives INPDP).
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 pt-2">Matrice RACI des Actions Clés</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                    <thead className="bg-[#003366] text-white">
                      <tr>
                        <th className="p-2.5">Processus / Action</th>
                        <th className="p-2.5 text-center">Employé</th>
                        <th className="p-2.5 text-center">Assistante</th>
                        <th className="p-2.5 text-center">Responsable</th>
                        <th className="p-2.5 text-center">Admin DSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-semibold">Initiation & Dépôt de demande</td>
                        <td className="p-2 text-center font-bold text-emerald-700">R (Réalise)</td>
                        <td className="p-2 text-center text-slate-400">I</td>
                        <td className="p-2 text-center text-slate-400">I</td>
                        <td className="p-2 text-center text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Vérification des pièces & Instruction</td>
                        <td className="p-2 text-center text-slate-400">C</td>
                        <td className="p-2 text-center font-bold text-emerald-700">R (Réalise)</td>
                        <td className="p-2 text-center text-slate-400">I</td>
                        <td className="p-2 text-center text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Demande de pièces complémentaires</td>
                        <td className="p-2 text-center font-bold text-blue-700">A (Action)</td>
                        <td className="p-2 text-center font-bold text-emerald-700">R (Réalise)</td>
                        <td className="p-2 text-center text-slate-400">I</td>
                        <td className="p-2 text-center text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Décision finale & Signature légale</td>
                        <td className="p-2 text-center text-slate-400">I</td>
                        <td className="p-2 text-center text-slate-400">C</td>
                        <td className="p-2 text-center font-bold text-purple-700">A / R (Approuve)</td>
                        <td className="p-2 text-center text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Paramétrage des barèmes & SLA</td>
                        <td className="p-2 text-center text-slate-400">-</td>
                        <td className="p-2 text-center text-slate-400">C</td>
                        <td className="p-2 text-center font-bold text-purple-700">A (Valide)</td>
                        <td className="p-2 text-center font-bold text-emerald-700">R (Configure)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3 */}
          {selectedSection === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                3. Fonctionnalités Principales Détaillées
              </h2>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-xl p-4">
                    <h3 className="font-bold text-slate-900 text-sm">3.1 Espace Employé</h3>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-xs text-slate-700">
                      <li><strong>Authentification SSO TT :</strong> Connexion fluide via les identifiants d'entreprise sans mot de passe supplémentaire.</li>
                      <li><strong>Formulaire dynamique guidé :</strong> Sélection de la catégorie d'aide, adaptation en temps réel des champs obligatoires et pièces à fournir selon le bénéficiaire (salarié, conjoint, enfant).</li>
                      <li><strong>Drag-and-Drop & Prévisualisation des pièces :</strong> Contrôle des formats (PDF/JPG/PNG) et de la taille maximale avant envoi.</li>
                      <li><strong>Suivi chronologique temps réel :</strong> Barre de progression en 5 jalons avec horodatage certifié.</li>
                      <li><strong>Messagerie interne :</strong> Canal d'échange chiffré directement rattaché au dossier avec l'assistante sociale assignée.</li>
                      <li><strong>Téléchargement instantané :</strong> Récépissé officiel au format PDF avec numéro unique `TT-SOC-YYYY-XXXX` et QR code.</li>
                    </ul>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4">
                    <h3 className="font-bold text-slate-900 text-sm">3.2 Système Configurable de Gestion des Aides</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      L'administration ne fige aucune règle en dur. La plateforme intègre un moteur de règles paramétrables :
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-xs text-slate-700">
                      <li><strong>Aide Médicale & Soins Lourds :</strong> Plafond indicatif 2 500 TND, SLA 7 jours, pièces : rapport sous pli confidentiel, facture/devis, décompte mutuelle/CNAM.</li>
                      <li><strong>Secours Exceptionnel & Sinistre :</strong> Plafond 3 000 TND, SLA 4 jours d'urgence, pièces : constat police/protection civile, devis réfection.</li>
                      <li><strong>Aide Familiale & Prêt Social :</strong> Plafond 1 800 TND, SLA 10 jours, pièces : extrait état civil, justificatifs charges.</li>
                      <li><strong>Aide Scolaire & Universitaire :</strong> Plafond 800 TND, SLA 5 jours, pièces : certificats scolarité.</li>
                      <li><strong>Aide Décès :</strong> Plafond 1 500 TND, procédure accélérée SLA 3 jours, pièces : extrait décès, lien de parenté.</li>
                      <li><strong>Aide Ponctuelle d’Urgence :</strong> Plafond 600 TND, SLA 48h.</li>
                    </ul>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4">
                    <h3 className="font-bold text-slate-900 text-sm">3.3 Espace Service Social & Administration</h3>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-xs text-slate-700">
                      <li><strong>Console de triage :</strong> Filtres multicritères (matricule, région, catégorie, statut, urgence).</li>
                      <li><strong>Vérification pièce par pièce :</strong> Outil d'annotation et validation unitaire (Conforme / Rejetée).</li>
                      <li><strong>Notes internes confidentielles :</strong> Invisibles pour l'employé, permettant de consigner l'analyse médico-sociale.</li>
                      <li><strong>Console d'administration :</strong> Gestion des barèmes, formulaires personnalisés, circuit de validation, journaux d'audit et politiques de rétention.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4 */}
          {selectedSection === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                4. Workflow des Demandes & Gestion des Délais
              </h2>
              <div className="space-y-4">
                <p>
                  Le cycle de vie d'un dossier obéit à une machine à états finis (FSM) stricte garantissant l'intégrité de la procédure :
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
                  Brouillon → Soumise → En cours d'étude ⇄ Complément requis → Dossier complet → En attente de validation → Validée / Refusée → Clôturée
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                    <thead className="bg-[#003366] text-white">
                      <tr>
                        <th className="p-2.5">Étape / Statut</th>
                        <th className="p-2.5">Acteur Habilité</th>
                        <th className="p-2.5">Actions Disponibles</th>
                        <th className="p-2.5">Notification Émise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold">1. Soumise</td>
                        <td className="p-2.5">Employé</td>
                        <td className="p-2.5">Dépôt final, génération accusé réception</td>
                        <td className="p-2.5">Email + SMS de confirmation à l'employé</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">2. En cours d’étude</td>
                        <td className="p-2.5">Assistante Sociale</td>
                        <td className="p-2.5">Prise en charge, examen des justificatifs</td>
                        <td className="p-2.5">Notification in-app à l'agent</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-rose-700">3. Complément requis</td>
                        <td className="p-2.5">Assistante Sociale</td>
                        <td className="p-2.5">Spécification des pièces manquantes</td>
                        <td className="p-2.5">Email urgent + SMS à l'employé</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-purple-700">4. En attente validation</td>
                        <td className="p-2.5">Assistante Sociale</td>
                        <td className="p-2.5">Proposition de montant & transmission</td>
                        <td className="p-2.5">Notification au Responsable Social</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-emerald-700">5. Validée</td>
                        <td className="p-2.5">Responsable Social</td>
                        <td className="p-2.5">Visa final, signature PV, transmission Trésorerie</td>
                        <td className="p-2.5">Email officiel + décision PDF à l'agent</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-700">6. Clôturée</td>
                        <td className="p-2.5">Service Social / Trésorerie</td>
                        <td className="p-2.5">Virement bancaire exécuté, archivage légal</td>
                        <td className="p-2.5">Avis de virement transmis</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-bold text-sm text-slate-900 pt-2">Gestion des Délais & Relances Automatiques (SLA Engine)</h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                  <li><strong>Suspension de SLA :</strong> Lorsque le statut passe à <em>« Complément requis »</em>, le compteur SLA est mis en pause afin de ne pas pénaliser le score de traitement du service social.</li>
                  <li><strong>Relance automatique collaborateur :</strong> Après 7 jours sans transmission des pièces demandées, un email de rappel automatique est émis. Après 21 jours, une alerte d'expiration est notifiée avant clôture pour caducité.</li>
                  <li><strong>Escalade hiérarchique :</strong> Tout dossier en attente d'arbitrage depuis plus de 5 jours est mis en surbrillance rouge sur le tableau de bord du Chef de Division.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 5 */}
          {selectedSection === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                5. Conception UX/UI & Ergonomie
              </h2>
              <div className="space-y-3">
                <p>
                  L'interface utilisateur a été conçue pour répondre à trois impératifs :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-slate-900 block mb-1">Simplicité Cognitive :</strong>
                    <span className="text-xs text-slate-600">Formulaires par étapes (wizards) réduisant la surcharge d'information pour les collaborateurs non familiers avec les outils numériques.</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-slate-900 block mb-1">Atmosphère Rassurante :</strong>
                    <span className="text-xs text-slate-600">Badges de sécurité, mentions légales claires, tons neutres et respectueux du caractère intime des épreuves vécues.</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-slate-900 block mb-1">Responsive & Mobile First :</strong>
                    <span className="text-xs text-slate-600">Utilisable aisément depuis un smartphone d'agent sur le terrain pour photographier et téléverser directement une facture médicale.</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 pt-2">Multilinguisme Réflexif (Français & Arabe)</h3>
                <p className="text-xs text-slate-700">
                  L'application dispose d'un moteur de traduction i18n prenant en charge la typographie arabe (Noto Sans Arabic) et l'alignement bidirectionnel (RTL / LTR) afin que tout agent puisse effectuer sa démarche dans sa langue de prédilection.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 6 */}
          {selectedSection === 6 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                6. Architecture Technique Recommandée
              </h2>
              <div className="space-y-4">
                <p>
                  Pour répondre aux exigences de scalabilité, de sécurité et d'hébergement sur les infrastructures souveraines de Tunisie Telecom (Cloud privé ou Datacenter El Kasbah / Charguia), l'architecture suivante est recommandée :
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                    <thead className="bg-[#003366] text-white">
                      <tr>
                        <th className="p-2.5">Composant</th>
                        <th className="p-2.5">Solution Recommandée</th>
                        <th className="p-2.5">Justification Technique</th>
                        <th className="p-2.5">Alternative Validée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold">Frontend</td>
                        <td className="p-2.5 font-semibold text-[#003366]">React 19 / Next.js / Tailwind CSS</td>
                        <td className="p-2.5">Composants réactifs, SSR pour performances intranet, écosystème éprouvé</td>
                        <td className="p-2.5 text-slate-500">Vue.js 3 / Nuxt</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Backend API</td>
                        <td className="p-2.5 font-semibold text-[#003366]">Node.js (NestJS) TypeScript</td>
                        <td className="p-2.5">Architecture modulaire hexagonale, typage strict, sécurité native (Guards, Interceptors)</td>
                        <td className="p-2.5 text-slate-500">Spring Boot (Java) / Python FastAPI</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Base de Données</td>
                        <td className="p-2.5 font-semibold text-[#003366]">PostgreSQL 16 (Cluster HA)</td>
                        <td className="p-2.5">Transactions ACID strictes, intégrité référentielle, chiffrement transparent TDE</td>
                        <td className="p-2.5 text-slate-500">Oracle Database 19c (Déjà présent chez TT)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Stockage Fichiers</td>
                        <td className="p-2.5 font-semibold text-[#003366]">Stockage Objet S3 Compatible (MinIO On-Premise)</td>
                        <td className="p-2.5">Chiffrement côté serveur SSE-S3 (AES-256), isolation réseau totale, immuabilité (WORM)</td>
                        <td className="p-2.5 text-slate-500">Ceph / SAN Entreprise Chiffré</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Authentification</td>
                        <td className="p-2.5 font-semibold text-[#003366]">Keycloak / ADFS SAML 2.0</td>
                        <td className="p-2.5">Intégration directe avec l’Active Directory de Tunisie Telecom, 2FA OTP</td>
                        <td className="p-2.5 text-slate-500">OpenID Connect / LDAP direct</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Génération PDF</td>
                        <td className="p-2.5 font-semibold text-[#003366]">Puppeteer / PDFKit</td>
                        <td className="p-2.5">Rendu vectoriel parfait, signatures visuelles certifiées, QR Code</td>
                        <td className="p-2.5 text-slate-500">Gotenberg (Microservice Docker)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7 */}
          {selectedSection === 7 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                7. Sécurité & Conformité Réglementaire Tunisienne (INPDP)
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 leading-relaxed">
                  <strong>Cadre Légal Impératif :</strong> La plateforme traite des données médicales, familiales et financières réputées « Données sensibles » au sens de la <strong>loi organique tunisienne n° 2004-63 du 27 juillet 2004</strong> relative à la protection des données à caractère personnel.
                </div>

                <h3 className="font-bold text-sm text-slate-900 pt-2">Points Clés de Sécurité Opérationnelle</h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                  <li><strong>Chiffrement en Transit :</strong> Protocole HTTPS obligatoire (TLS 1.3 uniquement, suites cryptographiques robustes, HSTS strict activé).</li>
                  <li><strong>Chiffrement au Repos :</strong> Toutes les pièces justificatives sont chiffrées individuellement avec l'algorithme AES-256 avant écriture sur le disque de stockage. Les clés de chiffrement sont stockées dans un coffre de clés (KMS) étanche.</li>
                  <li><strong>Séparation Stricte des Données Médicales :</strong> Les rapports médicaux et ordonnances sont classifiés en zone étanche (Compartiment Médical). Ni les administrateurs techniques de la DSI, ni la hiérarchie directe de l'agent ne peuvent consulter ces documents. Seules les assistantes sociales assermentées y ont accès.</li>
                  <li><strong>Journal d'Audit Inaltérable :</strong> Tout accès, consultation ou téléchargement de document médical est consigné dans une table d'audit WORM (Write Once, Read Many) comprenant horodatage UTC, matricule de l'agent consultant, adresse IP et motif.</li>
                  <li><strong>Protection applicative :</strong> Prévention native OWASP Top 10 (Injection SQL via ORM paramétré, XSS via échappement automatique, CSRF tokens stricts sur les mutations d'état, Rate Limiting anti-brute-force sur les routes API).</li>
                </ul>

                <h3 className="font-bold text-sm text-slate-900 pt-2">Checklist Juridique à Valider avec la Direction Juridique de Tunisie Telecom</h3>
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-[#009FE3]" />
                    <span>Dépôt de la déclaration préalable de traitement automatisé auprès de l'INPDP (Instance Nationale de Protection des Données Personnelles).</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-[#009FE3]" />
                    <span>Validation de la clause de consentement explicite intégrée au formulaire de dépôt d'aide.</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-[#009FE3]" />
                    <span>Politique de conservation : purge automatique ou anonymisation des pièces médicales 5 ans après la clôture du dossier.</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-[#009FE3]" />
                    <span>Convention de secret professionnel et d'assermentation signée par l'ensemble des agents du service social accédant à la console.</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8 */}
          {selectedSection === 8 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                8. Modèle de Données & Schéma Relationnel
              </h2>
              <div className="space-y-3">
                <p>
                  Le modèle de données garantit l'intégrité référentielle, l'historisation immuable et la séparation des métadonnées et des fichiers physiques :
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-[#003366] font-mono block mb-1">TABLE employees</strong>
                    <span className="text-slate-500">id (UUID), matricule (VARCHAR, UNIQUE), nom_prenom, email_tt, telephone, direction_regionale, affectation_service, grade, situation_familiale, nb_enfants, date_recrutement, actif (BOOL)</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-[#003366] font-mono block mb-1">TABLE assistance_types</strong>
                    <span className="text-slate-500">id, code (UNIQUE), libelle_fr, libelle_ar, description, plafond_tnd, sla_jours, commission_requise, actif (BOOL)</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-[#003366] font-mono block mb-1">TABLE applications</strong>
                    <span className="text-slate-500">id, numero_reference (UNIQUE), employee_id (FK), category_id (FK), statut, montant_demande, montant_propose, montant_valide, priorite, objet, description_situation, created_at, updated_at</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-[#003366] font-mono block mb-1">TABLE uploaded_documents</strong>
                    <span className="text-slate-500">id, application_id (FK), document_def_id (FK), nom_fichier, chemin_stockage_chiffre, taille_octets, hash_sha256, statut_verification, motif_rejet, uploaded_at</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-[#003366] font-mono block mb-1">TABLE application_status_history</strong>
                    <span className="text-slate-500">id, application_id (FK), statut_precedent, statut_nouveau, changed_by_user_id (FK), role_auteur, commentaire, timestamp</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-[#003366] font-mono block mb-1">TABLE audit_logs</strong>
                    <span className="text-slate-500">id, user_id, matricule, action, ressource, ressource_id, ip_address, user_agent, timestamp, gravite, details</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9 */}
          {selectedSection === 9 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                9. Spécification des API RESTful
              </h2>
              <div className="space-y-3">
                <p>
                  Toutes les requêtes requièrent un en-tête `Authorization: Bearer &lt;JWT&gt;`. Le contrôle d'accès est validé par des middlewares d'authentification et des guards RBAC.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                    <thead className="bg-[#003366] text-white">
                      <tr>
                        <th className="p-2.5">Méthode</th>
                        <th className="p-2.5">Route API</th>
                        <th className="p-2.5">Rôles Autorisés</th>
                        <th className="p-2.5">Description Opérationnelle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      <tr>
                        <td className="p-2 text-emerald-700 font-bold">GET</td>
                        <td className="p-2 font-semibold">/api/v1/applications/my</td>
                        <td className="p-2 font-sans">Employé</td>
                        <td className="p-2 font-sans">Liste des demandes de l'agent connecté</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-blue-700 font-bold">POST</td>
                        <td className="p-2 font-semibold">/api/v1/applications</td>
                        <td className="p-2 font-sans">Employé</td>
                        <td className="p-2 font-sans">Création initiale d'une demande d'aide</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-blue-700 font-bold">POST</td>
                        <td className="p-2 font-semibold">/api/v1/applications/:id/documents</td>
                        <td className="p-2 font-sans">Employé</td>
                        <td className="p-2 font-sans">Téléversement multipart de pièces chiffrées</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-emerald-700 font-bold">GET</td>
                        <td className="p-2 font-semibold">/api/v1/social/cases</td>
                        <td className="p-2 font-sans">Assistante, Responsable</td>
                        <td className="p-2 font-sans">File d'attente globale avec filtres multicritères</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-amber-700 font-bold">PATCH</td>
                        <td className="p-2 font-semibold">/api/v1/social/cases/:id/status</td>
                        <td className="p-2 font-sans">Assistante, Responsable</td>
                        <td className="p-2 font-sans">Transition d'état avec commentaire audité</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-blue-700 font-bold">POST</td>
                        <td className="p-2 font-semibold">/api/v1/social/cases/:id/supplement</td>
                        <td className="p-2 font-sans">Assistante Sociale</td>
                        <td className="p-2 font-sans">Demande formelle de pièces complémentaires</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-purple-700 font-bold">POST</td>
                        <td className="p-2 font-semibold">/api/v1/manager/cases/:id/decision</td>
                        <td className="p-2 font-sans">Responsable Social</td>
                        <td className="p-2 font-sans">Visa légal final d'octroi ou refus avec montant</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-emerald-700 font-bold">GET</td>
                        <td className="p-2 font-semibold">/api/v1/admin/audit-logs</td>
                        <td className="p-2 font-sans">Admin DSI</td>
                        <td className="p-2 font-sans">Consultation du journal d'audit INPDP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10 */}
          {selectedSection === 10 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                10. Arborescence & Navigation par Profil
              </h2>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-[#003366] font-sans">1. Espace Employé TT</div>
                  <div>├── /connexion (Portail SSO Tunisie Telecom)</div>
                  <div>├── /tableau-de-bord (Synthèse des aides, métriques personnelles)</div>
                  <div>├── /demandes/nouvelle (Wizard 4 étapes de création)</div>
                  <div>├── /demandes/mes-dossiers (Liste et recherche)</div>
                  <div>│    └── /demandes/:id (Détail, timeline, pièces, messagerie)</div>
                  <div>├── /guide-prestations (Barèmes, conditions, plafonds)</div>
                  <div>└── /assistance (Permanences régionales, FAQ)</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 font-sans">2. Espace Service Social (Assistantes Sociales)</div>
                  <div>├── /social/tableau-de-bord (File d'attente, alertes SLA)</div>
                  <div>├── /social/dossiers (Console de recherche et tri)</div>
                  <div>│    └── /social/dossiers/:id (Examen pièces, notes internes, proposition)</div>
                  <div>└── /social/rapports (Statistiques d'activité par direction régionale)</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-purple-900 font-sans">3. Espace Responsable Social & Commission</div>
                  <div>├── /manager/tableau-de-bord (Suivi budgétaire consolidé TND)</div>
                  <div>├── /manager/validations (Dossiers en attente de visa final)</div>
                  <div>└── /manager/decisions (Historique des PV et arrêtés d’attribution)</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-amber-900 font-sans">4. Espace Administration DSI</div>
                  <div>├── /admin/categories-aides (Paramétrage des plafonds et documents)</div>
                  <div>├── /admin/utilisateurs-roles (Gestion des habilitations RBAC)</div>
                  <div>├── /admin/journal-audit (Traçabilité légale INPDP et exports)</div>
                  <div>└── /admin/parametres-securite (KMS, SSO, rétention)</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 11 à 19 (Condensed & High Value) */}
          {selectedSection >= 11 && selectedSection <= 19 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                {sections.find(s => s.id === selectedSection)?.title}
              </h2>
              
              {selectedSection === 11 && (
                <div className="space-y-3">
                  <p>La stratégie de notification est multicanale et proportionnée à la criticité de l'information :</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Notifications dans la plateforme (In-App) :</strong> Pour chaque changement de statut mineur et nouveau message de l'assistante sociale.</li>
                    <li><strong>Email Professionnel TT (@tunisietelecom.tn) :</strong> Notification formelle pour dépôt de dossier, demande de complément et publication de décision d'attribution.</li>
                    <li><strong>SMS Mobile Professionnel (Réseau TT) :</strong> Déclenché pour les alertes à haute priorité (complément urgent sous 48h ou validation de secours exceptionnel).</li>
                  </ul>
                </div>
              )}

              {selectedSection === 12 && (
                <div className="space-y-3">
                  <p>Indicateurs décisionnels intégrés pour la gouvernance de l'Action Sociale :</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Volume total de demandes par période (mois, trimestre, année).</li>
                    <li>Répartition géographique par Direction Régionale TT (Grand Tunis, Sousse, Sfax, Bizerte, etc.).</li>
                    <li>Taux d'accord et de refus par catégorie d'aide.</li>
                    <li>Délai moyen d'instruction (SLA réel vs SLA cible).</li>
                    <li>Taux de consommation du budget social annuel voté (en TND).</li>
                  </ul>
                </div>
              )}

              {selectedSection === 13 && (
                <div className="space-y-3">
                  <p>Génération automatisée de documents officiels au format PDF A/4 avec cachet numérique :</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Récépissé officiel de dépôt :</strong> Avec date, heure, référence `TT-SOC-XXXX` et liste des pièces enregistrées.</li>
                    <li><strong>Lettre de demande de complément :</strong> Précisant formellement les motifs et délais accordés.</li>
                    <li><strong>Arrêté de décision d’attribution :</strong> Signé numériquement, mentionnant le montant en Dinars et le numéro de PV de la commission.</li>
                  </ul>
                </div>
              )}

              {selectedSection === 14 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Scénarios Parcours Utilisateurs :</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-700">
                    <li><strong>Scénario 1 - Dépôt collaborateur :</strong> Connexion SSO &rarr; Choix "Aide médicale" &rarr; Saisie montant &rarr; Upload ordonnance et décompte mutuelle &rarr; Signature déclaration honneur &rarr; Obtention immédiate du récépissé PDF.</li>
                    <li><strong>Scénario 2 - Instruction assistante :</strong> Notification nouveau dossier &rarr; Examen pièces &rarr; Validation conformité &rarr; Saisie note interne &rarr; Proposition montant 1500 TND &rarr; Transmission direction.</li>
                    <li><strong>Scénario 3 - Complément de pièces :</strong> Détection facture non acquittée &rarr; Demande complément motivée &rarr; SMS envoyé à l'agent &rarr; Dépôt de la pièce par l'agent &rarr; Reprise instruction.</li>
                    <li><strong>Scénario 4 - Validation manager :</strong> Consultation proposition &rarr; Contrôle budget &rarr; Visa électronique &rarr; Génération décision officielle &rarr; Notification virement.</li>
                  </ol>
                </div>
              )}

              {selectedSection === 15 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Charte Graphique & Design System Tunisie Telecom :</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    <div className="p-3 bg-[#003366] text-white rounded-lg">#003366<br /><span className="font-sans text-[10px]">Bleu Nuit TT (Primaire)</span></div>
                    <div className="p-3 bg-[#009FE3] text-white rounded-lg">#009FE3<br /><span className="font-sans text-[10px]">Bleu Cyan TT (Accent)</span></div>
                    <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">#F8FAFC<br /><span className="font-sans text-[10px]">Gris Très Clair (Fond)</span></div>
                    <div className="p-3 bg-emerald-600 text-white rounded-lg">#059669<br /><span className="font-sans text-[10px]">Vert Accordé</span></div>
                  </div>
                  <p className="text-xs text-slate-600">Typographie principale : Plus Jakarta Sans (Interface) & Noto Sans Arabic (Version arabe).</p>
                </div>
              )}

              {selectedSection === 16 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Plan de Développement en 8 Phases :</h3>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div><strong>Phase 1 :</strong> Cadrage fonctionnel, juridique INPDP & règles TT (Semaines 1-3)</div>
                    <div><strong>Phase 2 :</strong> Prototypage UX/UI Figma & validation utilisateurs (Semaines 4-6)</div>
                    <div><strong>Phase 3 :</strong> Architecture technique, chiffrement & connecteurs SSO (Semaines 7-8)</div>
                    <div><strong>Phase 4 :</strong> Développement MVP (Espace Employé, Instruction, PDF) (Semaines 9-14)</div>
                    <div><strong>Phase 5 :</strong> Campagne de tests fonctionnels & audit cybersécurité (Semaines 15-17)</div>
                    <div><strong>Phase 6 :</strong> Pilote interne sur 2 Directions Régionales pilotes (Semaines 18-20)</div>
                    <div><strong>Phase 7 :</strong> Déploiement généralisé à l'ensemble du personnel TT (Semaine 21)</div>
                    <div><strong>Phase 8 :</strong> Amélioration continue, retours d'expérience & V2 (Semaine 22+)</div>
                  </div>
                </div>
              )}

              {selectedSection === 17 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Périmètre MVP vs Versions Futures :</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <strong className="text-emerald-900 block mb-1">Inclus dans le MVP (Lancement) :</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li>Dépôt 6 types d'aides principales</li>
                        <li>Upload pièces justificatives chiffrées</li>
                        <li>Workflow d'instruction & validation</li>
                        <li>Génération récépissé & décision PDF</li>
                        <li>Notifications Email TT</li>
                        <li>Journal d'audit INPDP</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <strong className="text-blue-900 block mb-1">Évolutions Version 2 & 3 :</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li>Intégration automatique avec la Mutuelle TT / CNAM</li>
                        <li>Passerelle bancaire directe Trésorerie TT</li>
                        <li>Signature électronique qualifiée TunTrust</li>
                        <li>Application mobile native Android/iOS</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {selectedSection === 18 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Stratégie d'Assurance Qualité & Tests :</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Tests unitaires & intégration :</strong> Couverture de code ≥ 85% sur les règles métier et transitions de statut.</li>
                    <li><strong>Tests de sécurité (Pentest) :</strong> Audit d'intrusion boîte grise par le SOC TT avant ouverture intranet.</li>
                    <li><strong>Tests de charge :</strong> Simulation de 5 000 utilisateurs simultanés lors des pics (ex : prime de rentrée scolaire).</li>
                    <li><strong>Tests d’accessibilité (RGAA / WCAG 2.1 AA) :</strong> Navigation clavier et contrastes respectés.</li>
                  </ul>
                </div>
              )}

              {selectedSection === 19 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Stratégie de Déploiement & Exploitation :</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Environnements étanches : Développement &rarr; Staging (Recette RH) &rarr; Production (Intranet sécurisé).</li>
                    <li>Pipeline CI/CD GitLab / Jenkins automatisé avec analyse statique de sécurité (SonarQube).</li>
                    <li>Plan de Continuité & Reprise d'Activité (PCA/PRA) : Réplication asynchrone des données entre deux datacenters TT distincts. RPO &lt; 15 minutes, RTO &lt; 2 heures.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* SECTION 20 */}
          {selectedSection === 20 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-[#003366] border-b pb-2 border-slate-200">
                20. Diagrammes Techniques, Écrans Figma & Checklist de Production
              </h2>

              {/* Diagram 1: Mermaid Architecture */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#009FE3]" />
                    Diagramme 1 : Architecture Globale du Système (Mermaid)
                  </h3>
                  <button
                    onClick={() => handleCopy(mermaidArchitecture, 'arch')}
                    className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded flex items-center gap-1 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {copiedDiagram === 'arch' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDiagram === 'arch' ? 'Copié !' : 'Copier code Mermaid'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg overflow-x-auto text-[11px] font-mono">
                  {mermaidArchitecture}
                </pre>
              </div>

              {/* Diagram 2: Mermaid ERD */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#009FE3]" />
                    Diagramme 2 : Modèle Entité-Relation BDD (Mermaid ERD)
                  </h3>
                  <button
                    onClick={() => handleCopy(mermaidERD, 'erd')}
                    className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded flex items-center gap-1 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {copiedDiagram === 'erd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDiagram === 'erd' ? 'Copié !' : 'Copier code Mermaid'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg overflow-x-auto text-[11px] font-mono">
                  {mermaidERD}
                </pre>
              </div>

              {/* Diagram 3: Mermaid Workflow */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-[#009FE3]" />
                    Diagramme 3 : Machine à États du Workflow de Traitement (Mermaid)
                  </h3>
                  <button
                    onClick={() => handleCopy(mermaidWorkflow, 'wf')}
                    className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded flex items-center gap-1 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {copiedDiagram === 'wf' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDiagram === 'wf' ? 'Copié !' : 'Copier code Mermaid'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg overflow-x-auto text-[11px] font-mono">
                  {mermaidWorkflow}
                </pre>
              </div>

              {/* Figma Screens Inventory */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                  Inventaire des 16 Écrans Clés à Designer dans Figma :
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="p-2 bg-white rounded border border-slate-200">1. Authentification SSO TT & Choix de langue</div>
                  <div className="p-2 bg-white rounded border border-slate-200">2. Dashboard Personnel Employé TT</div>
                  <div className="p-2 bg-white rounded border border-slate-200">3. Wizard Dépôt Étape 1 : Choix de l'aide</div>
                  <div className="p-2 bg-white rounded border border-slate-200">4. Wizard Dépôt Étape 2 : Formulaire dynamique</div>
                  <div className="p-2 bg-white rounded border border-slate-200">5. Wizard Dépôt Étape 3 : Upload pièces chiffrées</div>
                  <div className="p-2 bg-white rounded border border-slate-200">6. Wizard Dépôt Étape 4 : Déclaration honneur & INPDP</div>
                  <div className="p-2 bg-white rounded border border-slate-200">7. Suivi Dossier : Timeline & Statuts</div>
                  <div className="p-2 bg-white rounded border border-slate-200">8. Messagerie sécurisée Agent &harr; Assistante</div>
                  <div className="p-2 bg-white rounded border border-slate-200">9. Console Service Social : File d'attente</div>
                  <div className="p-2 bg-white rounded border border-slate-200">10. Fiche Instruction : Vérification des pièces</div>
                  <div className="p-2 bg-white rounded border border-slate-200">11. Modale Demande de Complément avec note</div>
                  <div className="p-2 bg-white rounded border border-slate-200">12. Proposition de décision & Avis médico-social</div>
                  <div className="p-2 bg-white rounded border border-slate-200">13. Console Responsable : Tableau de validation</div>
                  <div className="p-2 bg-white rounded border border-slate-200">14. Visa final & Signature électronique du PV</div>
                  <div className="p-2 bg-white rounded border border-slate-200">15. Console Admin : Paramétrage barèmes & règles</div>
                  <div className="p-2 bg-white rounded border border-slate-200">16. Journal d'audit légal INPDP avec filtres</div>
                </div>
              </div>

              {/* Pre-flight Checklist */}
              <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/60 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Checklist Finale de Lancement en Production (Pre-Flight TT) :
                </h3>
                <div className="space-y-1 text-xs text-slate-800">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Dépôt préalable effectué auprès de l'INPDP pour le traitement de données sociales</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Intégration et validation du connecteur SSO avec l'Active Directory TT</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Clés de chiffrement AES-256 générées et stockées dans le coffre matériel KMS TT</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Tests d'intrusion et validation formelle de non-vulnérabilité par la Sécurité TT</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Session de formation animée pour l'ensemble des assistantes sociales des régions</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Campagne de communication interne RH (Emailing DG, intranet, affichage)</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
