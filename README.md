# 📄 DocuManage - Application de Gestion Documentaire Intelligente

Application web de traitement automatisé de documents comptables (factures, bons de commande, contrats) avec OCR, classification IA et intégration Microsoft Business Central.

## 🎯 Fonctionnalités Principales

- **OCR et IA** : Extraction automatique de données des documents
- **Classification** : Reconnaissance automatique du type de document
- **Validation humaine** : Interface de correction et validation
- **Intégration Business Central** : Envoi des documents validés
- **Gestion multi-utilisateurs** : 3 rôles avec hiérarchie des permissions

---

## 👥 Rôles et Hiérarchie

### Hiérarchie des permissions (important) :
```
ADMIN > MANAGER > COMPTABLE
```

### 🔴 ADMIN
- Accès à **TOUTES** les fonctionnalités
- Gestion des utilisateurs (CRUD)
- Logs d'audit complets
- Vue sur tous les documents
- Peut uploader et valider des documents

### 🟡 MANAGER
- Accès aux fonctionnalités Manager + Comptable
- Dashboard avec statistiques globales
- Vue sur tous les documents de l'entreprise
- Validation des documents
- Logs d'audit
- Peut uploader des documents

### 🟢 COMPTABLE
- Accès uniquement à ses propres documents
- Upload de nouveaux documents
- Validation/correction de ses documents
- Vue limitée à ses uploads

---

## 🚀 Démarrage Rapide

### Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@company.com` | `admin123` |
| Manager | `manager@company.com` | `manager123` |
| Comptable | `comptable@company.com` | `comptable123` |

### Connexion
1. Ouvrir l'application
2. Cliquer sur un des boutons de rôle pour auto-remplir
3. Cliquer sur "Se connecter"

---

## 📁 Structure du Projet

```
src/app/
├── components/          # Composants réutilisables
│   ├── auth/           # Authentification
│   │   └── ProtectedRoute.jsx
│   └── users/          # Gestion utilisateurs
│       ├── UserTable.jsx
│       └── UserForm.jsx
│
├── contexts/           # Contextes React (état global)
│   └── AuthContext.jsx
│
├── layouts/            # Layouts de pages
│   ├── AuthLayout.jsx
│   └── AdminLayout.jsx
│
├── pages/              # Pages de l'application
│   ├── auth/
│   │   └── Login.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── UserList.jsx
│   │   ├── UserCreate.jsx
│   │   ├── UserEdit.jsx
│   │   └── AuditLog.jsx
│   ├── manager/
│   │   ├── Dashboard.jsx
│   │   └── DocumentList.jsx
│   ├── comptable/
│   │   ├── Dashboard.jsx
│   │   ├── DocumentList.jsx
│   │   └── DocumentUpload.jsx
│   ├── shared/
│   │   └── DocumentDetail.jsx
│   └── Unauthorized.jsx
│
├── utils/              # Utilitaires
│   └── mockData.js
│
├── routes.jsx          # Configuration des routes
└── App.jsx             # Composant principal
```

---

## 🧩 Composants Principaux

### 1. **AuthContext** (`contexts/AuthContext.jsx`)
Gère l'authentification et la session utilisateur
- Connexion/Déconnexion
- Stockage dans localStorage
- Vérification des rôles

### 2. **ProtectedRoute** (`components/auth/ProtectedRoute.jsx`)
Protège les routes selon la hiérarchie des rôles
- Vérifie l'authentification
- Applique la hiérarchie Admin > Manager > Comptable
- Redirige vers /unauthorized si refusé

### 3. **AdminLayout** (`layouts/AdminLayout.jsx`)
Layout principal avec sidebar et navbar
- Navigation dynamique selon le rôle
- Sections organisées (Administration, Gestion, Documents)
- Responsive (desktop + mobile)

### 4. **UserTable** (`components/users/UserTable.jsx`)
Tableau d'affichage des utilisateurs
- Liste paginée
- Actions : Modifier, Supprimer
- Badges de statut

### 5. **UserForm** (`components/users/UserForm.jsx`)
Formulaire création/modification utilisateur
- Validation des champs
- Gestion mot de passe optionnel en édition
- Sélection rôle et statut

---

## 📊 Données Mock

Fichier : `utils/mockData.js`

### Utilisateurs (5)
- 1 Admin, 1 Manager, 2 Comptables, 1 Inactif

### Documents (8)
- Factures Achat/Vente
- Bons de Commande
- Contrats
- Statuts : en_cours, validé, rejeté, dans_bc

### Logs d'audit (15)
- Historique complet des actions

---

## 🎨 Technologies Utilisées

- **React 18** : Framework JavaScript
- **React Router 7** : Navigation
- **Tailwind CSS v4** : Styling
- **Lucide React** : Icônes
- **Recharts** : Graphiques (Dashboard Manager)
- **Context API** : Gestion d'état global

---

## 🔒 Sécurité

### Implémenté
- ✅ Protection des routes par rôle
- ✅ Vérification hiérarchique des permissions
- ✅ Session persistante (localStorage)
- ✅ Redirection automatique si non autorisé
- ✅ Mot de passe non stocké en session

### À implémenter (production)
- ⚠️ Authentification JWT
- ⚠️ Hash des mots de passe (bcrypt)
- ⚠️ API Backend réelle
- ⚠️ HTTPS obligatoire
- ⚠️ Rate limiting

---

## 📝 Pages Disponibles

### Admin
- `/admin/dashboard` - Dashboard admin
- `/admin/users` - Liste utilisateurs
- `/admin/users/create` - Créer utilisateur
- `/admin/users/:id/edit` - Modifier utilisateur
- `/admin/audit` - Logs d'audit

### Manager
- `/manager/dashboard` - Dashboard manager
- `/manager/documents` - Tous les documents
- `/manager/documents/:id` - Détail document
- `/manager/audit` - Logs d'audit

### Comptable
- `/comptable/dashboard` - Dashboard comptable
- `/comptable/upload` - Upload document
- `/comptable/documents` - Mes documents
- `/comptable/documents/:id` - Détail document

### Publiques
- `/login` - Connexion
- `/unauthorized` - Accès refusé

---

## 🎓 Guide pour Développeurs

### Ajouter un nouveau rôle

1. **Mettre à jour `mockData.js`**
```javascript
export const mockUsers = [
  {
    id: 6,
    role: 'nouveau_role',
    // ...
  }
];
```

2. **Mettre à jour `AdminLayout.jsx`**
```javascript
if (user.role === 'nouveau_role') {
  links.push({
    path: '/nouveau-role/page',
    label: 'Ma Page',
    icon: IconName
  });
}
```

3. **Créer les pages dans `pages/nouveau-role/`**

4. **Ajouter les routes dans `routes.jsx`**
```javascript
{
  path: '/nouveau-role/page',
  element: (
    <ProtectedRoute allowedRoles={['nouveau_role']}>
      <NouvellePage />
    </ProtectedRoute>
  )
}
```

### Ajouter une nouvelle page

1. Créer le fichier dans `pages/`
2. Importer `AdminLayout` si page protégée
3. Ajouter la route dans `routes.jsx`
4. Ajouter le lien dans `AdminLayout.jsx`

---

## 🐛 Dépannage

### La page ne s'affiche pas
- Vérifier que vous êtes connecté
- Vérifier que votre rôle a accès à cette page
- Ouvrir la console (F12) pour voir les erreurs

### Je suis redirigé vers /unauthorized
- Votre rôle n'a pas accès à cette page
- Vérifier la hiérarchie : Admin > Manager > Comptable

### Les données ne se sauvegardent pas
- Normal, les données sont mockées (simulation)
- En production, il faut un backend API

---

## 📚 Ressources

- [Documentation React](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Recharts](https://recharts.org)

---

## 📄 Licence

Projet d'étude - Usage éducatif uniquement

---

## 👨‍💻 Auteur

Projet de fin d'études - Application de Gestion Documentaire Intelligente
