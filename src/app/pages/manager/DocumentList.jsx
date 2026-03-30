import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, Filter, Download, Eye, AlertCircle ,Trash2 } from 'lucide-react';
import documentService from '../../api/documentService';
//  PAGE LISTE DES DOCUMENTS (MANAGER)

const ManagerDocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');


  // Charger tous les documents au montage
  useEffect(() => {
    loadDocuments();
  }, []);

  // Filtrer quand critères changent
  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, filterStatus]);


  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Erreur loadloadDocuments:', err)
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
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.statut === filterStatus);
    }

    setFilteredDocs(filtered);
  };

  const handleDelete = async (id, originalName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${originalName}" ?`)) {
      return;
    }

    try {
      await documentService.deleteDocument(id);
      await loadDocuments(); // Recharger la liste
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la suppression');
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    let i = 0;

    while (bytes >= 1024 && i < sizes.length - 1) {
      bytes /= 1024;
      i++;
    }

    return bytes.toFixed(2) + ' ' + sizes[i];
  };


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

  // Export CSV (fonctionnalité Sprint 3)
  const handleExport = () => {
    alert('Export CSV disponible au Sprint 3');
  };








  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tous les documents</h1>
            <p className="text-gray-600 mt-2">{filteredDocs.length} document(s) trouvé(s)</p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Exporter CSV
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filtres */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom de fichier..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filtre par type */}
          {/* <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tous les types' : type}
                </option>
              ))}
            </select>
          </div> */}

          {/* Filtre par statut */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Tous les statuts' : statusLabels[status]}
                </option>
              ))}
            </select>
          </div>
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
                      Taille
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploadé par
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <p className="text-sm text-gray-600"> {doc.fileType.split('/')[1] || 'FILE'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {formatFileSize(doc.fileSize)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doc.statut]}`}>
                          {statusLabels[doc.statut]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600"> {doc.user?.nom || 'Utilisateur'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(doc.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/manager/documents/${doc.id}`}
                          className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          Voir
                        </Link>
                        <button
                          onClick={() => handleDelete(doc.id, doc.originalName)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                        </div>
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

      </div>
    </AdminLayout>
  );
};

export default ManagerDocumentList;
