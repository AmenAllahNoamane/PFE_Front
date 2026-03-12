import { useState } from 'react';
import { Link } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { mockDocuments, statusLabels, statusColors } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Filter, Eye } from 'lucide-react';

// ========================================
// 📄 PAGE LISTE DES DOCUMENTS (COMPTABLE)
// ========================================

const ComptableDocumentList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filtrer les documents de l'utilisateur connecté
  const myDocuments = mockDocuments.filter(doc => doc.uploadedBy === user.id);

  // Filtrer avec les critères de recherche
  const filteredDocs = myDocuments.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Types et statuts disponibles
  const types = ['all', 'Facture Achat', 'Facture Vente', 'Bon de Commande', 'Contrat'];
  const statuses = ['all', 'en_cours', 'validé', 'rejeté', 'dans_bc'];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes documents</h1>
          <p className="text-gray-600 mt-2">{filteredDocs.length} document(s) trouvé(s)</p>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filtre par type */}
          <div className="relative">
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
          </div>

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
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client/Fournisseur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
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
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{doc.uploadedAt}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{doc.type}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                        {statusLabels[doc.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{doc.client}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{doc.date}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {doc.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/comptable/documents/${doc.id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-6">
            <p className="text-gray-600">Aucun document trouvé</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ComptableDocumentList;
