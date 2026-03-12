import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { mockDocuments, statusLabels, statusColors, getConfidenceColor, getConfidenceLabel } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Send, 
  AlertTriangle,
  History 
} from 'lucide-react';

// ========================================
// 📄 PAGE DÉTAIL D'UN DOCUMENT
// ========================================

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Trouver le document
  const document = mockDocuments.find(d => d.id === parseInt(id));

  // États pour le formulaire
  const [formData, setFormData] = useState({
    type: document?.type || '',
    client: document?.client || '',
    date: document?.date || '',
    amount: document?.amount || '',
    reference: document?.reference || ''
  });

  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  if (!document) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Document non trouvé</p>
        </div>
      </AdminLayout>
    );
  }

  // Déterminer le chemin de retour selon le rôle
  const getBackPath = () => {
    if (user.role === 'manager') return '/manager/documents';
    if (user.role === 'comptable') return '/comptable/documents';
    return '/';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleValidate = () => {
    if (window.confirm('Valider ce document ?')) {
      console.log('Document validé:', formData);
      alert('Document validé avec succès !');
      navigate(getBackPath());
    }
  };

  const handleReject = () => {
    setShowRejectionModal(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez indiquer une raison de rejet');
      return;
    }
    console.log('Document rejeté:', rejectionReason);
    alert('Document rejeté');
    setShowRejectionModal(false);
    navigate(getBackPath());
  };

  const handleSendToBC = () => {
    if (window.confirm('Envoyer ce document vers Business Central ?')) {
      console.log('Envoi vers Business Central');
      alert('Document envoyé vers Business Central avec succès !');
      navigate(getBackPath());
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => navigate(getBackPath())}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{document.name}</h1>
              <p className="text-gray-600 mt-2">Référence : {document.reference}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[document.status]}`}>
              {statusLabels[document.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche : Aperçu du document et OCR */}
          <div className="space-y-6">
            {/* Aperçu du document */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu du document</h2>
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FileText className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600">Aperçu du fichier PDF/Image</p>
                  <p className="text-sm text-gray-500 mt-1">(Démo : viewer non implémenté)</p>
                </div>
              </div>
            </div>

            {/* Texte extrait par OCR */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Texte extrait (OCR)</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {document.ocrText}
                </pre>
              </div>
            </div>
          </div>

          {/* Colonne droite : Formulaire et actions */}
          <div className="space-y-6">
            {/* Score de confiance IA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Confiance IA</h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {(document.confidence * 100).toFixed(0)}%
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(document.confidence)}`}>
                      {getConfidenceLabel(document.confidence)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        document.confidence >= 0.9 ? 'bg-green-500' :
                        document.confidence >= 0.7 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${document.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {document.confidence < 0.9 && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-orange-800">
                    Vérifiez attentivement les données extraites
                  </p>
                </div>
              )}
            </div>

            {/* Formulaire de modification */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Données extraites</h2>
              
              <div className="space-y-4">
                {/* Type de document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de document
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="Facture Achat">Facture Achat</option>
                    <option value="Facture Vente">Facture Vente</option>
                    <option value="Bon de Commande">Bon de Commande</option>
                    <option value="Contrat">Contrat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Client/Fournisseur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client / Fournisseur
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Montant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant (€)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Référence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            {document.status === 'en_cours' && user.role !== 'comptable' && (
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

            {/* Bouton envoi vers Business Central (comptable uniquement) */}
            {document.status === 'valide' && user.role === 'comptable' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Envoi vers Business Central</h2>
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
                    <p className="text-xs text-gray-500">{document.uploadDate} par {document.uploadedBy}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Traitement IA effectué</p>
                    <p className="text-xs text-gray-500">Confiance: {(document.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
                {document.status === 'valide' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Document validé</p>
                      <p className="text-xs text-gray-500">En attente d'envoi vers BC</p>
                    </div>
                  </div>
                )}
                {document.status === 'rejete' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Document rejeté</p>
                      <p className="text-xs text-gray-500">Raison: Données incorrectes</p>
                    </div>
                  </div>
                )}
                {document.status === 'envoye' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Envoyé vers Business Central</p>
                      <p className="text-xs text-gray-500">Intégration réussie</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de rejet */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rejeter le document</h3>
            <p className="text-gray-600 mb-4">Veuillez indiquer la raison du rejet :</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              rows="4"
              placeholder="Ex: Données incomplètes, montant incorrect..."
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
