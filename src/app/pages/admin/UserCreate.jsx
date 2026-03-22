import { useNavigate } from 'react-router';
import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import UserForm from '../../components/users/UserForm';
import { ArrowLeft ,UserPlus } from 'lucide-react';
import userService from '../../api/userService';
// ========================================
//  PAGE CRÉATION D'UTILISATEUR
// ========================================

const UserCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      await userService.createUser(userData);
      
      
      alert('Utilisateur créé avec succès !');
      navigate('/admin/users');
    } catch (err) {
      
      setError('Erreur lors de la création');
      console.error('Erreur create:', err);
    } finally {
      setLoading(false);
    }
  };
;

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Retour à la liste
          </button>

          <h1 className="text-3xl font-bold text-gray-900"><UserPlus className="w-8 h-8" /> Créer un nouvel utilisateur</h1>
      
          <p className="text-gray-600 mt-2">Remplissez les informations ci-dessous</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Formulaire */}
       
        <UserForm onSubmit={handleSubmit} onCancel={handleCancel}  loading={loading} />
        
      </div>
    </AdminLayout>
  );
};

export default UserCreate;
