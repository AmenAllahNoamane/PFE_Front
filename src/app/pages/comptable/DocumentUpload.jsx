import { useState } from 'react';
//import { useNavigate } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import documentService from '../../api/documentService';

//  PAGE UPLOAD DE DOCUMENT (COMPTABLE)

const DocumentUpload = () => {
  //const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Gérer le drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Vérifier la taille du fichier (max 10MB)
    setError('');
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximale : 10MB');
      return;
    }

    // Vérifier le type de fichier
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Formats acceptés : PDF, JPG, PNG');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError('')
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError('')
    setSuccess(false);
    try {
      await documentService.uploadDocument(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      setSuccess(true);
      setUploading(false);
      
    } catch (err) {
      setError('Erreur lors de l\'upload');
      console.error(err)
      setUploading(false);
      setUploadProgress(0);
    }

  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Uploader un document</h1>
          <p className="text-gray-600 mt-2">Formats acceptés : PDF, JPG, PNG (Max 10MB)</p>
        </div>

         {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-green-800 font-medium">✓ Document uploadé avec succès </p>
             
            </div>
          </div>
        )}

        {/* Zone de drop */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Upload className="text-blue-600" size={40} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Glissez-déposez votre fichier ici
              </h3>
              <p className="text-gray-600 mb-6">ou</p>

              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload size={20} />
                Parcourir les fichiers
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                />
              </label>

              <p className="text-sm text-gray-500 mt-6">
                Formats acceptés : PDF, JPG, PNG • Taille max : 10MB
              </p>
            </div>
          ) : (
            <div>
              {/* Fichier sélectionné */}
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <File className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <button
                    onClick={removeFile}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              {/* Barre de progression */}
              {uploading && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Upload en cours...</span>
                    <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Bouton d'upload */}
              {!uploading && (
                <button
                  onClick={handleUpload}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  <CheckCircle size={24} />
                  Uploader et traiter le document
                </button>
              )}
            </div>
          )}
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">ℹ️ Que se passe-t-il après l'upload ?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Le document est analysé par OCR pour extraire le texte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>L'IA classifie automatiquement le type de document</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Les données importantes sont extraites (montant, date, client, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">���</span>
              <span>Vous pourrez ensuite valider ou corriger les données extraites</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DocumentUpload;
