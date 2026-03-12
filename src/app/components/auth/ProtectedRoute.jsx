import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

// ========================================
//  COMPOSANT PROTECTED ROUTE



// Protège les routes en vérifiant l'authentification et le rôle
// 
// HIÉRARCHIE DES RÔLES :
// - admin : peut accéder à TOUT (admin, manager, comptable)
// - manager : peut accéder à manager + comptable
// - comptable : peut accéder uniquement à comptable

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // VÉRIFICATION DE LA HIÉRARCHIE DES RÔLES
  
  const hasAccess = () => {
    // Si pas de restriction de rôle, tout le monde peut accéder
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    // ADMIN a accès à tout
    if (user.role === 'ADMIN') {
      return true;
    }

    // MANAGER a accès à manager + comptable
    if (user.role === 'MANAGER') {
      return allowedRoles.includes('MANAGER') || allowedRoles.includes('COMPTABLE');
    }

    // COMPTABLE a accès uniquement à comptable
    if (user.role === 'COMPTABLE') {
      return allowedRoles.includes('COMPTABLE');
    }

    return false;
  };

  // Vérifier l'accès
  if (!hasAccess()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;