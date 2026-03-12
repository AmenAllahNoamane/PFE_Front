import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { mockAuditLogs } from '../../utils/mockData';
import { Search, Filter, Download } from 'lucide-react';

// ========================================
// 📋 PAGE LOGS D'AUDIT (ADMIN)
// ========================================

const AuditLog = () => {
  const [logs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  // Filtrer les logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.document.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterAction === 'all' || log.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  // Actions disponibles
  const actions = ['all', 'Upload document', 'Validation document', 'Rejet document', 'Envoi vers Business Central'];

  // Export CSV (simulation)
  const handleExport = () => {
    alert('Export CSV en cours... (fonctionnalité de démonstration)');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Logs d'audit</h1>
            <p className="text-gray-600 mt-2">{filteredLogs.length} action(s) trouvée(s)</p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Exporter CSV
          </button>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les logs..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filtre par action */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
            >
              {actions.map(action => (
                <option key={action} value={action}>
                  {action === 'all' ? 'Toutes les actions' : action}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table des logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{log.timestamp}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{log.user}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.action.includes('Upload') ? 'bg-blue-100 text-blue-800' :
                        log.action.includes('Validation') ? 'bg-green-100 text-green-800' :
                        log.action.includes('Rejet') ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-xs">{log.document}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-md">{log.details}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-6">
            <p className="text-gray-600">Aucun log trouvé</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditLog;
