import api from './axiosConfig';

const auditService = {

  // Liste tous les logs avec filtres et pagination (Admin)
  async getAllLogs({ page = 1, limit = 20, userId, action, entityType, dateDebut, dateFin } = {}) {
    try {
      const params = { page, limit };
      if (userId) params.userId = userId;
      if (action) params.action = action;
      if (entityType) params.entityType = entityType;
      if (dateDebut) params.dateDebut = dateDebut;
      if (dateFin) params.dateFin = dateFin;

      const response = await api.get('/audit/getAllLogs', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de chargement des logs';
      throw message;
    }
  },

  // Récupérer un log par ID (Admin)
  async getLogById(id) {
    try {
      const response = await api.get(`/audit/getLogById/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de chargement du log';
      throw message;
    }
  },

};

export default auditService;