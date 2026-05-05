import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import auditService from '../../api/auditService';
import { Search, Filter, Download } from 'lucide-react';
import XLSXStyle from 'xlsx-js-style';
import toast from 'react-hot-toast';
const ACTION_COLORS = {
  UPLOAD: 'bg-blue-100 text-blue-800',
  VALIDATE: 'bg-green-100 text-green-800',
  REJECT: 'bg-red-100 text-red-800',
  TRANSMIT: 'bg-purple-100 text-purple-800',
  SEND_TO_BC: 'bg-indigo-100 text-indigo-800',
  LOGIN: 'bg-violet-100 text-violet-800',
  LOGOUT: 'bg-gray-100 text-gray-800',
  CREATE_USER: 'bg-teal-100 text-teal-800',
  UPDATE_USER: 'bg-yellow-100 text-yellow-800',
  ACTIVATE_USER: 'bg-green-100 text-green-700',
  DEACTIVATE_USER: 'bg-orange-100 text-orange-800',
  DOWNLOAD: 'bg-cyan-100 text-cyan-800',
};

const ACTION_LABELS = {
  UPLOAD: 'Upload document',
  VALIDATE: 'Validation',
  REJECT: 'Rejet',
  SEND_TO_BC: 'Envoi BC',
  LOGIN: 'Connexion',
  CREATE_USER: 'Création utilisateur',
  UPDATE_USER: 'Modification utilisateur',
  ACTIVATE_USER: 'Activation utilisateur',
  DEACTIVATE_USER: 'Désactivation utilisateur',
  DOWNLOAD: 'Téléchargement',
};
const formatDetails = (action, details) => {
  switch (action) {
    case 'LOGIN':
      return 'Connexion au système';

    case 'VALIDATE':
      return 'Document validé et prêt pour envoi vers Business Central';
    case 'SEND_TO_BC':
      return 'Document envoyé avec succès vers Microsoft Business Central';
    default:
      break;
  }

  // Pour les autres cases on a besoin de details
  if (!details) return '—';

  switch (action) {
    case 'UPLOAD':
      return `${details.fileName || ''} — ${details.fileSize ? Math.round(details.fileSize / 1024) + ' Ko' : ''}`;
    case 'REJECT':
      return `Motif : ${details.motif || '—'}`;
    case 'CREATE_USER':
      return `Nouvel utilisateur créé : ${details.email || ''} (${details.role || ''})`;
    case 'UPDATE_USER':
      return `Champs modifiés : ${Array.isArray(details.champsModifies) ? details.champsModifies.join(', ') : '—'}`;
    case 'ACTIVATE_USER':
      return 'Compte utilisateur activé';
    case 'DEACTIVATE_USER':
      return 'Compte utilisateur désactivé';
    case 'DOWNLOAD':
      return `Téléchargement : ${details.fileName || '—'}`;
    default:
      return JSON.stringify(details);
  }
};
// PAGE LOGS D'AUDIT (ADMIN)
const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const LIMIT = 20;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await auditService.getAllLogs({
        page,
        limit: LIMIT,
        action: filterAction !== 'all' ? filterAction : undefined,
        dateDebut: dateDebut || undefined,
        dateFin: dateFin || undefined,
      });

      setLogs(result.logs);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLogs();
  }, [page, filterAction, dateDebut, dateFin]);

  // Recherche côté client sur les logs chargés
  const filteredLogs = logs.filter(log => {
    const fullName = `${log.user?.nom} ${log.user?.prenom}`.toLowerCase();
    const email = log.user?.email?.toLowerCase() || '';
    const action = ACTION_LABELS[log.action]?.toLowerCase() || '';
    const details = formatDetails(log.action, log.details).toLowerCase();

    const matchesSearch = !searchTerm || (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      action.includes(searchTerm.toLowerCase()) ||
      details.includes(searchTerm.toLowerCase())
    );



    return matchesSearch;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  // Export CSV 
  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast.error('Aucun log à exporter');
      return;
    }

    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
      fill: { fgColor: { rgb: '2563EB' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: 'FFFFFF' } },
        bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
        left: { style: 'thin', color: { rgb: 'FFFFFF' } },
        right: { style: 'thin', color: { rgb: 'FFFFFF' } },
      }
    };

    const cellStyle = {
      font: { sz: 10, color: { rgb: '374151' } },
      alignment: { vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
        left: { style: 'thin', color: { rgb: 'E5E7EB' } },
        right: { style: 'thin', color: { rgb: 'E5E7EB' } },
      }
    };

    const cellStyleAlt = {
      ...cellStyle,
      fill: { fgColor: { rgb: 'F9FAFB' } }
    };

    const headers = ['N°', 'Date/Heure', 'Utilisateur', 'Email', 'Rôle', 'Action', 'Objet', 'Détails'];

    const wsData = [];

    // En-tête
    wsData.push(
      headers.map(h => ({ v: h, t: 's', s: headerStyle }))
    );

    // Données
    filteredLogs.forEach((log, index) => {
      const isAlt = index % 2 === 1;
      const base = isAlt ? cellStyleAlt : cellStyle;

      wsData.push([
        { v: index + 1, t: 'n', s: { ...base, alignment: { horizontal: 'center' } } },
        { v: formatDate(log.createdAt), t: 's', s: { ...base, alignment: { horizontal: 'center' } } },
        { v: `${log.user?.nom || ''} ${log.user?.prenom || ''}`.trim(), t: 's', s: base },
        { v: log.user?.email || '—', t: 's', s: base },
        { v: log.user?.role || '—', t: 's', s: { ...base, alignment: { horizontal: 'center' } } },
        { v: ACTION_LABELS[log.action] || log.action, t: 's', s: { ...base, alignment: { horizontal: 'center' } } },
        { v: log.entityType || '—', t: 's', s: { ...base, alignment: { horizontal: 'center' } } },
        { v: formatDetails(log.action, log.details), t: 's', s: base },
      ]);
    });

    const ws = XLSXStyle.utils.aoa_to_sheet(wsData);

    ws['!cols'] = [
      { wch: 5 },   // N°
      { wch: 20 },  // Date
      { wch: 20 },  // Utilisateur
      { wch: 25 },  // Email
      { wch: 12 },  // Rôle
      { wch: 22 },  // Action
      { wch: 15 },  // Objet
      { wch: 40 },  // Détails
    ];

    ws['!rows'] = [
      { hpt: 28 },
      ...filteredLogs.map(() => ({ hpt: 20 }))
    ];

    const wb = XLSXStyle.utils.book_new();
    XLSXStyle.utils.book_append_sheet(wb, ws, 'Audit Logs');
    XLSXStyle.writeFile(wb, `audit_logs_${new Date().toISOString().slice(0, 10)}.xlsx`);

    toast.success(`${filteredLogs.length} log(s) exporté(s)`);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Logs d'audit</h1>
            <p className="text-gray-600 mt-2">{total} action(s) trouvée(s)</p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            Exporter Excel
          </button>
        </div>

        {/* Filtres */}
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

            {/* Recherche — 4 cols */}
            <div className="relative lg:col-span-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par utilisateur, email..."
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
          ${searchTerm ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300'}`}
              />
            </div>

            {/* Filtre par action — 3 cols */}
            <div className="relative lg:col-span-3">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <select
                value={filterAction}
                onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-colors
          ${filterAction !== 'all' ? 'border-blue-400 bg-blue-50/30 text-blue-700 font-medium' : 'border-gray-300 text-gray-600'}`}
              >
                <option value="all">Toutes les actions</option>
                {Object.entries(ACTION_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Dates — 3 cols */}
            <div className="flex items-center gap-2 lg:col-span-3">
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => { setDateDebut(e.target.value); setPage(1); }}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
          ${dateDebut ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300'}`}
              />
              <span className="text-gray-300 text-xs">—</span>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => { setDateFin(e.target.value); setPage(1); }}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
          ${dateFin ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300'}`}
              />
            </div>

          </div>

          {/* Badges filtres actifs */}
          {(searchTerm || filterAction !== 'all' || dateDebut || dateFin) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
              <span className="text-xs text-gray-400">Filtres actifs :</span>

              {filterAction !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
                  {ACTION_LABELS[filterAction]}
                  <button onClick={() => setFilterAction('all')} className="hover:text-blue-900 ml-0.5">×</button>
                </span>
              )}


              {(dateDebut || dateFin) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
                  {dateDebut || '...'} → {dateFin || '...'}
                  <button onClick={() => { setDateDebut(''); setDateFin(''); }} className="hover:text-blue-900 ml-0.5">×</button>
                </span>
              )}

              <span className="ml-auto text-xs text-gray-400 font-medium">
                {filteredLogs.length} résultat(s)
              </span>
            </div>
          )}

        </div>
        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Chargement...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Aucun log trouvé
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {log.user?.nom} {log.user?.prenom}
                        </p>
                        <p className="text-xs text-gray-500">{log.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {log.user?.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.entityType || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {formatDetails(log.action, log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditLog;
