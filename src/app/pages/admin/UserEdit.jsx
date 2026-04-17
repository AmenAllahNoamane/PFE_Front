import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import UserForm from '../../components/users/UserForm';
import userService from '../../api/userService';
import { ArrowLeft,Loader2, Edit} from 'lucide-react';
import toast from 'react-hot-toast';
import useConfirm from '../../components/useConfirm';


//  PAGE MODIFICATION D'UTILISATEUR

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { confirm, ConfirmDialog } = useConfirm();


// Charger l'utilisateur à modifier
  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getUserById(id);
      setUser(data);
    } catch (err) {
      setError( 'Erreur de chargement');
      console.error('Erreur loadUser:', err);
    } finally {
      setLoading(false);
    }
  };


  // if (!user) {
  //   return (
  //     <AdminLayout>
  //       <div className="text-center py-12">
  //         <p className="text-gray-600">Utilisateur non trouvé</p>
  //       </div>
  //     </AdminLayout>
  //   );
  // }

  const handleSubmit = async (userData) => {
       try {
      setSubmitting(true);
      setError('');
      
      await userService.updateUser(id, userData);
      
      toast.success('Utilisateur modifié avec succès !');
      navigate('/admin/users');
    } catch (err) {
      setError(err || 'Erreur lors de la modification');
      console.error('Erreur update:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    const ok = await confirm({
    title: 'Annuler les modifications ?',
    description: 'Les modifications non sauvegardées seront perdues.',
    variant: 'danger',
  });
  if (!ok) return;
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

          <h1 className="text-3xl font-bold text-gray-900">Modifier l'utilisateur</h1>
          <p className="text-gray-600 mt-2">Mettez à jour les informations de {user ? user.nom : ''}</p>
        </div>
         {/* Chargement */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Formulaire */}
        {!loading && user && (
         
            <UserForm
              user={user}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={submitting}
              isEdit={true}
            />
    
        )}
        {ConfirmDialog}
      </div>
    </AdminLayout>
  );
};

export default UserEdit;
