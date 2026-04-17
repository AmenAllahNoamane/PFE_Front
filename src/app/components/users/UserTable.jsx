import { Edit, Trash2, CheckCircle, XCircle,Power } from 'lucide-react';
import { Link } from 'react-router';

// ========================================
// 📋 COMPOSANT TABLEAU DES UTILISATEURS
// ========================================
// Affiche la liste des utilisateurs dans un tableau
// Permet la modification et la suppression

const UserTable = ({ users, onDelete , onEdit , onToggle  }) => {
    // Labels des rôles
  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'MANAGER':
        return 'Manager';
      case 'COMPTABLE':
        return 'Comptable';
      default:
        return role;
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* En-tête du tableau */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Corps du tableau */}
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* Colonne Utilisateur avec avatar */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {/* Avatar avec initiale */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.prenom?.[0]}{user.nom?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900"> {user.prenom} {user.nom}</p>
                    </div>
                  </div>
                </td>

                {/* Colonne Email */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-600">{user.email}</p>
                </td>

                {/* Colonne Rôle */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {getRoleLabel(user.role)}
                  </span>
                </td>

                {/* Colonne Statut */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isActive  ?  <CheckCircle size={14} />: <XCircle size={14} />}
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>

                {/* Colonne Dernière connexion */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-600"> A FAIRE </p>
                </td>

                {/* Colonne Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Bouton Modifier */}
                    <button
                       onClick={() => onEdit(user.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  
                      title="Modifier"
                  >
                      <Edit size={18} />
                    </button>
                    

                     {/* Bouton Activer/Désactiver */}
                  <button
                    onClick={() => onToggle(user.id,user.isActive)}
                    className={`p-2 rounded transition-colors ${
                      user.isActive
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                    }`}
                    title={user.isActive ? 'Désactiver' : 'Activer'}
                  >
                    <Power className="w-4 h-4" />
                  </button>



                    {/* Bouton Supprimer */}
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;