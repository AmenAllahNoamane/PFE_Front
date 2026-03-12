import { Link } from 'react-router';
import { ShieldAlert, Home } from 'lucide-react';

// ========================================
// ⛔ PAGE ACCÈS NON AUTORISÉ
// ========================================

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
          <ShieldAlert className="text-red-600" size={48} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Accès non autorisé
        </h1>
        
        <p className="text-gray-600 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home size={20} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
