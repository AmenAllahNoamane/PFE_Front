import AdminLayout from '../../layouts/AdminLayout';
import { Users, FileText, Activity, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../api/userService';
import documentService from '../../api/documentService';
import auditService from '../../api/auditService';
import toast from 'react-hot-toast';

//  DASHBOARD ADMINISTRATEUR
const ACTION_LABELS = {
  UPLOAD: 'Upload document',
  VALIDATE: 'Validation',
  REJECT: 'Rejet',
  SEND_TO_BC: 'Envoi BC',
};

const ACTION_COLORS = {
  UPLOAD: 'bg-blue-100 text-blue-800',
  VALIDATE: 'bg-green-100 text-green-800',
  REJECT: 'bg-red-100 text-red-800',
  SEND_TO_BC: 'bg-indigo-100 text-indigo-800',
};
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    loadUsers();
    loadDocuments();
    loadRecentLogs();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      // Trier : lastLogin null → à la fin
      const sorted = [...data].sort((a, b) => {
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return new Date(b.lastLogin) - new Date(a.lastLogin);
      });

      setUsers(sorted);
    } catch (err) {
      setError(err);
      toast.error("Erreur lors du chargement des données.")
      console.error('Erreur loadUsers:', err);
    } finally {
      setLoading(false)
        ;
    }
  };

  const loadDocuments = async () => {
    try {
      setLoadingDocs(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
      setLoadingDocs(false);
    } catch (err) {
      console.error('Erreur loadDocuments:', err);
    }
  };

  const loadRecentLogs = async () => {
    try {
      setLoadingLogs(true);
      // Charger les logs et filtrer uniquement les actions sur documents
      const result = await auditService.getAllLogs({ page: 1, limit: 50 });
      const documentActions = ['UPLOAD', 'VALIDATE', 'REJECT', 'SEND_TO_BC'];
      const filtered = result.logs
        .filter(log => documentActions.includes(log.action))
        .slice(0, 5);
      setRecentLogs(filtered);
    } catch (err) {
      console.error('Erreur loadRecentLogs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };
  // Statistiques
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const totalDocuments = documents.length;
  const actionsAujourdhui = recentLogs.filter(log => {
    const today = new Date().toISOString().slice(0, 10);
    return log.createdAt?.slice(0, 10) === today;
  }).length;



  const stats = [
    {
      label: 'Utilisateurs totaux',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      label: 'Utilisateurs actifs',
      value: activeUsers,
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      label: 'Documents totaux',
      value: totalDocuments,
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      label: 'Actions aujourd\'hui',
      value: actionsAujourdhui,
      icon: AlertCircle,
      color: 'bg-orange-500'
    }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{(loading || loadingDocs || loadingDocs) ? '...' : stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Utilisateurs récents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilisateurs récents</h2>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.prenom.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.prenom}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive === true
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {user.isActive === true ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
            <div className="space-y-3">
              {loadingLogs ? (
                <p className="text-gray-500 text-sm">Chargement...</p>
              ) : recentLogs.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune activité récente</p>
              ) : recentLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {log.user?.prenom} {log.user?.nom}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
