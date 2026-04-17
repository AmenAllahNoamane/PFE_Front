import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import UserTable from '../../components/users/UserTable';
import { Plus, Search,Loader2 } from 'lucide-react';
import userService from '../../api/userService';
import useConfirm from '../../components/useConfirm';
import toast from 'react-hot-toast';

// PAGE LISTE DES UTILISATEURS

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('')
  const { confirm, ConfirmDialog } = useConfirm();


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
      setError( 'Erreur de chargement ');
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
    const ok = await confirm({
    title: 'Supprimer cet utilisateur ?',
    description: 'Cette action est irréversible.',
    variant: 'danger',
  });
  if (!ok) return;
    try {
      await userService.deleteUser(id);
      // Recharger la liste après suppression
      loadUsers();
       toast.success('Utilisateur supprimé avec succès');
    } catch (err) {
      alert(err || 'Erreur lors de la suppression');
      console.error('Erreur delete:', err);
    }
  };

  // Activer/Désactiver un utilisateur
  const handleToggle = async (id,isActive) => {
    const ok = await confirm({
    title: isActive ? 'Désactiver cet utilisateur ?' : 'Activer cet utilisateur ?',
    description: isActive ? 'L\'utilisateur ne pourra plus se connecter.' : 'L\'utilisateur pourra à nouveau se connecter.',
    variant: isActive ? 'danger' : 'success',
  });
  if (!ok) return
    try {
      await userService.toggleUser(id);
      // Recharger la liste
      loadUsers();
      toast.success(isActive ? 'Utilisateur désactivé' : 'Utilisateur activé');
    } catch (err) {
      toast.error(err || 'Erreur lors du changement de statut');
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}



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

            {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Chargement des utilisateurs...</p>
            </div>
          ):(
        <UserTable users={filteredUsers} onDelete={handleDelete} onEdit={handleEdit} onToggle={handleToggle} />
           )}


           {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-6">
            <p className="text-gray-600"> Aucun utilisateur trouvé</p>
          </div>
        )}
      {ConfirmDialog}
      </div>
    </AdminLayout>
  );
};

export default UserList;
