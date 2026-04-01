import api from './axiosConfig';

// Gestion des utilisateurs 

const userService = {

// Liste tous les utilisateurs (Admin/Manager)
  async getAllUsers() {
    try{

    
    const response = await api.get('/users/getAllUsers');
    return response.data;
   }catch(error){
     const message = error.response?.data?.error || 'Erreur de chargement';
     throw message;
   }
  },

// Récupérer un utilisateur par ID
  async getUserById(id) {
    const response = await api.get(`/users/getUserById/${id}`);
    return response.data;
  },


 // Créer un utilisateur (Admin)
  async createUser(userData) {
    try{
    const response = await api.post('/users/addUser', userData);
    console.log(response)
    return response.data;
    }catch(error)
    {
       const message = error.response?.data?.error || 'Erreur lors de la création ';
       console.log(message)

       
      throw message;
    }
  },

// Supprimer un utilisateur (Admin)
  async deleteUser(id) {
    try{

    
    const response = await api.delete(`/users/deleteUserById/${id}`);
    return response.data;
    }catch(error){
      const message = error.response?.data?.error || 'Erreur de suppression';
      throw message;

    }
  },


  // Activer/Désactiver (Admin)
  async toggleUser(id) {
    try{

    
    const response = await api.patch(`/users/toggle/${id}`);
    return response.data;
    }catch(error){
      const message = error.response?.data?.error || 'Erreur de changement de statut';
    throw message;

    }
  },

  // Mon profil
  async getMyProfile() {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Modifier mon profil
  async updateMyProfile(userData) {
    try{

      const response = await api.patch('/users/updateMe', userData);
      return response.data;

     }catch(error){
      const message = error.response?.data?.error || 'Erreur de modification';
      throw message;
     }
  },

    // Modifier un utilisateur (Admin)
  async updateUser(id, userData) {
    try{

    
    const response = await api.patch(`/users/updateUserByAdmin/${id}`, userData);
    return response.data;
    }catch(error){
      const message= error.response?.data?.error ||  'Erreur de modification';
    }
  },



};
export default userService;