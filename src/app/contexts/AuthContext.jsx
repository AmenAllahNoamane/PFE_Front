import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';



// Gère l'état de connexion de l'utilisateur dans toute l'application
// Utilise localStorage pour persister la session

const AuthContext = createContext(null);

// Provider qui enveloppe l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  // CHARGEMENT DE LA SESSION AU DÉMARRAGE
  
  // Vérifie si un utilisateur est déjà connecté (localStorage)
  useEffect(() => {
  const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  
  // FONCTION DE CONNEXION

  
  // Vérifie les identifiants et connecte l'utilisateur

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    }

  };

  
  // FONCTION DE DÉCONNEXION
  
  // Supprime la session utilisateur
  const logout = () => {
    authService.logout();

    setUser(null);

  };

  // Valeurs exposées à tous les composants enfants
  const value = {
    user,           // Utilisateur connecté
    loading,        // État de chargement
    login,          // Fonction de connexion
    logout,         // Fonction de déconnexion
   
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ========================================
// HOOK PERSONNALISÉ POUR UTILISER LE CONTEXT
// ========================================
// Simplifie l'utilisation du context dans les composants
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};