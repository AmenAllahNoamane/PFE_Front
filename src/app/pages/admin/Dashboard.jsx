import AdminLayout from '../../layouts/AdminLayout';
import { Users, FileText, Activity, AlertCircle } from 'lucide-react';
import { useState , useEffect } from 'react';

import { mockUsers, mockDocuments, mockAuditLogs } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../api/userService';

// ========================================
// 📊 DASHBOARD ADMINISTRATEUR
// ========================================

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true); setError('');
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err);
      console.error('Erreur loadUsers:', err);
    } finally {
      setLoading(false)
        ;
    }
  };
  // Statistiques
  const totalUsers = users.length;
   const activeUsers = users.filter(u => u.isActive).length;
  const totalDocuments = mockDocuments.length;
  const recentLogs = mockAuditLogs.slice(0, 5);



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
      value: recentLogs.length,
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
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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
              {mockUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.user}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
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
