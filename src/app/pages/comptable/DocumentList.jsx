import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, Filter, Eye, Trash2, AlertCircle } from 'lucide-react';
import documentService from '../../api/documentService';
import useConfirm from '../../components/useConfirm';
import toast from 'react-hot-toast';

//  PAGE LISTE DES DOCUMENTS (COMPTABLE)

const ComptableDocumentList = () => {

  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const { confirm, ConfirmDialog } = useConfirm();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  // Charger les documents au montage
  useEffect(() => {
    loadDocuments();
  }, [])

  // Filtrer quand critères changent
  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, filterStatus, filterType , dateFrom, dateTo]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await documentService.getMyDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.originalName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.statut === filterStatus);
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(
        doc => doc.analyse?.typeDocument === filterType
      );
    }
    if (dateFrom) {
      filtered = filtered.filter(doc =>
        new Date(doc.createdAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(doc =>
        new Date(doc.createdAt) <= new Date(dateTo + 'T23:59:59')  // inclure toute la journée
      );
    }

    setFilteredDocs(filtered);
  };

  const handleDelete = async (id, originalName) => {
    const ok = await confirm({
      title: 'Supprimer ce document ?',
      description: `Le document "${originalName}" sera définitivement supprimé.`,
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await documentService.deleteDocument(id);
      await loadDocuments(); // Recharger la liste
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la suppression');
    }
  };


  const getClientFournisseur = (doc) => {
    const bc = doc.analyse?.bcFields;

    if (!bc) return 'Non disponible';

    // Priorité logique
    if (bc.vendorName) return bc.vendorName;
    if (bc.customerName) return bc.customerName;

    return 'Non identifié';
  };

  const getTotalAmount = (doc) => {
    const bc = doc.analyse?.bcFields;

    if (!bc) return '—';

    const amount = bc.totalAmountIncludingTax;
    const currency = bc.currencyCode || 'TND';

    if (!amount) return '—';

    return `${amount} ${currency}`;
  };

    {/* Filtres */ }
  const hasActiveFilters = searchTerm || filterType !== 'all' || filterStatus !== 'all' || dateFrom || dateTo;

  const handleReset = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
  };
  const formatDate = (dateString) => {

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const types = ['all', 'Facture Achat', 'Facture Vente', 'Avoir Achat', 'Commande Achat', 'Commande Vente', 'Devis'];
  const statusLabels = {
    EN_COURS: 'En cours',
    TRAITEMENT: 'Traitement',
    VALIDE: 'Validé',
    REJETE: 'Rejeté',
    ENVOYE_BC: 'Envoyé BC'
  };

  const statusColors = {
    EN_COURS: 'bg-blue-100 text-blue-800',
    TRAITEMENT: 'bg-yellow-100 text-yellow-800',
    VALIDE: 'bg-green-100 text-green-800',
    REJETE: 'bg-red-100 text-red-800',
    ENVOYE_BC: 'bg-purple-100 text-purple-800'
  };

  const statuses = ['all', 'EN_COURS', 'TRAITEMENT', 'VALIDE', 'REJETE', 'ENVOYE_BC'];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes documents</h1>
          <p className="text-gray-600 mt-2">{filteredDocs.length} document(s) trouvé(s)</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filtres */}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">

          {/* Ligne filtres */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

            {/* Recherche — 4 cols */}
            <div className="relative lg:col-span-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, numéro..."
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
          ${searchTerm ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300'}`}
              />
            </div>

            {/* Type — 2 cols */}
            {/* Type — 2 cols */}
            <div className="relative lg:col-span-2">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-colors
              ${filterType !== 'all' ? 'border-blue-400 bg-blue-50/30 text-blue-700 font-medium' : 'border-gray-300 text-gray-600'}`}
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Tous les types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut — 2 cols */}
            <div className="relative lg:col-span-2">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-colors
                            ${filterStatus !== 'all' ? 'border-blue-400 bg-blue-50/30 text-blue-700 font-medium' : 'border-gray-300 text-gray-600'}`}
                      >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tous les statuts' : statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
            {/* Dates — 3 cols */}
            <div className="flex items-center gap-2 lg:col-span-3">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
                  ${dateFrom ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300'}`}
              />
              <span className="text-gray-300 text-xs">—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
                    ${dateTo ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300'}`}
              />
            </div>



          </div>

          {/* Footer barre : badges actifs + compteur */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
              <span className="text-xs text-gray-400">Filtres actifs :</span>

              {filterType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
                  {filterType}
                  <button onClick={() => setFilterType('all')} className="hover:text-blue-900 ml-0.5">×</button>
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
                  {statusLabels[filterStatus]}
                  <button onClick={() => setFilterStatus('all')} className="hover:text-blue-900 ml-0.5">×</button>
                </span>
              )}
              {(dateFrom || dateTo) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
                  {dateFrom || '...'} → {dateTo || '...'}
                  <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="hover:text-blue-900 ml-0.5">×</button>
                </span>
              )}

              <span className="ml-auto text-xs text-gray-400 font-medium">
                {filteredDocs.length} résultat(s)
              </span>
            </div>
          )}

        </div>

        {/* Tableau des documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Chargement des documents...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client / Fournisseur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.originalName.split('.')[0]}</p>
                        <p className="text-xs text-gray-500 mt-1">Uploadé le {formatDate(doc.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{doc.analyse?.typeDocument || 'Non analysé'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {getClientFournisseur(doc)}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doc.statut]}`}>
                          {statusLabels[doc.statut]}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600"> {formatDate(doc.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{getTotalAmount(doc)} </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">

                        <Link
                          to={`/comptable/documents/${doc.id}`}
                          className="inline-flex items-center gap-1 px-2 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          Voir
                        </Link>
                        <button
                          onClick={() => handleDelete(doc.id, doc.originalName)}
                          className="inline-flex items-center gap-1 px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && filteredDocs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-6">
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Aucun document ne correspond à vos critères'
                : 'Aucun document dans le système'}
            </p>
          </div>
        )}
      {ConfirmDialog}
      </div>
    </AdminLayout>
  );
};

export default ComptableDocumentList;
