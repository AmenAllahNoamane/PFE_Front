import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import UserTable from '../../components/users/UserTable';
import { Plus, Search } from 'lucide-react';
import userService from '../../api/userService';
// ========================================
// 👥 PAGE LISTE DES UTILISATEURS
// ========================================

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('')
  
// Charger la liste des utilisateurs
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Erreur de chargement');
      console.error('Erreur loadUsers:', err);
    } finally {
      setLoading(false);
    }
  };
  // Filtrer les utilisateurs

 const filteredUsers = users.filter(user => {
  const search = searchTerm.toLowerCase();
  
  return (
    user.nom?.toLowerCase().includes(search) ||
    user.prenom?.toLowerCase().includes(search) ||
    user.email?.toLowerCase().includes(search) ||
    user.role?.toLowerCase().includes(search)
  );
});
 // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deleteUser(id);
      // Recharger la liste après suppression
      loadUsers();
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      alert(err || 'Erreur lors de la suppression');
      console.error('Erreur delete:', err);
    }
  };

    // Activer/Désactiver un utilisateur
  const handleToggle = async (id) => {
    try {
      await userService.toggleUser(id);
      // Recharger la liste
      loadUsers();
    } catch (err) {
      alert(err || 'Erreur lors du changement de statut');
      console.error('Erreur toggle:', err);
    }
  };

  // Rediriger vers la page d'édition
  const handleEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-2">{users.length} utilisateur(s) trouvé(s)</p>
          </div>
                  
          <button
            
            onClick={() => navigate('/admin/users/create')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nouvel utilisateur
          </button>
        </div>


        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email ou rôle..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Tableau des utilisateurs */}


        <UserTable  users={filteredUsers} onDelete={handleDelete}  onEdit={handleEdit}  onToggle={handleToggle} />
       
      </div>
    </AdminLayout>
  );
};

export default UserList;
