import { 
  User, 
  AssistanceCategory, 
  AssistanceApplication, 
  AuditLog, 
  NotificationItem 
} from '../types';

export const mockUsers: User[] = [
  {
    id: 'usr-emp-1',
    matricule: 'TT-48291',
    name: 'Sami Ben Ammar',
    email: 'sami.benammar@tunisietelecom.tn',
    phone: '+216 98 123 456',
    role: 'employee',
    department: 'Direction Centrale des Réseaux & Systèmes',
    regionalDirection: 'District Tunis Centre',
    grade: 'Ingénieur Principal Télécoms',
    hireDate: '2016-04-12',
    familyStatus: 'married',
    childrenCount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-soc-1',
    matricule: 'TT-21045',
    name: 'Mme Leila Trabelsi',
    email: 'leila.trabelsi@tunisietelecom.tn',
    phone: '+216 71 001 234',
    role: 'social_worker',
    department: 'Direction du Capital Humain - Division Action Sociale',
    regionalDirection: 'Siège Social - Tunis',
    grade: 'Assistante Sociale Principale',
    hireDate: '2011-09-01',
    familyStatus: 'married',
    childrenCount: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-mgr-1',
    matricule: 'TT-11002',
    name: 'M. Mohamed Rekik',
    email: 'mohamed.rekik@tunisietelecom.tn',
    phone: '+216 71 001 890',
    role: 'social_manager',
    department: 'Direction Centrale des Ressources Humaines',
    regionalDirection: 'Siège Social - Tunis',
    grade: 'Chef de Division Action Sociale & Mutuelle',
    hireDate: '2005-02-15',
    familyStatus: 'married',
    childrenCount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-adm-1',
    matricule: 'TT-08914',
    name: 'Karim Mansouri',
    email: 'karim.mansouri@tunisietelecom.tn',
    phone: '+216 71 002 999',
    role: 'admin',
    department: 'Direction Sécurité SI & Infrastructures Digitales',
    regionalDirection: 'Siège Social - Tunis',
    grade: 'Administrateur Systèmes & Sécurité',
    hireDate: '2014-06-01',
    familyStatus: 'single',
    childrenCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  }
];

export const mockCategories: AssistanceCategory[] = [
  {
    id: 'cat-med',
    code: 'AIDE_MED',
    title: 'Aide Médicale & Soins Lourds',
    titleAr: 'مساعدة طبية وعلاج الحالات الدقيقة',
    description: 'Prise en charge partielle des interventions chirurgicales non conventionnées, appareillages médicaux ou pathologies chroniques nécessitant des soins onéreux.',
    iconName: 'Activity',
    ceilingAmountTND: 2500,
    requiresCommission: true,
    slaDays: 7,
    active: true,
    requiredDocuments: [
      {
        id: 'doc-med-1',
        code: 'RAPPORT_MEDICAL',
        name: 'Rapport médical sous pli confidentiel',
        description: 'Établi par le médecin traitant ou spécialiste certifié avec cachet.',
        isMandatory: true,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 10
      },
      {
        id: 'doc-med-2',
        code: 'DEVIS_OU_FACTURE',
        name: 'Devis estimatif ou factures acquittées',
        description: 'Éléments de dépenses détaillés de la clinique ou du prestataire de santé.',
        isMandatory: true,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5
      },
      {
        id: 'doc-med-3',
        code: 'BORDEREAU_MUTUELLE',
        name: 'Attestation de rejet ou décompte partiel de la mutuelle/CNAM',
        description: 'Justificatif indiquant le montant restant à la charge de l’employé.',
        isMandatory: true,
        acceptedFormats: ['pdf'],
        maxSizeMB: 5
      }
    ],
    customFields: [
      {
        id: 'cf-med-patient',
        label: 'Bénéficiaire des soins',
        type: 'select',
        options: ['Employé(e) lui-même', 'Conjoint(e)', 'Enfant à charge', 'Ascendant à charge'],
        required: true
      },
      {
        id: 'cf-med-etablissement',
        label: 'Établissement ou praticien traitant',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 'cat-sin',
    code: 'AIDE_SIN',
    title: 'Secours Exceptionnel & Sinistre',
    titleAr: 'إعانة استثنائية للكوارث والحوادث الطارئة',
    description: 'Soutien d’urgence accordé suite à un sinistre majeur (incendie domestique, inondation, catastrophe naturelle ou dommage corporel grave).',
    iconName: 'AlertTriangle',
    ceilingAmountTND: 3000,
    requiresCommission: true,
    slaDays: 4,
    active: true,
    requiredDocuments: [
      {
        id: 'doc-sin-1',
        code: 'CONSTAT_OFFICIEL',
        name: 'Procès-verbal de police / protection civile',
        description: 'Rapport officiel des autorités constatant la réalité et l’ampleur du sinistre.',
        isMandatory: true,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 10
      },
      {
        id: 'doc-sin-2',
        code: 'EVALUATION_DEGATS',
        name: 'Expertise / Devis de remise en état',
        description: 'Factures de réfection ou devis d’expert en assurance.',
        isMandatory: false,
        acceptedFormats: ['pdf'],
        maxSizeMB: 5
      }
    ]
  },
  {
    id: 'cat-fam',
    code: 'AIDE_FAM',
    title: 'Aide Sociale Familiale & Prêt Social',
    titleAr: 'مساعدة اجتماعية عائلية وقرض اجتماعي',
    description: 'Accompagnement financier remboursable ou non pour situation familiale précaire, handicap d’un ayant-droit ou événements familiaux critiques.',
    iconName: 'Users',
    ceilingAmountTND: 1800,
    requiresCommission: false,
    slaDays: 10,
    active: true,
    requiredDocuments: [
      {
        id: 'doc-fam-1',
        code: 'FICHE_FAMILIALE',
        name: 'Extrait de naissance ou fiche d’état civil',
        description: 'Fiche d’état civil récente (moins de 3 mois) attestant de la composition familiale.',
        isMandatory: true,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5
      },
      {
        id: 'doc-fam-2',
        code: 'JUSTIF_CHARGE',
        name: 'Justificatifs de charges exceptionnelles',
        description: 'Tout document étayant la situation financière délicate.',
        isMandatory: true,
        acceptedFormats: ['pdf'],
        maxSizeMB: 10
      }
    ]
  },
  {
    id: 'cat-sco',
    code: 'AIDE_SCO',
    title: 'Aide à la Scolarité & Rentrée',
    titleAr: 'إعانة العودة المدرسية والجامعية',
    description: 'Subvention forfaitaire annuelle pour la rentrée scolaire ou universitaire des enfants d’agents de Tunisie Telecom à charges multiples.',
    iconName: 'GraduationCap',
    ceilingAmountTND: 800,
    requiresCommission: false,
    slaDays: 5,
    active: true,
    requiredDocuments: [
      {
        id: 'doc-sco-1',
        code: 'CERTIF_SCOL',
        name: 'Certificat(s) d’inscription scolaire ou universitaire',
        description: 'Attestation de scolarité valide pour l’année académique en cours.',
        isMandatory: true,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5
      }
    ]
  },
  {
    id: 'cat-dec',
    code: 'AIDE_DEC',
    title: 'Aide Liée au Décès',
    titleAr: 'منحة الوفاة ومصاريف الجنازة',
    description: 'Secours immédiat débloqué lors du décès d’un conjoint, d’un enfant ou d’un parent à charge de l’employé TT.',
    iconName: 'HeartHandshake',
    ceilingAmountTND: 1500,
    requiresCommission: false,
    slaDays: 3,
    active: true,
    requiredDocuments: [
      {
        id: 'doc-dec-1',
        code: 'ACTE_DECES',
        name: 'Extrait d’acte de décès légalisé',
        description: 'Délivré par la municipalité.',
        isMandatory: true,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5
      },
      {
        id: 'doc-dec-2',
        code: 'LIEN_PARENTE',
        name: 'Justificatif du lien de parenté',
        description: 'Livret de famille ou acte de mariage/naissance.',
        isMandatory: true,
        acceptedFormats: ['pdf'],
        maxSizeMB: 5
      }
    ]
  },
  {
    id: 'cat-pon',
    code: 'AIDE_PON',
    title: 'Secours Social Ponctuel d’Urgence',
    titleAr: 'إسعاف اجتماعي ظرفي مستعجل',
    description: 'Aide d’extrême urgence examinée en procédure accélérée pour détresse sociale immédiate.',
    iconName: 'HelpCircle',
    ceilingAmountTND: 600,
    requiresCommission: false,
    slaDays: 2,
    active: true,
    requiredDocuments: [
      {
        id: 'doc-pon-1',
        code: 'LETTRE_EXPLICATIVE',
        name: 'Lettre de demande motivée manuscrite ou tapée',
        description: 'Explication circonstanciée des difficultés rencontrées.',
        isMandatory: true,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5
      }
    ]
  }
];

export const mockApplications: AssistanceApplication[] = [
  {
    id: 'app-001',
    referenceNumber: 'TT-SOC-2025-0142',
    employeeId: 'usr-emp-1',
    employeeName: 'Sami Ben Ammar',
    employeeMatricule: 'TT-48291',
    employeeDepartment: 'Direction Centrale des Réseaux & Systèmes',
    employeeRegion: 'District Tunis Centre',
    employeePhone: '+216 98 123 456',
    categoryId: 'cat-med',
    categoryCode: 'AIDE_MED',
    categoryTitle: 'Aide Médicale & Soins Lourds',
    requestedAmountTND: 1850,
    proposedAmountTND: 1500,
    subject: 'Intervention chirurgicale orthopédique - Enfant Yassine',
    situationDescription: 'Mon fils Yassine (8 ans) a subi une chirurgie orthopédique d’urgence non prise en charge intégralement par la mutuelle TT. Le reste à charge s’élève à 2120 TND selon le décompte ci-joint.',
    customFieldValues: {
      'cf-med-patient': 'Enfant à charge',
      'cf-med-etablissement': 'Clinique El Manar - Pr. Karray'
    },
    status: 'under_review',
    createdAt: '2025-05-12T09:30:00Z',
    updatedAt: '2025-05-14T11:15:00Z',
    assignedWorkerId: 'usr-soc-1',
    assignedWorkerName: 'Mme Leila Trabelsi',
    priority: 'high',
    dueDate: '2025-05-21',
    documents: [
      {
        id: 'doc-up-1',
        documentDefId: 'doc-med-1',
        fileName: 'rapport_medical_chirurgie_yassine.pdf',
        fileSize: 2450000,
        fileType: 'application/pdf',
        uploadedAt: '2025-05-12T09:28:00Z',
        status: 'approved'
      },
      {
        id: 'doc-up-2',
        documentDefId: 'doc-med-2',
        fileName: 'facture_clinique_el_manar.pdf',
        fileSize: 1820000,
        fileType: 'application/pdf',
        uploadedAt: '2025-05-12T09:29:00Z',
        status: 'approved'
      },
      {
        id: 'doc-up-3',
        documentDefId: 'doc-med-3',
        fileName: 'decompte_mutuelle_reste_a_charge.pdf',
        fileSize: 940000,
        fileType: 'application/pdf',
        uploadedAt: '2025-05-12T09:30:00Z',
        status: 'approved'
      }
    ],
    comments: [
      {
        id: 'cmt-1',
        authorId: 'usr-soc-1',
        authorName: 'Mme Leila Trabelsi',
        authorRole: 'social_worker',
        isInternalNote: true,
        content: 'Dossier bien documenté. Reste à charge vérifié auprès de la mutuelle TT (décompte conforme). Proposition d’octroi d’une aide de 1500 TND selon le barème de la commission sociale.',
        createdAt: '2025-05-14T11:10:00Z'
      },
      {
        id: 'cmt-2',
        authorId: 'usr-soc-1',
        authorName: 'Mme Leila Trabelsi',
        authorRole: 'social_worker',
        isInternalNote: false,
        content: 'Bonjour M. Ben Ammar, votre dossier est en cours d’examen approfondi par nos services. Les pièces médicales sont bien reçues.',
        createdAt: '2025-05-14T11:15:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-1',
        fromStatus: 'draft',
        toStatus: 'submitted',
        changedBy: 'usr-emp-1',
        changedByName: 'Sami Ben Ammar',
        changedByRole: 'employee',
        timestamp: '2025-05-12T09:30:00Z',
        comment: 'Dépôt initial de la demande via le portail'
      },
      {
        id: 'sh-2',
        fromStatus: 'submitted',
        toStatus: 'under_review',
        changedBy: 'usr-soc-1',
        changedByName: 'Mme Leila Trabelsi',
        changedByRole: 'social_worker',
        timestamp: '2025-05-13T08:45:00Z',
        comment: 'Prise en charge du dossier par l’assistante sociale'
      }
    ]
  },
  {
    id: 'app-002',
    referenceNumber: 'TT-SOC-2025-0118',
    employeeId: 'usr-emp-1',
    employeeName: 'Sami Ben Ammar',
    employeeMatricule: 'TT-48291',
    employeeDepartment: 'Direction Centrale des Réseaux & Systèmes',
    employeeRegion: 'District Tunis Centre',
    employeePhone: '+216 98 123 456',
    categoryId: 'cat-sco',
    categoryCode: 'AIDE_SCO',
    categoryTitle: 'Aide à la Scolarité & Rentrée',
    requestedAmountTND: 600,
    finalAmountTND: 600,
    subject: 'Aide à la rentrée scolaire - Année 2024/2025',
    situationDescription: 'Demande de subvention pour la rentrée de mes deux enfants scolarisés au collège et à l’école primaire.',
    status: 'approved',
    createdAt: '2024-09-15T14:00:00Z',
    updatedAt: '2024-09-22T16:30:00Z',
    assignedWorkerId: 'usr-soc-1',
    assignedWorkerName: 'Mme Leila Trabelsi',
    priority: 'normal',
    documents: [
      {
        id: 'doc-up-10',
        documentDefId: 'doc-sco-1',
        fileName: 'certificats_scolarite_2024_2025.pdf',
        fileSize: 1200000,
        fileType: 'application/pdf',
        uploadedAt: '2024-09-15T14:00:00Z',
        status: 'approved'
      }
    ],
    comments: [],
    statusHistory: [
      {
        id: 'sh-10',
        fromStatus: 'draft',
        toStatus: 'submitted',
        changedBy: 'usr-emp-1',
        changedByName: 'Sami Ben Ammar',
        changedByRole: 'employee',
        timestamp: '2024-09-15T14:00:00Z'
      },
      {
        id: 'sh-11',
        fromStatus: 'submitted',
        toStatus: 'approved',
        changedBy: 'usr-mgr-1',
        changedByName: 'M. Mohamed Rekik',
        changedByRole: 'social_manager',
        timestamp: '2024-09-22T16:30:00Z',
        comment: 'Validation commission rentrée scolaire TT'
      }
    ],
    decision: {
      id: 'dec-002',
      applicationId: 'app-002',
      decidedBy: 'usr-mgr-1',
      decidedByName: 'M. Mohamed Rekik',
      decision: 'approved',
      approvedAmountTND: 600,
      motivation: 'Dossier conforme aux critères d’attribution de l’aide rentrée scolaire.',
      decisionDate: '2024-09-22',
      pvNumber: 'PV-COM-2024/09',
      officialDocumentGenerated: true
    }
  },
  {
    id: 'app-003',
    referenceNumber: 'TT-SOC-2025-0155',
    employeeId: 'usr-emp-2',
    employeeName: 'Fatma Chaabane',
    employeeMatricule: 'TT-39182',
    employeeDepartment: 'Direction Commerciale - Espace TT Sousse',
    employeeRegion: 'Direction Régionale Sousse',
    employeePhone: '+216 97 889 012',
    categoryId: 'cat-sin',
    categoryCode: 'AIDE_SIN',
    categoryTitle: 'Secours Exceptionnel & Sinistre',
    requestedAmountTND: 2800,
    subject: 'Inondation domicile suite fortes pluies à Sousse',
    situationDescription: 'Dégâts importants constatés dans le rez-de-chaussée de mon domicile (mobilier, électroménager et cloisons endommagés suite aux intempéries d’avril).',
    status: 'info_requested',
    createdAt: '2025-05-08T10:20:00Z',
    updatedAt: '2025-05-13T15:40:00Z',
    assignedWorkerId: 'usr-soc-1',
    assignedWorkerName: 'Mme Leila Trabelsi',
    priority: 'urgent',
    missingItemsNote: 'Veuillez joindre l’attestation de constat de la Protection Civile ou du commissariat local, ainsi que des photographies probantes des dommages subis.',
    documents: [
      {
        id: 'doc-up-21',
        documentDefId: 'doc-sin-2',
        fileName: 'devis_travaux_maconnerie.pdf',
        fileSize: 850000,
        fileType: 'application/pdf',
        uploadedAt: '2025-05-08T10:15:00Z',
        status: 'approved'
      }
    ],
    comments: [
      {
        id: 'cmt-21',
        authorId: 'usr-soc-1',
        authorName: 'Mme Leila Trabelsi',
        authorRole: 'social_worker',
        isInternalNote: false,
        content: 'Chère collègue, pour instruire votre demande auprès de la commission centrale, le rapport officiel de la Protection Civile est strictement requis par le règlement intérieur.',
        createdAt: '2025-05-13T15:40:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-20',
        fromStatus: 'submitted',
        toStatus: 'under_review',
        changedBy: 'usr-soc-1',
        changedByName: 'Mme Leila Trabelsi',
        changedByRole: 'social_worker',
        timestamp: '2025-05-09T09:00:00Z'
      },
      {
        id: 'sh-21',
        fromStatus: 'under_review',
        toStatus: 'info_requested',
        changedBy: 'usr-soc-1',
        changedByName: 'Mme Leila Trabelsi',
        changedByRole: 'social_worker',
        timestamp: '2025-05-13T15:40:00Z',
        comment: 'Demande de complément : PV de la protection civile manquant'
      }
    ]
  },
  {
    id: 'app-004',
    referenceNumber: 'TT-SOC-2025-0160',
    employeeId: 'usr-emp-3',
    employeeName: 'Nabil Zied',
    employeeMatricule: 'TT-52019',
    employeeDepartment: 'Direction Opérations Télécoms Sfax',
    employeeRegion: 'Direction Régionale Sfax',
    employeePhone: '+216 96 333 444',
    categoryId: 'cat-fam',
    categoryCode: 'AIDE_FAM',
    categoryTitle: 'Aide Sociale Familiale & Prêt Social',
    requestedAmountTND: 1800,
    proposedAmountTND: 1600,
    subject: 'Aide appareillage auditif enfant à charge',
    situationDescription: 'Mon fils aîné nécessite le renouvellement de ses deux prothèses auditives bilatérales. Dépassement important du plafond conventionnel.',
    status: 'pending_validation',
    createdAt: '2025-05-02T11:00:00Z',
    updatedAt: '2025-05-14T09:20:00Z',
    assignedWorkerId: 'usr-soc-1',
    assignedWorkerName: 'Mme Leila Trabelsi',
    priority: 'normal',
    documents: [
      {
        id: 'doc-up-31',
        documentDefId: 'doc-fam-1',
        fileName: 'etat_civil_famille_zied.pdf',
        fileSize: 920000,
        fileType: 'application/pdf',
        uploadedAt: '2025-05-02T11:00:00Z',
        status: 'approved'
      },
      {
        id: 'doc-up-32',
        documentDefId: 'doc-fam-2',
        fileName: 'facture_prothese_audioprothesiste.pdf',
        fileSize: 1420000,
        fileType: 'application/pdf',
        uploadedAt: '2025-05-02T11:05:00Z',
        status: 'approved'
      }
    ],
    comments: [
      {
        id: 'cmt-31',
        authorId: 'usr-soc-1',
        authorName: 'Mme Leila Trabelsi',
        authorRole: 'social_worker',
        isInternalNote: true,
        content: 'Dossier complet et vérifié. Avis très favorable émis pour un montant de 1600 TND. Soumis pour signature de M. le Responsable.',
        createdAt: '2025-05-14T09:20:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-30',
        fromStatus: 'submitted',
        toStatus: 'under_review',
        changedBy: 'usr-soc-1',
        changedByName: 'Mme Leila Trabelsi',
        changedByRole: 'social_worker',
        timestamp: '2025-05-03T10:00:00Z'
      },
      {
        id: 'sh-31',
        fromStatus: 'under_review',
        toStatus: 'pending_validation',
        changedBy: 'usr-soc-1',
        changedByName: 'Mme Leila Trabelsi',
        changedByRole: 'social_worker',
        timestamp: '2025-05-14T09:20:00Z',
        comment: 'Instruction terminée, transmission au Chef de Division pour décision finale'
      }
    ]
  },
  {
    id: 'app-005',
    referenceNumber: 'TT-SOC-2025-0130',
    employeeId: 'usr-emp-4',
    employeeName: 'Mounir Ghorbel',
    employeeMatricule: 'TT-34190',
    employeeDepartment: 'Direction Générale - Sécurité & Patrimoine',
    employeeRegion: 'Siège Social - Tunis',
    employeePhone: '+216 98 777 888',
    categoryId: 'cat-dec',
    categoryCode: 'AIDE_DEC',
    categoryTitle: 'Aide Liée au Décès',
    requestedAmountTND: 1500,
    finalAmountTND: 1500,
    subject: 'Décès conjoint',
    situationDescription: 'Secours décès suite à la disparition tragique de mon épouse.',
    status: 'closed',
    createdAt: '2025-04-10T08:00:00Z',
    updatedAt: '2025-04-15T10:00:00Z',
    assignedWorkerId: 'usr-soc-1',
    assignedWorkerName: 'Mme Leila Trabelsi',
    priority: 'urgent',
    documents: [
      {
        id: 'doc-up-41',
        documentDefId: 'doc-dec-1',
        fileName: 'acte_deces_legalise.pdf',
        fileSize: 760000,
        fileType: 'application/pdf',
        uploadedAt: '2025-04-10T08:00:00Z',
        status: 'approved'
      }
    ],
    comments: [],
    statusHistory: [
      {
        id: 'sh-40',
        fromStatus: 'submitted',
        toStatus: 'approved',
        changedBy: 'usr-mgr-1',
        changedByName: 'M. Mohamed Rekik',
        changedByRole: 'social_manager',
        timestamp: '2025-04-12T11:00:00Z'
      },
      {
        id: 'sh-41',
        fromStatus: 'approved',
        toStatus: 'closed',
        changedBy: 'usr-soc-1',
        changedByName: 'Mme Leila Trabelsi',
        changedByRole: 'social_worker',
        timestamp: '2025-04-15T10:00:00Z',
        comment: 'Virement bancaire exécuté par la trésorerie TT. Dossier archivé.'
      }
    ],
    decision: {
      id: 'dec-005',
      applicationId: 'app-005',
      decidedBy: 'usr-mgr-1',
      decidedByName: 'M. Mohamed Rekik',
      decision: 'approved',
      approvedAmountTND: 1500,
      motivation: 'Attribution de l’allocation d’urgence décès selon statut TT.',
      decisionDate: '2025-04-12',
      pvNumber: 'URG-DEC-2025-04',
      officialDocumentGenerated: true
    }
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-101',
    timestamp: '2025-05-14T11:15:22Z',
    userId: 'usr-soc-1',
    userName: 'Mme Leila Trabelsi',
    userRole: 'social_worker',
    action: 'ADD_COMMENT_AND_PROPOSAL',
    resource: 'AssistanceApplication',
    resourceId: 'TT-SOC-2025-0142',
    ipAddress: '10.220.14.88 (Intranet TT)',
    details: 'Ajout note interne et proposition montant 1500 TND pour Sami Ben Ammar',
    severity: 'info'
  },
  {
    id: 'aud-102',
    timestamp: '2025-05-14T09:20:05Z',
    userId: 'usr-soc-1',
    userName: 'Mme Leila Trabelsi',
    userRole: 'social_worker',
    action: 'STATUS_CHANGE',
    resource: 'AssistanceApplication',
    resourceId: 'TT-SOC-2025-0160',
    ipAddress: '10.220.14.88 (Intranet TT)',
    details: 'Statut changé de UNDER_REVIEW à PENDING_VALIDATION',
    severity: 'info'
  },
  {
    id: 'aud-103',
    timestamp: '2025-05-13T15:40:12Z',
    userId: 'usr-soc-1',
    userName: 'Mme Leila Trabelsi',
    userRole: 'social_worker',
    action: 'REQUEST_DOCUMENT_SUPPLEMENT',
    resource: 'AssistanceApplication',
    resourceId: 'TT-SOC-2025-0155',
    ipAddress: '10.220.14.88 (Intranet TT)',
    details: 'Demande de pièce complémentaire notifiée à Fatma Chaabane (PV Protection Civile)',
    severity: 'info'
  },
  {
    id: 'aud-104',
    timestamp: '2025-05-12T09:30:45Z',
    userId: 'usr-emp-1',
    userName: 'Sami Ben Ammar',
    userRole: 'employee',
    action: 'APPLICATION_CREATE',
    resource: 'AssistanceApplication',
    resourceId: 'TT-SOC-2025-0142',
    ipAddress: '10.110.42.12 (Intranet Tunis Centre)',
    details: 'Création et téléversement de 3 pièces justificatives chiffrées AES-256',
    severity: 'info'
  },
  {
    id: 'aud-105',
    timestamp: '2025-05-11T18:02:10Z',
    userId: 'usr-adm-1',
    userName: 'Karim Mansouri',
    userRole: 'admin',
    action: 'SECURITY_KEY_ROTATION',
    resource: 'Vault / HSM',
    resourceId: 'KMS-TT-SOC-DATA-01',
    ipAddress: '10.200.1.5 (Zone Sécurisée SOC TT)',
    details: 'Rotation semestrielle réussie de la clé de chiffrement des dossiers sociaux (Conformité INPDP)',
    severity: 'security'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-emp-1',
    title: 'Mise à jour de votre dossier médical',
    message: 'Votre assistante sociale Mme Leila Trabelsi a pris en charge votre demande TT-SOC-2025-0142.',
    timestamp: 'Il y a 2 heures',
    read: false,
    type: 'message',
    applicationId: 'app-001'
  },
  {
    id: 'notif-2',
    userId: 'usr-emp-1',
    title: 'Dossier validé et payé',
    message: 'Votre aide à la scolarité TT-SOC-2025-0118 a été validée pour un montant de 600 TND.',
    timestamp: 'Septembre 2024',
    read: true,
    type: 'approval',
    applicationId: 'app-002'
  },
  {
    id: 'notif-3',
    userId: 'usr-soc-1',
    title: 'Nouveau dossier soumis',
    message: 'Nabil Zied a soumis une demande d’aide familiale (TT-SOC-2025-0160).',
    timestamp: 'Hier',
    read: false,
    type: 'status_change',
    applicationId: 'app-004'
  },
  {
    id: 'notif-4',
    userId: 'usr-mgr-1',
    title: 'Dossier en attente de visa final',
    message: 'Le dossier TT-SOC-2025-0160 nécessite votre validation formelle (Montant: 1600 TND).',
    timestamp: 'Aujourd’hui',
    read: false,
    type: 'status_change',
    applicationId: 'app-004'
  }
];
