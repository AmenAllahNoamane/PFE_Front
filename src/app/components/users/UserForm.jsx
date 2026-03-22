import { useState ,useEffect } from 'react';
import { Save, X ,Loader2} from 'lucide-react';

// ========================================
// 📝 COMPOSANT FORMULAIRE UTILISATEUR
// ========================================
// Formulaire pour créer ou modifier un utilisateur
// Utilisé dans UserCreate et UserEdit

const UserForm = ({ user, onSubmit, onCancel,loading ,isEdit = false}) => {
  // ========================================
  // ÉTAT LOCAL DU FORMULAIRE
  // ========================================
  // Si on édite un utilisateur, on pré-remplit avec ses données
  // Sinon, on utilise des valeurs par défaut
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email:'',
    role: 'COMPTABLE',
    isActive: false ,
    password: '' // Toujours vide au départ (sécurité)
  });
   const [errors, setErrors] = useState({});
  // ========================================
  // GESTION DES CHANGEMENTS DANS LE FORMULAIRE
  // ========================================


    // Charger les données de l'utilisateur en mode édition
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // Ne pas pré-remplir le mot de passe
        nom: user.nom || '',
        prenom: user.prenom || '',
        role: user.role || 'COMPTABLE',
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    }
  }, [user]);







   // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value,type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
       [name]: type === "checkbox" ? checked : value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  // Validation
  const validate = () => {
    const newErrors = {};
    const email =formData.email.trim();

    if (!email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide'
      console.log(formData.email)
    }

    // Mot de passe obligatoire seulement à la création
    if (!isEdit && !formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Nom requis';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Prénom requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // ========================================
  // SOUMISSION DU FORMULAIRE
  // ========================================
 // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Préparer les données
    const dataToSubmit = { ...formData };
     

    
    // Ne pas envoyer le mot de passe vide en mode édition
    if (isEdit && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onSubmit(dataToSubmit);
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        {/* ===== CHAMP Prenom ===== */}
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
            Prénom {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.prenom ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Marie"
          />
           {errors.prenom && (
            <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
          )}
        </div>

         {/* ===== CHAMP Nom ===== */}


        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
            Nom  {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Dupont"
          />
           {errors.nom && (
            <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
          )}
        </div>

        {/* ===== CHAMP EMAIL ===== */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            //required
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
            placeholder="jean.dupont@company.com"
          />
          {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        </div>

        {/* ===== CHAMP MOT DE PASSE ===== */}
        <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe {!isEdit && <span className="text-red-500">*</span>}
         {/* {isEdit && <span className="text-gray-500 text-xs">(Laisser vide pour ne pas changer)</span>}*/}
        </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!user} // Requis uniquement en création
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
            placeholder={isEdit ? "Laisser vide pour ne pas changer" : "••••••••"}
          />
          {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
   
          {isEdit && (
            <p className="text-xs text-gray-500 mt-1">
              Laissez ce champ vide si vous ne souhaitez pas modifier le mot de passe
            </p>
          )}
        </div>

        {/* ===== CHAMP RÔLE ===== */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Rôle 
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="COMPTABLE">Comptable</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Administrateur</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hiérarchie : Admin &gt; Manager &gt; Comptable
          </p>
        </div>

        {/* ===== CHAMP STATUT ===== */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
          Compte actif
        </label>
      </div>
            
       
      </div>

      {/* ===== BOUTONS D'ACTION ===== */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
        {/* Bouton Sauvegarder */}
        <button
          type="submit"
            disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={18} />
          {isEdit  ? 'Mettre à jour' : 'Créer'}
           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </button>
        
        {/* Bouton Annuler */}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <X size={18} />
          Annuler
        </button>
      </div>
    </form>
  );
};

export default UserForm;