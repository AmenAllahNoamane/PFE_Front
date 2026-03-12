import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import { Lock, Mail, AlertCircle } from 'lucide-react';


//  PAGE DE CONNEXION

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation simple
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }
    
   try {
    // Appeler l'API réelle au lieu de mockUsers
    const result = await login(email, password);
    console.log(result.user.role)

    // Redirection selon le rôle
    if (result.user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (result.user.role === 'MANAGER') {
      navigate('/manager/dashboard');
    } else {
      navigate('/comptable/dashboard');
    }
  } catch (err) {
        console.error("Détail de l'erreur:", err);

        setError(err);
  }
   finally {

    setLoading(false);
  }
  };

  // Fonction pour remplir automatiquement les identifiants (pour démo)
  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@ged.com');
      setPassword('admin123');
    } else if (role === 'manager') {
      setEmail('manager@ged.com');
      setPassword('manager123');
    } else if (role === 'comptable') {
      setEmail('comptable@company.com');
      setPassword('comptable123');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">DocuManage</h1>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="votre.email@company.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Comptes de démonstration */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Comptes de démonstration :</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => fillCredentials('admin')}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => fillCredentials('manager')}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Manager
              </button>
              <button
                onClick={() => fillCredentials('comptable')}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Comptable
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 DocuManage - Gestion Documentaire Intelligente
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
