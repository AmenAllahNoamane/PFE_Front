import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import documentService from '../../api/documentService';

import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Send, 
  AlertTriangle,
  History,
  Edit2,
  Save,
  X as CloseIcon,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
// ========================================
// 📄 PAGE DÉTAIL DOCUMENT - VERSION DYNAMIQUE
// ========================================
// Adapté pour votre base de données et extraction dynamique
// Affiche les champs selon le type de document (bcFields, bcLines)

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ========================================
  // ÉTATS
  // ========================================
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [analyse, setAnalyse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Données du formulaire (bcFields)
  const [bcFields, setBcFields] = useState({});
  
  // Lignes du document (bcLines)
  const [bcLines, setBcLines] = useState([]);
  
  // Modals
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Ligne en cours d'édition
  const [editingLine, setEditingLine] = useState(null);

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================
  useEffect(() => {
    loadDocumentData();
  }, [id]);

  const loadDocumentData = async () => {
    try {
      setLoading(true);
      
      // Appel API pour charger le document + analyse
      const data = await documentService.getDocumentById(id);
      
      
      
    setDocument(data.document || data);
    setAnalyse(data.analyse || data.analyseDocument);
      
      // Initialiser les champs BC
      if (data.analyse?.bcFields) {
        setBcFields(data.analyse.bcFields);
      }
      
      // Initialiser les lignes BC
      if (data.analyse?.bcLines) {
        setBcLines(data.analyse.bcLines)
      }
      
    } catch (error) {
      console.error('Erreur chargement document:', error);
      toast.error('Impossible de charger le document');
      
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // NAVIGATION
  // ========================================
  const getBackPath = () => {
    if (user.role === 'ADMIN') return '/manager/documents';
    if (user.role === 'MANAGER') return '/manager/documents';
    if (user.role === 'COMPTABLE') return '/comptable/documents';
    return '/';
  };

  // ========================================
  // GESTION DES SCORES
  // ========================================
  const getScoreColor = (score) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 0.9) return 'bg-green-100 text-green-800';
    if (score >= 0.7) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreLabel = (score) => {
    if (!score) return 'Non évalué';
    if (score >= 0.9) return 'Élevée';
    if (score >= 0.7) return 'Moyenne';
    return 'Faible';
  };

  const canEdit = () => {
    // Édition possible si score < 0.7 ou si l'utilisateur force l'édition
    return analyse?.scoreGlobal < 0.7 || editMode;
  };

  // ========================================
  // GESTION DU FORMULAIRE
  // ========================================
  const handleBcFieldChange = (fieldName, value) => {
    setBcFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleLineChange = (index, fieldName, value) => {
    const updatedLines = [...bcLines];
    updatedLines[index] = {
      ...updatedLines[index],
      [fieldName]: value
    };
    setBcLines(updatedLines);
  };

  const addLine = () => {
    const newLine = {
      sequence: bcLines.length + 1,
      itemId: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      discountPercent: 0,
      taxPercent: 0,
      lineAmountExcludingTax: 0,
      lineAmountIncludingTax: 0
    };
    setBcLines([...bcLines, newLine]);
  };

  const removeLine = (index) => {
    const updatedLines = bcLines.filter((_, i) => i !== index);
    // Réorganiser les sequences
    updatedLines.forEach((line, i) => {
      line.sequence = i + 1;
    });
    setBcLines(updatedLines);
  };

  // ========================================
  // ACTIONS : VALIDER / REJETER / ENVOYER BC
  // ========================================
  
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/documents/${id}/analyse`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bcFields,
          bcLines
        })
      });

      if (!response.ok) throw new Error('Erreur sauvegarde');

      toast.success('Modifications enregistrées');
      setEditMode(false);
      loadDocumentData(); // Recharger les données
      
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleValidate = async () => {
    if (!window.confirm('Valider ce document ?')) return;

    try {
      const response = await fetch(`/api/documents/${id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bcFields,
          bcLines,
          validatedBy: user.id
        })
      });

      if (!response.ok) throw new Error('Erreur validation');

      toast.success('Document validé avec succès');
      navigate(getBackPath());
      
    } catch (error) {
      console.error('Erreur validation:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const handleReject = () => {
    setShowRejectionModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez indiquer une raison de rejet');
      return;
    }

    try {
      const response = await fetch(`/api/documents/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: rejectionReason,
          rejectedBy: user.id
        })
      });

      if (!response.ok) throw new Error('Erreur rejet');

      toast.success('Document rejeté');
      setShowRejectionModal(false);
      navigate(getBackPath());
      
    } catch (error) {
      console.error('Erreur rejet:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  const handleSendToBC = async () => {
    if (!window.confirm('Envoyer ce document vers Business Central ?')) return;

    try {
      const response = await fetch(`/api/documents/${id}/send-to-bc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Erreur envoi BC');

      toast.success('Document envoyé vers Business Central');
      navigate(getBackPath());
      
    } catch (error) {
      console.error('Erreur envoi BC:', error);
      toast.error('Erreur lors de l\'envoi vers BC');
    }
  };

  // ========================================
  // MAPPING DES STATUTS
  // ========================================
  const statutLabels = {
    'EN_COURS': 'En cours',
    'TRAITEMENT': 'En traitement',
    'VALIDE': 'Validé',
    'REJETE': 'Rejeté',
    'ENVOYE_BC': 'Envoyé BC'
  };

  const statutColors = {
    'EN_COURS': 'bg-blue-100 text-blue-800',
    'TRAITEMENT': 'bg-purple-100 text-purple-800',
    'VALIDE': 'bg-green-100 text-green-800',
    'REJETE': 'bg-red-100 text-red-800',
    'ENVOYE_BC': 'bg-indigo-100 text-indigo-800'
  };

  // ========================================
  // CONFIGURATION DES CHAMPS PAR TYPE
  // ========================================
  const getFieldsConfig = () => {
    const type = analyse?.typeDocument;
    
    // Configuration des champs selon le type de document
    const configs = {
      'Facture Achat': [
        { key: 'vendorInvoiceNumber', label: 'N° Facture', type: 'text' },
        { key: 'vendorNumber', label: 'N° Fournisseur', type: 'text' },
        { key: 'vendorName', label: 'Nom Fournisseur', type: 'text' },
        { key: 'invoiceDate', label: 'Date Facture', type: 'date' },
        { key: 'dueDate', label: 'Date Échéance', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' },
        { key: 'discountAmount', label: 'Remise', type: 'number' }
      ],
      'Facture Vente': [
        { key: 'externalDocumentNumber', label: 'N° Document', type: 'text' },
        { key: 'customerNumber', label: 'N° Client', type: 'text' },
        { key: 'customerName', label: 'Nom Client', type: 'text' },
        { key: 'invoiceDate', label: 'Date Facture', type: 'date' },
        { key: 'dueDate', label: 'Date Échéance', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' }
      ],
      'Commande Achat': [
        { key: 'externalDocumentNumber', label: 'N° Commande', type: 'text' },
        { key: 'vendorNumber', label: 'N° Fournisseur', type: 'text' },
        { key: 'vendorName', label: 'Nom Fournisseur', type: 'text' },
        { key: 'orderDate', label: 'Date Commande', type: 'date' },
        { key: 'requestedReceiptDate', label: 'Date Livraison', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' }
      ],
      'Commande Vente': [
        { key: 'externalDocumentNumber', label: 'N° Commande', type: 'text' },
        { key: 'customerNumber', label: 'N° Client', type: 'text' },
        { key: 'customerName', label: 'Nom Client', type: 'text' },
        { key: 'orderDate', label: 'Date Commande', type: 'date' },
        { key: 'requestedDeliveryDate', label: 'Date Livraison', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' }
      ],
      'Devis': [
        { key: 'documentNumber', label: 'N° Devis', type: 'text' },
        { key: 'customerNumber', label: 'N° Client', type: 'text' },
        { key: 'customerName', label: 'Nom Client', type: 'text' },
        { key: 'documentDate', label: 'Date Devis', type: 'date' },
        { key: 'validUntilDate', label: 'Valide Jusqu\'au', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' }
      ]
    };

    return configs[type] || [];
  };

  // ========================================
  // RENDER LOADING
  // ========================================
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du document...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ========================================
  // RENDER ERROR
  // ========================================
  if (!document) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Document non trouvé</p>
        </div>
      </AdminLayout>
    );
  }

  const fieldsConfig = getFieldsConfig();
  const isEditable = canEdit();

  // ========================================
  // RENDER PRINCIPAL
  // ========================================
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* ===== EN-TÊTE ===== */}
        <div className="mb-8">
          <button
            onClick={() => navigate(getBackPath())}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{document.originalName}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <span>Type: {analyse?.typeDocument || 'Non classifié'}</span>
                <span>•</span>
                <span>Entité BC: {analyse?.bcEntity || 'N/A'}</span>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statutColors[document.statut]}`}>
              {statutLabels[document.statut]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ========================================
              COLONNE GAUCHE : APERÇU + OCR
              ======================================== */}
          <div className="space-y-6">
            {/* Aperçu du document */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu du document</h2>
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FileText className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600">Fichier: {document.fileName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {document.fileType} • {(document.fileSize / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    (Viewer PDF à implémenter)
                  </p>
                </div>
              </div>
            </div>

            {/* Texte OCR extrait */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Texte extrait (OCR)</h2>
                {analyse?.methodeOcr && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {analyse.methodeOcr}
                  </span>
                )}
              </div>
              
              {analyse?.texteExtrait ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {analyse.texteExtrait}
                  </pre>
                  {analyse?.nbMots && (
                    <p className="text-xs text-gray-500 mt-3 border-t border-gray-200 pt-2">
                      {analyse.nbMots} mots extraits
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Aucun texte extrait. Le document est peut-être vierge ou illisible.
                  </p>
                </div>
              )}
            </div>

            {/* Résumé de l'analyse */}
            {analyse?.resume && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé de l'analyse</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {analyse.resume}
                </p>
              </div>
            )}
          </div>

          {/* ========================================
              COLONNE DROITE : SCORES + DONNÉES
              ======================================== */}
          <div className="space-y-6">
            {/* Scores de confiance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Scores de Confiance</h2>
              
              <div className="space-y-3">
                {/* Score Global */}
                {analyse?.scoreGlobal !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Score Global</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(analyse.scoreGlobal)}`}>
                        {getScoreLabel(analyse.scoreGlobal)} ({(analyse.scoreGlobal * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          analyse.scoreGlobal >= 0.9 ? 'bg-green-500' :
                          analyse.scoreGlobal >= 0.7 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(analyse.scoreGlobal * 100).toFixed(0)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Score OCR */}
                {analyse?.scoreOcr !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">OCR</span>
                      <span className="text-sm font-medium">{(analyse.scoreOcr * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${(analyse.scoreOcr * 100).toFixed(0)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Score Classification */}
                {analyse?.scoreClassification !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Classification</span>
                      <span className="text-sm font-medium">{(analyse.scoreClassification * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-purple-500"
                        style={{ width: `${(analyse.scoreClassification * 100).toFixed(0)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Score Extraction */}
                {analyse?.scoreExtraction !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Extraction</span>
                      <span className="text-sm font-medium">{(analyse.scoreExtraction * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500"
                        style={{ width: `${(analyse.scoreExtraction * 100).toFixed(0)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Alerte si score faible */}
              {analyse?.scoreGlobal < 0.9 && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">
                      {analyse.scoreGlobal < 0.7 
                        ? 'Vérification manuelle requise' 
                        : 'Vérifiez attentivement les données'}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {analyse.actionRecommandee || 'Correction manuelle recommandée'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Données extraites (bcFields) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Données extraites</h2>
                {!editMode && analyse?.scoreGlobal >= 0.7 && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {fieldsConfig.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={bcFields[field.key] || ''}
                        onChange={(e) => handleBcFieldChange(field.key, e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Sélectionner...</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={bcFields[field.key] || ''}
                        onChange={(e) => handleBcFieldChange(field.key, e.target.value)}
                        disabled={!isEditable}
                        step={field.type === 'number' ? '0.01' : undefined}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Bouton Sauvegarder si en édition */}
              {editMode && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={18} />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      loadDocumentData(); // Annuler les modifications
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <CloseIcon size={18} />
                    Annuler
                  </button>
                </div>
              )}
            </div>

            {/* Lignes du document (bcLines) */}
            {bcLines && bcLines.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Package size={20} />
                    Lignes du document
                  </h2>
                  {isEditable && (
                    <button
                      onClick={addLine}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Ajouter ligne
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {bcLines.map((line, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Ligne {line.sequence}
                        </span>
                        {isEditable && (
                          <button
                            onClick={() => removeLine(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={line.description || ''}
                            onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                            disabled={!isEditable}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Quantité
                          </label>
                          <input
                            type="number"
                            value={line.quantity || 0}
                            onChange={(e) => handleLineChange(index, 'quantity', parseFloat(e.target.value))}
                            disabled={!isEditable}
                            step="0.01"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Prix unitaire
                          </label>
                          <input
                            type="number"
                            value={line.unitPrice || 0}
                            onChange={(e) => handleLineChange(index, 'unitPrice', parseFloat(e.target.value))}
                            disabled={!isEditable}
                            step="0.01"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            TVA %
                          </label>
                          <input
                            type="number"
                            value={line.taxPercent || 0}
                            onChange={(e) => handleLineChange(index, 'taxPercent', parseFloat(e.target.value))}
                            disabled={!isEditable}
                            step="0.01"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Montant TTC
                          </label>
                          <input
                            type="number"
                            value={line.lineAmountIncludingTax || 0}
                            onChange={(e) => handleLineChange(index, 'lineAmountIncludingTax', parseFloat(e.target.value))}
                            disabled={!isEditable}
                            step="0.01"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions selon le statut */}
            {document.statut === 'TRAITEMENT' && user.role !== 'comptable' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleValidate}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle size={20} />
                    Valider le document
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <XCircle size={20} />
                    Rejeter le document
                  </button>
                </div>
              </div>
            )}

            {/* Envoi vers BC */}
            {document.statut === 'VALIDE' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Envoi vers Business Central
                </h2>
                <button
                  onClick={handleSendToBC}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Send size={20} />
                  Envoyer vers Business Central
                </button>
              </div>
            )}

            {/* Historique */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <History size={20} />
                Historique
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Document uploadé</p>
                    <p className="text-xs text-gray-500">
                      {new Date(document.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>

                {analyse && (
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Analyse IA effectuée</p>
                      <p className="text-xs text-gray-500">
                        Score global: {(analyse.scoreGlobal * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                )}

                {document.statut === 'VALIDE' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Document validé</p>
                      <p className="text-xs text-gray-500">En attente d'envoi vers BC</p>
                    </div>
                  </div>
                )}

                {document.statut === 'REJETE' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Document rejeté</p>
                      <p className="text-xs text-gray-500">Voir les détails ci-dessus</p>
                    </div>
                  </div>
                )}

                {document.statut === 'ENVOYE_BC' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Envoyé vers Business Central
                      </p>
                      <p className="text-xs text-gray-500">Intégration réussie</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL REJET ===== */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Rejeter le document
            </h3>
            <p className="text-gray-600 mb-4">
              Veuillez indiquer la raison du rejet :
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              rows="4"
              placeholder="Ex: Données incomplètes, document illisible, informations incorrectes..."
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DocumentDetail;
