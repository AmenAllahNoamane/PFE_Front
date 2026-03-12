import axios from 'axios';



const API_URL = 'http://localhost:5000/';  //URL tb3 backend


// Créer une instance Axios b3dika nwaliw n3ytoulha biha toul 
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gère automatiquement les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Token expiré ou invalide
    if (error.response?.status === 401 && window.location.pathname !== '/login')  {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;