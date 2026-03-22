import api from "./axiosConfig";

class DocumentService {
  async uploadDocument(file, onUploadProgress) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/documents/upload", formData, {
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
      const response = await api.get("/documents/myDocuments");
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
}
export default new DocumentService();
