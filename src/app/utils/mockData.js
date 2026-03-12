// ========================================
// 📊 DONNÉES MOCK POUR L'APPLICATION
// ========================================

// Utilisateurs mock avec différents rôles
export const mockUsers = [
  {
    id: 1,
    email: "admin@company.com",
    password: "admin123",
    name: "Sophie Martin",
    role: "admin",
    status: "active",
    createdAt: "2025-01-15",
    lastLogin: "2026-03-03"
  },
  {
    id: 2,
    email: "manager@company.com",
    password: "manager123",
    name: "Pierre Dubois",
    role: "manager",
    status: "active",
    createdAt: "2025-02-10",
    lastLogin: "2026-03-02"
  },
  {
    id: 3,
    email: "comptable@company.com",
    password: "comptable123",
    name: "Marie Lefebvre",
    role: "comptable",
    status: "active",
    createdAt: "2025-03-05",
    lastLogin: "2026-03-03"
  },
  {
    id: 4,
    email: "comptable2@company.com",
    password: "comptable123",
    name: "Lucas Bernard",
    role: "comptable",
    status: "active",
    createdAt: "2025-06-20",
    lastLogin: "2026-03-01"
  },
  {
    id: 5,
    email: "old.user@company.com",
    password: "user123",
    name: "Ancien Utilisateur",
    role: "comptable",
    status: "inactive",
    createdAt: "2024-08-12",
    lastLogin: "2025-12-15"
  }
];

// Documents mock avec différents statuts
export const mockDocuments = [
  {
    id: 1,
    name: "Facture_Fournisseur_001.pdf",
    type: "Facture Achat",
    status: "validé",
    client: "SARL TechnoPlus",
    amount: 2450.80,
    date: "2026-02-28",
    reference: "FA-2026-001",
    confidence: 0.96,
    uploadedBy: 3,
    uploadedByName: "Marie Lefebvre",
    uploadedAt: "2026-03-01 09:15",
    validatedBy: 2,
    validatedAt: "2026-03-01 14:30",
    ocrText: "FACTURE N° FA-2026-001\nSARL TechnoPlus\n123 Rue de la Tech, 75001 Paris\nDate: 28/02/2026\nMontant HT: 2042.33 €\nTVA (20%): 408.47 €\nMontant TTC: 2450.80 €",
    fileUrl: "/mock/facture_001.pdf"
  },
  {
    id: 2,
    name: "Bon_Commande_BC2026_045.pdf",
    type: "Bon de Commande",
    status: "en_cours",
    client: "Industries Martin SA",
    amount: 15600.00,
    date: "2026-03-02",
    reference: "BC-2026-045",
    confidence: 0.88,
    uploadedBy: 3,
    uploadedByName: "Marie Lefebvre",
    uploadedAt: "2026-03-03 08:30",
    validatedBy: null,
    validatedAt: null,
    ocrText: "BON DE COMMANDE N° BC-2026-045\nIndustries Martin SA\n456 Avenue Industrielle, 69000 Lyon\nDate: 02/03/2026\nMontant Total: 15,600.00 €",
    fileUrl: "/mock/bon_commande_045.pdf"
  },
  {
    id: 3,
    name: "Facture_Client_VTE_102.pdf",
    type: "Facture Vente",
    status: "dans_bc",
    client: "SAS Innovations",
    amount: 8920.50,
    date: "2026-02-25",
    reference: "VTE-2026-102",
    confidence: 0.98,
    uploadedBy: 4,
    uploadedByName: "Lucas Bernard",
    uploadedAt: "2026-02-26 10:45",
    validatedBy: 2,
    validatedAt: "2026-02-27 09:20",
    sentToBCAt: "2026-02-27 09:25",
    ocrText: "FACTURE DE VENTE N° VTE-2026-102\nClient: SAS Innovations\nDate: 25/02/2026\nMontant HT: 7433.75 €\nTVA (20%): 1486.75 €\nTotal TTC: 8920.50 €",
    fileUrl: "/mock/facture_vente_102.pdf"
  },
  {
    id: 4,
    name: "Contrat_Prestation_2026.pdf",
    type: "Contrat",
    status: "validé",
    client: "Groupe Excellence",
    amount: 45000.00,
    date: "2026-01-15",
    reference: "CTR-2026-008",
    confidence: 0.92,
    uploadedBy: 3,
    uploadedByName: "Marie Lefebvre",
    uploadedAt: "2026-01-16 11:20",
    validatedBy: 2,
    validatedAt: "2026-01-17 15:45",
    ocrText: "CONTRAT DE PRESTATION DE SERVICES\nN° CTR-2026-008\nGroupe Excellence\nDate de signature: 15/01/2026\nMontant annuel: 45,000.00 €",
    fileUrl: "/mock/contrat_008.pdf"
  },
  {
    id: 5,
    name: "Facture_Telecom_Fevrier.pdf",
    type: "Facture Achat",
    status: "rejeté",
    client: "Orange Business",
    amount: 340.20,
    date: "2026-02-01",
    reference: "TELEC-2026-02",
    confidence: 0.65,
    uploadedBy: 4,
    uploadedByName: "Lucas Bernard",
    uploadedAt: "2026-03-02 16:10",
    validatedBy: 2,
    validatedAt: "2026-03-02 17:30",
    rejectionReason: "Document illisible, qualité insuffisante pour l'extraction OCR",
    ocrText: "Facture [texte illisible]\nOrange Business\n[données partiellement extraites]",
    fileUrl: "/mock/facture_telecom.pdf"
  },
  {
    id: 6,
    name: "Facture_Electricite_Mars.pdf",
    type: "Facture Achat",
    status: "en_cours",
    client: "EDF Entreprises",
    amount: 1250.30,
    date: "2026-03-01",
    reference: "ELEC-2026-03",
    confidence: 0.94,
    uploadedBy: 3,
    uploadedByName: "Marie Lefebvre",
    uploadedAt: "2026-03-03 07:45",
    validatedBy: null,
    validatedAt: null,
    ocrText: "FACTURE ÉLECTRICITÉ\nEDF Entreprises\nPériode: Mars 2026\nConsommation: 2,150 kWh\nMontant TTC: 1,250.30 €",
    fileUrl: "/mock/facture_elec.pdf"
  },
  {
    id: 7,
    name: "BC_Fournitures_Bureau.pdf",
    type: "Bon de Commande",
    status: "dans_bc",
    client: "Office Depot",
    amount: 680.45,
    date: "2026-02-20",
    reference: "BC-2026-042",
    confidence: 0.97,
    uploadedBy: 4,
    uploadedByName: "Lucas Bernard",
    uploadedAt: "2026-02-21 09:00",
    validatedBy: 2,
    validatedAt: "2026-02-21 10:15",
    sentToBCAt: "2026-02-21 10:20",
    ocrText: "BON DE COMMANDE\nOffice Depot\nArticles de bureau divers\nMontant: 680.45 €",
    fileUrl: "/mock/bc_042.pdf"
  },
  {
    id: 8,
    name: "Facture_Maintenance_Logiciels.pdf",
    type: "Facture Achat",
    status: "validé",
    client: "Microsoft France",
    amount: 3200.00,
    date: "2026-02-15",
    reference: "MAINT-2026-02",
    confidence: 0.99,
    uploadedBy: 3,
    uploadedByName: "Marie Lefebvre",
    uploadedAt: "2026-02-16 13:30",
    validatedBy: 2,
    validatedAt: "2026-02-16 15:00",
    ocrText: "FACTURE MAINTENANCE\nMicrosoft France\nLicences Office 365 Entreprise\nPériode: Février 2026\nMontant: 3,200.00 €",
    fileUrl: "/mock/maint_soft.pdf"
  }
];

// Métriques pour le dashboard Manager
export const mockMetrics = {
  volumeMensuel: 127,
  volumeMois: "Mars 2026",
  parStatut: {
    en_cours: 24,
    validé: 58,
    rejeté: 12,
    dans_bc: 33
  },
  parType: {
    "Facture Achat": 65,
    "Facture Vente": 28,
    "Bon de Commande": 23,
    "Contrat": 11
  },
  montantTotal: 245680.75,
  montantValidé: 178920.30,
  tauxValidation: 72.8,
  tempsMoyenTraitement: 4.2 // heures
};

// Logs d'audit mock
export const mockAuditLogs = [
  {
    id: 1,
    timestamp: "2026-03-03 08:30:15",
    user: "Marie Lefebvre",
    userId: 3,
    action: "Upload document",
    document: "Bon_Commande_BC2026_045.pdf",
    documentId: 2,
    details: "Document uploadé avec succès"
  },
  {
    id: 2,
    timestamp: "2026-03-03 07:45:22",
    user: "Marie Lefebvre",
    userId: 3,
    action: "Upload document",
    document: "Facture_Electricite_Mars.pdf",
    documentId: 6,
    details: "Document uploadé avec succès"
  },
  {
    id: 3,
    timestamp: "2026-03-02 17:30:08",
    user: "Pierre Dubois",
    userId: 2,
    action: "Rejet document",
    document: "Facture_Telecom_Fevrier.pdf",
    documentId: 5,
    details: "Raison: Document illisible, qualité insuffisante pour l'extraction OCR"
  },
  {
    id: 4,
    timestamp: "2026-03-02 16:10:45",
    user: "Lucas Bernard",
    userId: 4,
    action: "Upload document",
    document: "Facture_Telecom_Fevrier.pdf",
    documentId: 5,
    details: "Document uploadé avec succès"
  },
  {
    id: 5,
    timestamp: "2026-03-01 14:30:12",
    user: "Pierre Dubois",
    userId: 2,
    action: "Validation document",
    document: "Facture_Fournisseur_001.pdf",
    documentId: 1,
    details: "Document validé et prêt pour envoi vers Business Central"
  },
  {
    id: 6,
    timestamp: "2026-03-01 09:15:33",
    user: "Marie Lefebvre",
    userId: 3,
    action: "Upload document",
    document: "Facture_Fournisseur_001.pdf",
    documentId: 1,
    details: "Document uploadé avec succès"
  },
  {
    id: 7,
    timestamp: "2026-02-27 09:25:41",
    user: "Pierre Dubois",
    userId: 2,
    action: "Envoi vers Business Central",
    document: "Facture_Client_VTE_102.pdf",
    documentId: 3,
    details: "Document envoyé avec succès vers Microsoft Business Central"
  },
  {
    id: 8,
    timestamp: "2026-02-27 09:20:18",
    user: "Pierre Dubois",
    userId: 2,
    action: "Validation document",
    document: "Facture_Client_VTE_102.pdf",
    documentId: 3,
    details: "Document validé et prêt pour envoi vers Business Central"
  },
  {
    id: 9,
    timestamp: "2026-02-26 10:45:55",
    user: "Lucas Bernard",
    userId: 4,
    action: "Upload document",
    document: "Facture_Client_VTE_102.pdf",
    documentId: 3,
    details: "Document uploadé avec succès"
  },
  {
    id: 10,
    timestamp: "2026-02-21 10:20:33",
    user: "Pierre Dubois",
    userId: 2,
    action: "Envoi vers Business Central",
    document: "BC_Fournitures_Bureau.pdf",
    documentId: 7,
    details: "Document envoyé avec succès vers Microsoft Business Central"
  },
  {
    id: 11,
    timestamp: "2026-02-21 10:15:22",
    user: "Pierre Dubois",
    userId: 2,
    action: "Validation document",
    document: "BC_Fournitures_Bureau.pdf",
    documentId: 7,
    details: "Document validé et prêt pour envoi vers Business Central"
  },
  {
    id: 12,
    timestamp: "2026-02-21 09:00:11",
    user: "Lucas Bernard",
    userId: 4,
    action: "Upload document",
    document: "BC_Fournitures_Bureau.pdf",
    documentId: 7,
    details: "Document uploadé avec succès"
  },
  {
    id: 13,
    timestamp: "2026-02-16 15:00:44",
    user: "Pierre Dubois",
    userId: 2,
    action: "Validation document",
    document: "Facture_Maintenance_Logiciels.pdf",
    documentId: 8,
    details: "Document validé et prêt pour envoi vers Business Central"
  },
  {
    id: 14,
    timestamp: "2026-02-16 13:30:29",
    user: "Marie Lefebvre",
    userId: 3,
    action: "Upload document",
    document: "Facture_Maintenance_Logiciels.pdf",
    documentId: 8,
    details: "Document uploadé avec succès"
  },
  {
    id: 15,
    timestamp: "2026-01-17 15:45:37",
    user: "Pierre Dubois",
    userId: 2,
    action: "Validation document",
    document: "Contrat_Prestation_2026.pdf",
    documentId: 4,
    details: "Document validé et prêt pour envoi vers Business Central"
  }
];

// Mapping des statuts pour l'affichage
export const statusLabels = {
  en_cours: "En cours",
  validé: "Validé",
  rejeté: "Rejeté",
  dans_bc: "Dans BC"
};

// Mapping des couleurs par statut
export const statusColors = {
  en_cours: "bg-blue-100 text-blue-800",
  validé: "bg-green-100 text-green-800",
  rejeté: "bg-red-100 text-red-800",
  dans_bc: "bg-purple-100 text-purple-800"
};

// Mapping des rôles pour l'affichage
export const roleLabels = {
  admin: "Administrateur",
  manager: "Manager",
  comptable: "Comptable"
};

// Couleurs par niveau de confiance IA
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.9) return "text-green-600 bg-green-50";
  if (confidence >= 0.7) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
};

export const getConfidenceLabel = (confidence) => {
  if (confidence >= 0.9) return "Élevée";
  if (confidence >= 0.7) return "Moyenne";
  return "Faible";
};
