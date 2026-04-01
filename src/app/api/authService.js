import api from './axiosConfig';

const authService = {

// Login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

    
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);  //  Sauvegarder le token
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Sauvegarder  les infos utilisateur
      }

      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de connexion';
      throw message;
    }
  },

 // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

// Récupérer l'utilisateur connecté
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    let user;
    if(userStr){
        user= JSON.parse(userStr)
    }else{
        user = null
    }
    return user;
  },

  // Vérifier si connecté
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Récupérer mes infos depuis l'API
  async getMe() {
    try {
      const response = await api.get('/auth/getMe');
      return response.data.user;
    } catch (error) {
      throw error.response?.data?.error || 'Erreur';
    }
  },

// Changer mon mot de passe
  async updatePassword(oldPassword, newPassword) {
    try {
      
      const response = await api.patch('/users/updatePassword', {
        oldPassword,
        newPassword,
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Erreur';
    }
  },

}
export default authService;