import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import documentService from '../../api/documentService';
import { Document, Page, pdfjs } from 'react-pdf';
import useConfirm from '../../components/useConfirm';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  ArrowLeft, FileText, CheckCircle, XCircle, Send,
  AlertTriangle, History, Edit2, Save, X as CloseIcon,
  Package, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

// Configuration worker react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [fileObjectUrl, setFileObjectUrl] = useState(null);
  const [analyse, setAnalyse] = useState(null);
  const [flags, setFlags] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [bcFields, setBcFields] = useState({});
  const [bcLines, setBcLines] = useState([]);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');


  // react-pdf
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfError, setPdfError] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [imageScale, setImageScale] = useState(1.0);
  const { confirm, ConfirmDialog } = useConfirm();

  // ── Chargement données ────────────────────────
  useEffect(() => { loadDocumentData(); }, [id]);

  useEffect(() => {
    if (!id) return;
    let objectUrl = null;
    const loadFile = async () => {
      try {
        const url = await documentService.getFileBlob(id);
        objectUrl = url;
        setFileObjectUrl(url);
      } catch (err) {
        console.error('Erreur chargement fichier:', err);
      }
    };
    loadFile();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); setFileObjectUrl(null); };
  }, [id]);

  const loadDocumentData = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocumentById(id);
      setDocument(data);
      setAnalyse(data.analyse);
      if (data.analyse?.bcFields) setBcFields(data.analyse.bcFields);
      if (data.analyse?.bcLines) setBcLines(data.analyse.bcLines);
      setFlags(data.analyse?.flags || []);
      setWarnings(data.analyse?.warnings || []);
    } catch (error) {
      console.error('Erreur chargement document:', error);
      toast.error('Impossible de charger le document');
    } finally {
      setLoading(false);
    }
  };

  const getBackPath = () => {
    if (user.role === 'ADMIN') return '/manager/documents';
    if (user.role === 'MANAGER') return '/manager/documents';
    if (user.role === 'COMPTABLE') return '/comptable/documents';
    return '/';
  };

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

  const canEdit = () => analyse?.scoreGlobal < 0.7 || editMode;

  const handleBcFieldChange = (fieldName, value) => {
    setBcFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleLineChange = (index, fieldName, value) => {
    const updatedLines = [...bcLines];
    updatedLines[index] = { ...updatedLines[index], [fieldName]: value };
    setBcLines(updatedLines);
  };

  const addLine = () => {
    setBcLines([...bcLines, {
      sequence: bcLines.length + 1, itemId: '', description: '',
      quantity: 0, unitPrice: 0, discountPercent: 0,
      taxPercent: 0, lineAmountExcludingTax: 0, lineAmountIncludingTax: 0
    }]);
  };

  const removeLine = (index) => {
    const updated = bcLines.filter((_, i) => i !== index);
    updated.forEach((line, i) => { line.sequence = i + 1; });
    setBcLines(updated);
  };

  const handleSave = async () => {
    try {
      await documentService.updateAnalyse(id, { bcFields, bcLines });
      toast.success('Modifications enregistrées');
      setEditMode(false);
      loadDocumentData();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleValidate = async () => {
    const ok = await confirm({
      title: 'Valider ce document ?',
      description: 'confirmez la validation de ce document son traitement final.',
      variant: 'success',
    });
    if (!ok) return;
    try {
      await documentService.validateDocument(id, { bcFields, bcLines });
      toast.success('Document validé avec succès');
      navigate(getBackPath());
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const handleReject = () => setShowRejectionModal(true);

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez indiquer une raison de rejet');
      return;
    }
    try {
      await documentService.rejectDocument(id, { reason: rejectionReason });
      toast.success('Document rejeté');
      setShowRejectionModal(false);
      navigate(getBackPath());
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  const handleSendToBC = async () => {
    if (!window.confirm('Envoyer ce document vers Business Central ?')) return;
    toast.info('Fonctionnalité disponible au sprint suivant');
  };

  const statutLabels = {
    EN_COURS: 'En cours', TRAITEMENT: 'En traitement',
    VALIDE: 'Validé', REJETE: 'Rejeté', ENVOYE_BC: 'Envoyé BC'
  };
  const statutColors = {
    EN_COURS: 'bg-blue-100 text-blue-800', TRAITEMENT: 'bg-purple-100 text-purple-800',
    VALIDE: 'bg-green-100 text-green-800', REJETE: 'bg-red-100 text-red-800',
    ENVOYE_BC: 'bg-indigo-100 text-indigo-800'
  };

  const getFieldsConfig = () => {
    const configs = {
      'Facture Achat': [
        { key: 'vendorInvoiceNumber', label: 'N° Facture', type: 'text' },
        { key: 'vendorNumber', label: 'N° Fournisseur', type: 'text' },
        { key: 'vendorName', label: 'Nom Fournisseur', type: 'text' },
        { key: 'invoiceDate', label: 'Date Facture', type: 'date' },
        { key: 'dueDate', label: 'Date Échéance', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD', 'CAD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' },
        { key: 'discountAmount', label: 'Remise', type: 'number' },
      ],
      'Facture Vente': [
        { key: 'externalDocumentNumber', label: 'N° Document', type: 'text' },
        { key: 'customerNumber', label: 'N° Client', type: 'text' },
        { key: 'customerName', label: 'Nom Client', type: 'text' },
        { key: 'invoiceDate', label: 'Date Facture', type: 'date' },
        { key: 'dueDate', label: 'Date Échéance', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD', 'CAD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' },
      ],
      'Avoir Achat': [
        { key: 'vendorCreditMemoNumber', label: 'N° Avoir', type: 'text' },
        { key: 'vendorName', label: 'Nom Fournisseur', type: 'text' },
        { key: 'creditMemoDate', label: 'Date Avoir', type: 'date' },
        { key: 'invoiceNumber', label: 'N° Facture Origine', type: 'text' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD', 'CAD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' },
      ],
      'Commande Achat': [
        { key: 'externalDocumentNumber', label: 'N° Commande', type: 'text' },
        { key: 'vendorNumber', label: 'N° Fournisseur', type: 'text' },
        { key: 'vendorName', label: 'Nom Fournisseur', type: 'text' },
        { key: 'orderDate', label: 'Date Commande', type: 'date' },
        { key: 'requestedReceiptDate', label: 'Date Livraison', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD', 'CAD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' },
      ],
      'Commande Vente': [
        { key: 'externalDocumentNumber', label: 'N° Commande', type: 'text' },
        { key: 'customerNumber', label: 'N° Client', type: 'text' },
        { key: 'customerName', label: 'Nom Client', type: 'text' },
        { key: 'orderDate', label: 'Date Commande', type: 'date' },
        { key: 'requestedDeliveryDate', label: 'Date Livraison', type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD', 'CAD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' },
      ],
      'Devis': [
        { key: 'documentNumber', label: 'N° Devis', type: 'text' },
        { key: 'customerNumber', label: 'N° Client', type: 'text' },
        { key: 'customerName', label: 'Nom Client', type: 'text' },
        { key: 'documentDate', label: 'Date Devis', type: 'date' },
        { key: 'validUntilDate', label: "Valide jusqu'au", type: 'date' },
        { key: 'currencyCode', label: 'Devise', type: 'select', options: ['TND', 'EUR', 'USD', 'CAD'] },
        { key: 'totalAmountExcludingTax', label: 'Montant HT', type: 'number' },
        { key: 'totalTaxAmount', label: 'Montant TVA', type: 'number' },
        { key: 'totalAmountIncludingTax', label: 'Montant TTC', type: 'number' },
      ],
    };
    return configs[analyse?.typeDocument] || [];
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Chargement du document...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
  const isPdf = document.fileType === 'application/pdf';
  const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(document.fileType);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* EN-TÊTE */}
        <div className="mb-8">
          <button onClick={() => navigate(getBackPath())}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft size={20} /> Retour
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

          {/* ── COLONNE GAUCHE ── */}
          <div className="space-y-6">

            {/* ── VIEWER PDF (react-pdf) ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu du document</h2>

              {/* Chargement blob */}
              {!fileObjectUrl && (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                    <p className="mt-3 text-sm text-gray-500">Chargement du fichier...</p>
                  </div>
                </div>
              )}

              {/* PDF via react-pdf */}
              {fileObjectUrl && isPdf && !pdfError && (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">

                  {/* Barre d'outils */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">

                    {/* Navigation pages */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-sm text-gray-600 font-medium">
                        {numPages ? `${currentPage} / ${numPages}` : '...'}
                      </span>
                      <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                        disabled={!numPages || currentPage >= numPages}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => setScale(s => Math.max(0.5, parseFloat((s - 0.25).toFixed(2))))}
                        disabled={scale <= 0.5}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-bold transition-colors">
                        −
                      </button>
                      <span className="text-xs text-gray-600 font-medium w-12 text-center">
                        {Math.round(scale * 100)}%
                      </span>
                      <button onClick={() => setScale(s => Math.min(2.5, parseFloat((s + 0.25).toFixed(2))))}
                        disabled={scale >= 2.5}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-bold transition-colors">
                        +
                      </button>
                      <button onClick={() => setScale(1.0)}
                        className="text-xs text-blue-600 hover:underline ml-1">
                        Reset
                      </button>
                    </div>

                  </div>

                  {/* Page PDF */}
                  <div className="flex items-center justify-center p-4 overflow-auto" style={{ maxHeight: '620px' }}>
                    <Document
                      file={fileObjectUrl}
                      onLoadSuccess={({ numPages }) => { setNumPages(numPages); setCurrentPage(1); }}
                      onLoadError={() => setPdfError(true)}
                      loading={
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                      }
                    >
                      <Page
                        pageNumber={currentPage}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </Document>
                  </div>

                </div>
              )}

              {/* Fallback si react-pdf échoue */}
              {fileObjectUrl && isPdf && pdfError && (
                <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <iframe src={fileObjectUrl} title={document.originalName}
                    className="w-full h-full" style={{ border: 'none' }} />
                </div>
              )}

              {/* Image */}
              {fileObjectUrl && isImage && (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">

                  {/* Barre zoom */}
                  <div className="flex items-center justify-end gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
                    <button
                      onClick={() => setImageScale(s => Math.max(0.5, parseFloat((s - 0.25).toFixed(2))))}
                      disabled={imageScale <= 0.5}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-bold transition-colors">
                      −
                    </button>
                    <span className="text-xs text-gray-600 font-medium w-12 text-center">
                      {Math.round(imageScale * 100)}%
                    </span>
                    <button
                      onClick={() => setImageScale(s => Math.min(3.0, parseFloat((s + 0.25).toFixed(2))))}
                      disabled={imageScale >= 3.0}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-bold transition-colors">
                      +
                    </button>
                    <button
                      onClick={() => setImageScale(1.0)}
                      className="text-xs text-blue-600 hover:underline ml-1">
                      Reset
                    </button>
                  </div>

                  {/* Image avec zoom + scroll */}
                  <div className="overflow-auto flex justify-center p-4" style={{ height: '620px' }}>
                    <img
                      src={fileObjectUrl}
                      alt={document.originalName}
                      style={{
                        transform: `scale(${imageScale})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </div>

                </div>
              )}

              {/* Infos + bouton ouvrir */}
              {fileObjectUrl && (
                <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{document.originalName}</p>
                    <p className="text-xs text-gray-500">
                      {document.fileType} • {(document.fileSize / 1024).toFixed(2)} KB
                      {numPages && isPdf && ` • ${numPages} page${numPages > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <a href={fileObjectUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Eye size={16} /> Ouvrir
                  </a>
                </div>
              )}
            </div>

            {/* Texte OCR */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Texte extrait (OCR)</h2>
                {analyse?.methodeOcr && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{analyse.methodeOcr}</span>
                )}
              </div>
              {analyse?.texteExtrait ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{analyse.texteExtrait}</pre>
                  {analyse?.nbMots && (
                    <p className="text-xs text-gray-500 mt-3 border-t border-gray-200 pt-2">{analyse.nbMots} mots extraits</p>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">Aucun texte extrait. Le document est peut-être vierge ou illisible.</p>
                </div>
              )}
            </div>

            {analyse?.resume && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé de l'analyse</h2>
                <p className="text-gray-700 text-sm leading-relaxed">{analyse.resume}</p>
              </div>
            )}
          </div>

          {/* ── COLONNE DROITE ── */}
          <div className="space-y-6">

            {/* Scores */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Scores de Confiance</h2>
              <div className="space-y-3">
                {analyse?.scoreGlobal !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Score Global</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(analyse.scoreGlobal)}`}>
                        {getScoreLabel(analyse.scoreGlobal)} ({(analyse.scoreGlobal * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${analyse.scoreGlobal >= 0.9 ? 'bg-green-500' : analyse.scoreGlobal >= 0.7 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${(analyse.scoreGlobal * 100).toFixed(0)}%` }} />
                    </div>
                  </div>
                )}
                {[
                  { key: 'scoreOcr', label: 'OCR', color: 'bg-blue-500' },
                  { key: 'scoreClassification', label: 'Classification', color: 'bg-purple-500' },
                  { key: 'scoreExtraction', label: 'Extraction', color: 'bg-indigo-500' },
                ].map(({ key, label, color }) => analyse?.[key] != null && (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm font-medium">{(analyse[key] * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${(analyse[key] * 100).toFixed(0)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {analyse?.scoreGlobal < 0.9 && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">
                      {analyse.scoreGlobal < 0.7 ? 'Vérification manuelle requise' : 'Vérifiez attentivement les données'}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">{analyse.actionRecommandee || 'Correction manuelle recommandée'}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Flags & Warnings */}
            {(flags.length > 0 || warnings.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-orange-500" />
                  Alertes de qualité
                </h2>

                {/* Warnings */}
                {warnings.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Avertissements</p>
                    <div className="space-y-2">
                      {warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                          <AlertTriangle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-orange-800">{w}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flags */}
                {flags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Détails techniques</p>
                    <div className="flex flex-wrap gap-2">
                      {flags.map((flag, i) => (
                        <span key={i}
                          className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-medium">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Données extraites */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Données extraites</h2>
                {!editMode && analyse?.scoreGlobal >= 0.7 && (
                  <button onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={16} /> Modifier
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {fieldsConfig.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                    {field.type === 'select' ? (
                      <select value={bcFields[field.key] || ''} onChange={(e) => handleBcFieldChange(field.key, e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed">
                        <option value="">Sélectionner...</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input type={field.type} value={bcFields[field.key] || ''}
                        onChange={(e) => handleBcFieldChange(field.key, e.target.value)}
                        disabled={!isEditable} step={field.type === 'number' ? '0.01' : undefined}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed" />
                    )}
                  </div>
                ))}
              </div>
              {editMode && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Save size={18} /> Sauvegarder
                  </button>
                  <button onClick={() => { setEditMode(false); loadDocumentData(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <CloseIcon size={18} /> Annuler
                  </button>
                </div>
              )}
            </div>

            {/* Lignes */}
            {bcLines && bcLines.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Package size={20} /> Lignes du document
                  </h2>
                  {isEditable && (
                    <button onClick={addLine}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      + Ajouter ligne
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {bcLines.map((line, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Ligne {line.sequence}</span>
                        {isEditable && (
                          <button onClick={() => removeLine(index)} className="text-red-600 hover:text-red-700 text-sm">Supprimer</button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                          <input type="text" value={line.description || ''} onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                            disabled={!isEditable} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50" />
                        </div>
                        {[
                          { key: 'quantity', label: 'Quantité' },
                          { key: 'unitPrice', label: 'Prix unitaire' },
                          { key: 'taxPercent', label: 'TVA %' },
                          { key: 'lineAmountIncludingTax', label: 'Montant TTC' },
                        ].map(({ key, label }) => (
                          <div key={key}>
                            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                            <input type="number" value={line[key] || 0} onChange={(e) => handleLineChange(index, key, parseFloat(e.target.value))}
                              disabled={!isEditable} step="0.01"
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {(document.statut === 'TRAITEMENT' || document.statut === 'REJETE') && user.role !== 'COMPTABLE' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                {/* Afficher le commentaire de rejet précédent si REJETE */}
                {document.statut === 'REJETE' && analyse?.commentaireRejet && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-xs font-medium text-red-600 mb-1">Raison du rejet précédent :</p>
                    <p className="text-sm text-red-800">{analyse.commentaireRejet}</p>
                  </div>
                )}
                <div className="space-y-3">
                  <button onClick={handleValidate}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    <CheckCircle size={20} /> Valider le document
                  </button>
                  <button onClick={handleReject}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    <XCircle size={20} /> Rejeter le document
                  </button>
                </div>
              </div>
            )}

            {/* Envoi BC */}
            {document.statut === 'VALIDE' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Envoi vers Business Central</h2>
                <button onClick={handleSendToBC}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Send size={20} /> Envoyer vers Business Central
                </button>
              </div>
            )}

            {/* Historique */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <History size={20} /> Historique
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Document uploadé</p>
                    <p className="text-xs text-gray-500">{new Date(document.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
                {analyse && (
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Analyse IA effectuée</p>
                      <p className="text-xs text-gray-500">Score global : {(analyse.scoreGlobal * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                )}
                {document.statut === 'VALIDE' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div><p className="text-sm font-medium text-gray-900">Document validé</p><p className="text-xs text-gray-500">En attente d'envoi vers BC</p></div>
                  </div>
                )}
                {document.statut === 'REJETE' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div><p className="text-sm font-medium text-gray-900">Document rejeté</p><p className="text-xs text-gray-500">{analyse?.commentaireRejet || 'Aucun commentaire'}</p></div>
                  </div>
                )}
                {document.statut === 'ENVOYE_BC' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                    <div><p className="text-sm font-medium text-gray-900">Envoyé vers Business Central</p><p className="text-xs text-gray-500">Intégration réussie</p></div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL REJET */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop flou léger au lieu du noir */}
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setShowRejectionModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Rejeter le document</h3>
            <p className="text-sm text-gray-500 mb-4">Veuillez indiquer la raison du rejet :</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm"
              rows="4"
              placeholder="Ex: Données incomplètes, document illisible..."
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
      {ConfirmDialog}
    </AdminLayout>
  );
};

export default DocumentDetail;