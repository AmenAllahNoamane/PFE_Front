import { Link } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { mockDocuments, statusLabels, statusColors } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Upload, CheckCircle, Clock } from 'lucide-react';

// ========================================
// 📊 DASHBOARD COMPTABLE
// ========================================

const ComptableDashboard = () => {
  const { user } = useAuth();

  // Filtrer les documents de l'utilisateur connecté
  const myDocuments = mockDocuments.filter(doc => doc.uploadedBy === user.id);

  // Statistiques
  const stats = {
    total: myDocuments.length,
    enCours: myDocuments.filter(d => d.status === 'en_cours').length,
    validé: myDocuments.filter(d => d.status === 'validé').length,
    rejeté: myDocuments.filter(d => d.status === 'rejeté').length
  };

  // Documents récents
  const recentDocs = myDocuments.slice(0, 5);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon tableau de bord</h1>
          <p className="text-gray-600 mt-2">Bienvenue {user.name}</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">Mes documents</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Clock className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.enCours}</p>
            <p className="text-sm text-gray-600 mt-1">En cours</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.validé}</p>
            <p className="text-sm text-gray-600 mt-1">Validés</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-500 p-3 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.rejeté}</p>
            <p className="text-sm text-gray-600 mt-1">Rejetés</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/comptable/upload"
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-8 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <Upload size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Uploader un document</h3>
                <p className="text-blue-100 mt-1">Ajoutez un nouveau document à traiter</p>
              </div>
            </div>
          </Link>

          <Link
            to="/comptable/documents"
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-8 text-white hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Voir mes documents</h3>
                <p className="text-purple-100 mt-1">Consultez et gérez vos documents</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Documents récents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes documents récents</h2>
          
          {recentDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{doc.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                          {statusLabels[doc.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {doc.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun document uploadé pour le moment</p>
              <Link
                to="/comptable/upload"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload size={20} />
                Uploader mon premier document
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ComptableDashboard;
