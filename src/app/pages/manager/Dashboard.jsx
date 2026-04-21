import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import documentService from '../../api/documentService';
import { FileText, CheckCircle, XCircle, Database, TrendingUp, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await documentService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err || 'Erreur lors du chargement');
      console.error('Erreur stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Statuts ───────────────────────────────────
  const statutLabels = {
    EN_COURS:   'En cours',
    TRAITEMENT: 'En traitement',
    VALIDE:     'Validé',
    REJETE:     'Rejeté',
    ENVOYE_BC:  'Envoyé BC'
  };
  const statutColors = {
    EN_COURS:   'bg-blue-100 text-blue-800',
    TRAITEMENT: 'bg-purple-100 text-purple-800',
    VALIDE:     'bg-green-100 text-green-800',
    REJETE:     'bg-red-100 text-red-800',
    ENVOYE_BC:  'bg-indigo-100 text-indigo-800'
  };

  // ── Données graphique statut ──────────────────
  const statusChartData = stats ? [
    { name: 'En cours',    value: stats.parStatut.EN_COURS   || 0, color: '#3B82F6' },
    { name: 'Validé',      value: stats.parStatut.VALIDE     || 0, color: '#10B981' },
    { name: 'Rejeté',      value: stats.parStatut.REJETE     || 0, color: '#EF4444' },
    { name: 'Envoyé BC',   value: stats.parStatut.ENVOYE_BC  || 0, color: '#8B5CF6' },
    { name: 'Traitement',  value: stats.parStatut.TRAITEMENT || 0, color: '#F59E0B' },
  ].filter(d => d.value > 0) : [];

  // ── Loading ───────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
        </div>
      </AdminLayout>
    );
  }

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
            <div className="bg-blue-500 p-3 rounded-lg w-fit mb-4">
              <FileText className="text-white" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.kpis.total || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total documents</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="bg-green-500 p-3 rounded-lg w-fit mb-4">
              <CheckCircle className="text-white" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.kpis.valides || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Documents validés</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="bg-purple-500 p-3 rounded-lg w-fit mb-4">
              <Database className="text-white" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.kpis.envoyeBC || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Dans Business Central</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="bg-orange-500 p-3 rounded-lg w-fit mb-4">
              <TrendingUp className="text-white" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.kpis.tauxValidation || 0}%</p>
            <p className="text-sm text-gray-600 mt-1">Taux de validation</p>
          </div>

        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Pie — par statut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents par statut</h2>
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>

          {/* Bar — par type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents par type</h2>
            {stats?.parType?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.parType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>

        </div>

        {/* Documents récents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents récents</h2>

          {stats?.recents?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploadé par</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-48 truncate">
                        {doc.originalName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {doc.analyse?.typeDocument || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statutColors[doc.statut] || 'bg-gray-100 text-gray-800'}`}>
                          {statutLabels[doc.statut] || doc.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {doc.user ? `${doc.user.prenom} ${doc.user.nom}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {doc.analyse?.scoreGlobal != null ? (
                          <span className={`font-medium ${
                            doc.analyse.scoreGlobal >= 0.9 ? 'text-green-600' :
                            doc.analyse.scoreGlobal >= 0.7 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {(doc.analyse.scoreGlobal * 100).toFixed(0)}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Aucun document récent
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default ManagerDashboard;