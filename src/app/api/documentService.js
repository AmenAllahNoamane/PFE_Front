import api from "./axiosConfig";

class DocumentService {
  async uploadDocument(file, onUploadProgress) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/documents/upload-analyse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onUploadProgress(percentCompleted);
          }
        },
      });

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || "Erreur lors de l\'upload'";
      throw message;
    }
  }

  async getMyDocuments() {
    try {
      const response = await api.get("/documents/MyDocuments");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || "Erreur lors de chargement";
      throw message;
    }
  }

  // TOUS LES DOCUMENTS (Manager/Admin)

  async getAllDocuments() {
    try {
      const response = await api.get("/documents/all");
      return response.data;
    } catch (error) {
      const message =error.response?.data?.error || "Erreur lors de chargement";
      throw message;
    }
  }

  // SUPPRIMER DOCUMENT

  async deleteDocument(id) {
    try {
      const response = await api.delete(`documents/delete/${id}`);
      return response.data;
    } catch (error) {
      const message =error.response?.data?.error || "Erreur lors de suppression ";
      throw message;    }
  }

  // DÉTAILS DOCUMENT

  async getDocumentById(id) {
    try {
      const response = await api.get(`/documents/DocumentById/${id}`);
      return response.data;
    } catch (error) {
      const message =error.response?.data?.error || "Erreur lors de chargement";
      throw message;
    }
  }
// sprint 2
  // Sauvegarder les corrections manuelles (bcFields + bcLines)

  // Appelé par handleSave dans DocumentDetail

  async updateAnalyse(id, { bcFields, bcLines }) {
    try {
      const response = await api.put(`/documents/updateAnalyse/${id}`, {bcFields, bcLines,});
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Erreur lors de la sauvegarde";
    }
  }

   // Valider le document (statut → VALIDE)
  // Appelé par handleValidate dans DocumentDetail
  async validateDocument(id, { bcFields, bcLines }) {
    try {
      const response = await api.post(`/documents/validate/${id}`, {bcFields, bcLines,});
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Erreur lors de la validation";
    }
  }
 async rejectDocument(id, { reason }) {
    try {
      const response = await api.post(`/documents/reject/${id}`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Erreur lors du rejet";
    }
  }

// Charge le fichier avec le token JWT et retourne un blob URL
async getFileBlob(id) {
  try {
    const response = await api.get(`/documents/file/${id}`, {
      responseType: 'blob',  // axios retourne un blob directement
    });
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw error.response?.data?.error || 'Erreur lors du chargement du fichier';
  }
}

async getDashboardStats() {
  try {
    const response = await api.get('/documents/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erreur lors du chargement des statistiques';
  }




}
async downloadDocument(id, originalName) {
  try {
    const response = await api.get(`/documents/download/${id}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });

    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = originalName;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

  } catch (error) {
    throw error.response?.data?.error || 'Erreur lors du téléchargement';
  }
}

async sendToBC(id) {
  try {
    const response = await api.post(`/documents/send-to-bc/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erreur lors de l\'envoi vers Business Central';
  }
}


}
export default new DocumentService();
