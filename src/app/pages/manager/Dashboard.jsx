import AdminLayout from '../../layouts/AdminLayout';
import { mockMetrics, mockDocuments, statusLabels, statusColors } from '../../utils/mockData';
import { FileText, CheckCircle, XCircle, Database, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ========================================
// 📊 DASHBOARD MANAGER
// ========================================

const ManagerDashboard = () => {
  // Préparer les données pour les graphiques
  const statusData = [
    { name: 'En cours', value: mockMetrics.parStatut.en_cours, color: '#3B82F6' },
    { name: 'Validé', value: mockMetrics.parStatut.validé, color: '#10B981' },
    { name: 'Rejeté', value: mockMetrics.parStatut.rejeté, color: '#EF4444' },
    { name: 'Dans BC', value: mockMetrics.parStatut.dans_bc, color: '#8B5CF6' }
  ];

  const typeData = Object.entries(mockMetrics.parType).map(([name, value]) => ({
    name,
    value
  }));

  // Documents récents
  const recentDocs = mockDocuments.slice(0, 5);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Manager</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de tous les documents</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockMetrics.volumeMensuel}</p>
            <p className="text-sm text-gray-600 mt-1">Documents ce mois</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockMetrics.parStatut.validé}</p>
            <p className="text-sm text-gray-600 mt-1">Documents validés</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Database className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockMetrics.parStatut.dans_bc}</p>
            <p className="text-sm text-gray-600 mt-1">Dans Business Central</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockMetrics.tauxValidation}%</p>
            <p className="text-sm text-gray-600 mt-1">Taux de validation</p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique par statut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents par statut</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique par type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents par type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Documents récents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents récents</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client/Fournisseur</th>
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
                    <td className="px-4 py-3 text-sm text-gray-600">{doc.client}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      {doc.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagerDashboard;
