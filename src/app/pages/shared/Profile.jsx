import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../layouts/AdminLayout';
import userService from '../../api/userService';
import authService from '../../api/authService';
import {
    User,
    Mail,
    Lock,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Calendar,
    FileText,
    Activity,
    Bell,
    Globe,
    Shield
} from 'lucide-react';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();

    // ========================================
    // ÉTATS DU COMPOSANT
    // ========================================

    // Données du profil
    const [profile, setProfile] = useState({
        nom: '',
        prenom: '',
        email: '',
        role: '',
        createdAt: '',
        updatedAt: '',
        lastLogin: ''
    });

    // Formulaire d'édition du profil
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: ''
    });

    // Changement de mot de passe
    const [passwordMode, setPasswordMode] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordStrength, setPasswordStrength] = useState(0);

    // États UI
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    // ========================================
    // CHARGEMENT DU PROFIL
    // ========================================
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await userService.getMyProfile();
            setProfile(data);
            setFormData({
                nom: data.nom,
                prenom: data.prenom,
                email: data.email
            });
        } catch (err) {
            setError('Erreur lors du chargement du profil');
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // GESTION DES CHANGEMENTS FORMULAIRE
    // ========================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'newPassword') {
            calculatePasswordStrength(value);
        }
        setError('');
    };

    // ========================================
    // CALCUL FORCE DU MOT DE PASSE
    // ========================================
    const calculatePasswordStrength = (password) => {
        let strength = 0;

        if (password.length >= 6) {

            strength += 25;
        }
        if (password.length >= 10) {
            strength += 25;
        }
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            strength += 25;
        }
        if (/[0-9]/.test(password)) {
            strength += 15;
        }

        if (/[^a-zA-Z0-9]/.test(password)) {
            strength += 10;
        }
        setPasswordStrength(Math.min(strength, 100));
    };

    const getPasswordStrengthLabel = () => {
        if (passwordStrength < 25) return { label: 'Très faible', color: 'bg-red-500' };
        if (passwordStrength < 50) return { label: 'Faible', color: 'bg-orange-500' };
        if (passwordStrength < 75) return { label: 'Moyen', color: 'bg-yellow-500' };
        return { label: 'Fort', color: 'bg-green-500' };
    };

   
    // SOUMISSION FORMULAIRE PROFIL
  
    const handleSubmitProfile = async (e) => {
        e.preventDefault();

        if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim()) {
            setError('Tous les champs sont requis');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email invalide');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const result = await userService.updateMyProfile(formData);

            setProfile(result.user);

            // Mettre à jour le contexte Auth
            updateUser({
                nom: result.user.nom,
                prenom: result.user.prenom,
                email: result.user.email
            });

            setSuccess('Profil mis à jour avec succès !');
            setEditMode(false);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
            console.error(err)
        } finally {
            setSaving(false);
        }
    };

    // ========================================
    // SOUMISSION CHANGEMENT MOT DE PASSE
    // ========================================
    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError('Tous les champs sont requis');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (passwordData.oldPassword === passwordData.newPassword) {
            setError('Le nouveau mot de passe doit être différent de l\'ancien');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            await authService.updatePassword(passwordData.oldPassword, passwordData.newPassword);

            setSuccess('Mot de passe modifié avec succès !');
            setPasswordMode(false);
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordStrength(0);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err);
            console.error(err)
        } finally {
            setSaving(false);
        }
    };

    // ========================================
    // ANNULATION
    // ========================================
    const cancelEdit = () => {
        setEditMode(false);
        setFormData({
            nom: profile.nom,
            prenom: profile.prenom,
            email: profile.email
        });
        setError('');
    };

    const cancelPassword = () => {
        setPasswordMode(false);
        setPasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordStrength(0);
        setError('');
    };

    // ========================================
    // FORMATAGE DATES
    // ========================================
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // ========================================
    // MAPPING DES RÔLES
    // ========================================
    const roleLabels = {
        ADMIN: 'Administrateur',
        MANAGER: 'Manager',
        COMPTABLE: 'Comptable'
    };

    const roleColors = {
        ADMIN: 'bg-purple-100 text-purple-800',
        MANAGER: 'bg-blue-100 text-blue-800',
        COMPTABLE: 'bg-green-100 text-green-800'
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">Chargement  des données ...</p>
                </div>
            </AdminLayout>
        );
    }


    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
                    <p className="text-gray-600 mt-2">Gérez vos informations personnelles et sécurité</p>
                </div>

                {/* Messages d'alerte */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne gauche : Carte utilisateur */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-200 mx-auto">
                                    <span className="text-5xl font-bold text-white">
                                        {profile.nom?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Informations de base */}
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{profile.nom} {profile.prenom}</h2>
                                <p className="text-gray-600 text-sm mt-1">{profile.email}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-3 ${roleColors[profile.role]}`}>
                                    {roleLabels[profile.role]}
                                </span>
                            </div>

                            {/* Informations supplémentaires */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Informations</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">Membre depuis</span>
                                        </div>
                                        <span className="text-sm text-gray-900">{formatDate(profile.createdAt)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">Dernière mise à jour</span>
                                        </div>
                                        <span className="text-sm text-gray-900">{formatDate(profile.updatedAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity size={16} className="text-green-500" />
                                            <span className="text-sm text-gray-600">Dernière connexion</span>
                                        </div>
                                        <span className="text-sm font-medium text-green-600">
                                            {formatDate(profile.lastLogin)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite : Onglets */}
                    <div className="lg:col-span-2">
                        {/* Onglets */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <User size={18} className="inline mr-2" />
                                        Profil
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Shield size={18} className="inline mr-2" />
                                        Sécurité
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Contenu des onglets */}

                        {/* ===== ONGLET PROFIL ===== */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                                    {!editMode && !passwordMode && (
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Modifier
                                        </button>
                                    )}
                                </div>

                                {!editMode ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <User className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Nom</p>
                                                <p className="font-medium text-gray-900">{profile.nom}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <User className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Prénom</p>
                                                <p className="font-medium text-gray-900">{profile.prenom}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Mail className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium text-gray-900">{profile.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Shield className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Rôle</p>
                                                <p className="font-medium text-gray-900">{roleLabels[profile.role]}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitProfile} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom *
                                            </label>
                                            <input
                                                type="text"
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prénom *
                                            </label>
                                            <input
                                                type="text"
                                                name="prenom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                required
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {saving ? 'Enregistrement...' : 'Enregistrer'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* ===== ONGLET SÉCURITÉ ===== */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Sécurité du compte</h2>
                                    {!passwordMode && !editMode && (
                                        <button
                                            onClick={() => setPasswordMode(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Changer le mot de passe
                                        </button>
                                    )}
                                </div>

                                {!passwordMode ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Lock className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Mot de passe</p>
                                                <p className="font-medium text-gray-900">••••••••</p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h3 className="text-sm font-semibold text-blue-900 mb-2">Conseils de sécurité</h3>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                                <li>• Utilisez un mot de passe d'au moins 6 caractères</li>
                                                <li>• Combinez lettres majuscules, minuscules et chiffres</li>
                                                <li>• Ne réutilisez pas vos mots de passe</li>
                                                <li>• Changez votre mot de passe régulièrement</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitPassword} className="space-y-4">
                                        {/* Ancien mot de passe */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ancien mot de passe *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.old ? 'text' : 'password'}
                                                    name="oldPassword"
                                                    value={passwordData.oldPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Nouveau mot de passe */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nouveau mot de passe *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.new ? 'text' : 'password'}
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                    required
                                                    minLength={6}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>

                                            {/* Indicateur de force */}
                                            {passwordData.newPassword && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-600">Force du mot de passe</span>
                                                        <span className={`text-xs font-medium ${passwordStrength < 50 ? 'text-red-600' :
                                                            passwordStrength < 75 ? 'text-yellow-600' :
                                                                'text-green-600'
                                                            }`}>
                                                            {getPasswordStrengthLabel().label}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${getPasswordStrengthLabel().color}`}
                                                            style={{ width: `${passwordStrength}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirmer mot de passe */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmer le mot de passe *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.confirm ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {saving ? 'Modification...' : 'Modifier le mot de passe'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelPassword}
                                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Profile;