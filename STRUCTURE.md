# 📐 Architecture et Structure du Projet

Ce document explique en détail l'organisation du code et les concepts utilisés.

---

## 🏗️ Architecture Globale

```
Application React (SPA - Single Page Application)
│
├── Authentification (Context API)
│   └── Session utilisateur persistante (localStorage)
│
├── Routing (React Router)
│   ├── Routes publiques (/login, /unauthorized)
│   └── Routes protégées (vérification rôle)
│
├── Layouts
│   ├── AuthLayout (pages publiques)
│   └── AdminLayout (pages protégées avec sidebar)
│
└── Pages
    ├── Admin (gestion système)
    ├── Manager (supervision)
    └── Comptable (opérationnel)
```

---

## 📂 Structure Détaillée

### `/src/app/`
Dossier principal de l'application

#### `App.jsx` - Point d'entrée
```javascript
// Enveloppe l'application avec :
// 1. AuthProvider (contexte authentification)
// 2. RouterProvider (gestion des routes)

import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

**Pourquoi cette structure ?**
- `AuthProvider` doit envelopper tout pour que tous les composants aient accès à l'authentification
- `RouterProvider` gère la navigation dans l'app

---

### `/src/app/routes.jsx` - Configuration des routes

```javascript
// Définit toutes les URLs de l'application
// et leurs composants associés

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  }
  // ... autres routes
]);
```

**Concepts clés :**
- Chaque route a un `path` (URL) et un `element` (composant)
- Les routes protégées sont enveloppées dans `<ProtectedRoute>`
- `allowedRoles` définit qui peut accéder à la route

---

### `/src/app/contexts/` - Gestion d'état global

#### `AuthContext.jsx` - Authentification

**Pourquoi un Context ?**
L'authentification doit être accessible partout dans l'app (navbar, sidebar, pages, etc.). Plutôt que de passer `user` en props partout, on utilise un Context.

**Comment ça marche :**

```javascript
// 1. Créer le Context
const AuthContext = createContext(null);

// 2. Provider qui wrap l'app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (email, password) => {
    // Logique de connexion
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook pour utiliser le context
export const useAuth = () => {
  return useContext(AuthContext);
};
```

**Utilisation dans un composant :**
```javascript
import { useAuth } from './contexts/AuthContext';

function MonComposant() {
  const { user, logout } = useAuth();
  
  return <p>Bonjour {user.name}</p>;
}
```

---

### `/src/app/components/` - Composants réutilisables

#### Principe des composants

Un composant = une fonction qui retourne du JSX (HTML-like)

**Exemple simple :**
```javascript
// Composant basique
const MonBouton = ({ texte, onClick }) => {
  return (
    <button onClick={onClick}>
      {texte}
    </button>
  );
};

// Utilisation
<MonBouton texte="Cliquez-moi" onClick={() => alert('Cliqué !')} />
```

#### `ProtectedRoute.jsx` - Sécurisation des routes

**Rôle :** Vérifier si l'utilisateur peut accéder à une page

```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Pas connecté → redirection login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Pas le bon rôle → redirection unauthorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // OK → afficher la page
  return children;
};
```

**Hiérarchie implémentée :**
```javascript
const hasAccess = () => {
  // Admin accède à TOUT
  if (user.role === 'admin') return true;
  
  // Manager accède à manager + comptable
  if (user.role === 'manager') {
    return allowedRoles.includes('manager') || 
           allowedRoles.includes('comptable');
  }
  
  // Comptable accède uniquement à comptable
  if (user.role === 'comptable') {
    return allowedRoles.includes('comptable');
  }
};
```

#### `UserTable.jsx` - Tableau des utilisateurs

**Structure d'un composant de présentation :**

```javascript
const UserTable = ({ users, onDelete }) => {
  // Props :
  // - users : données à afficher
  // - onDelete : fonction callback pour supprimer

  return (
    <table>
      <thead>
        {/* En-têtes de colonnes */}
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <button onClick={() => onDelete(user.id)}>
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

**Concepts clés :**
- `props` : données passées au composant
- `map()` : boucle pour afficher plusieurs éléments
- `key` : identifiant unique obligatoire dans les listes
- Callbacks : fonctions passées en props pour remonter les actions

#### `UserForm.jsx` - Formulaire

**Gestion d'état local avec useState :**

```javascript
const UserForm = ({ user, onSubmit }) => {
  // État local pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'comptable'
  });

  // Mise à jour d'un champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,      // Copie l'ancien état
      [name]: value // Met à jour le champ modifié
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement
    onSubmit(formData);  // Envoie les données au parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <button type="submit">Enregistrer</button>
    </form>
  );
};
```

**Pourquoi useState ?**
React ne re-rend que quand l'état change. Les variables normales ne déclenchent pas de re-render.

---

### `/src/app/layouts/` - Structures de pages

#### `AdminLayout.jsx` - Layout principal

**Rôle :** Fournir la structure commune (sidebar + navbar + contenu)

```javascript
const AdminLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div>
      {/* Sidebar à gauche */}
      <aside>
        <nav>
          {getNavigationLinks().map(link => (
            <Link to={link.path}>{link.label}</Link>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main>
        {children} {/* La page s'affiche ici */}
      </main>
    </div>
  );
};
```

**Navigation dynamique selon le rôle :**

```javascript
const getNavigationLinks = () => {
  const links = [];

  if (user.role === 'admin') {
    links.push(
      { path: '/admin/dashboard', label: 'Dashboard Admin' },
      { path: '/admin/users', label: 'Utilisateurs' },
      { path: '/manager/documents', label: 'Tous les documents' },
      { path: '/comptable/upload', label: 'Upload' }
    );
  } else if (user.role === 'manager') {
    links.push(
      { path: '/manager/dashboard', label: 'Dashboard' },
      { path: '/manager/documents', label: 'Documents' },
      { path: '/comptable/upload', label: 'Upload' }
    );
  } else if (user.role === 'comptable') {
    links.push(
      { path: '/comptable/dashboard', label: 'Dashboard' },
      { path: '/comptable/documents', label: 'Mes documents' },
      { path: '/comptable/upload', label: 'Upload' }
    );
  }

  return links;
};
```

**Responsive :**
- Desktop : sidebar fixe à gauche
- Mobile : sidebar en overlay avec bouton menu

---

### `/src/app/pages/` - Pages de l'application

#### Structure d'une page

```javascript
import AdminLayout from '../../layouts/AdminLayout';

const MaPage = () => {
  // 1. États locaux
  const [data, setData] = useState([]);

  // 2. Hooks (useAuth, useNavigate, etc.)
  const { user } = useAuth();
  const navigate = useNavigate();

  // 3. Fonctions handlers
  const handleAction = () => {
    // Logique
  };

  // 4. useEffect pour chargement initial
  useEffect(() => {
    // Charger les données
  }, []);

  // 5. Render JSX
  return (
    <AdminLayout>
      <h1>Ma Page</h1>
      {/* Contenu */}
    </AdminLayout>
  );
};

export default MaPage;
```

#### Pages Admin

**Dashboard.jsx**
- Affiche les statistiques globales
- Utilise des composants de cards pour les KPIs
- Liste les derniers utilisateurs et actions

**UserList.jsx**
- État : `users` (liste), `searchTerm` (recherche)
- Filtre les utilisateurs selon la recherche
- Passe les données filtrées à `<UserTable />`

**UserCreate.jsx**
- Affiche `<UserForm />` sans données (création)
- `onSubmit` : crée l'utilisateur (API mock)
- `onCancel` : retour à la liste

**UserEdit.jsx**
- Récupère l'ID depuis l'URL avec `useParams()`
- Trouve l'utilisateur dans mockData
- Affiche `<UserForm user={user} />` (édition)

#### Pages Manager

**Dashboard.jsx**
- Graphiques avec Recharts (PieChart, BarChart)
- Métriques sur tous les documents
- Documents récents

**DocumentList.jsx**
- Affiche tous les documents (pas de filtre par utilisateur)
- Filtres : type, statut, recherche
- Export CSV (simulation)

#### Pages Comptable

**Dashboard.jsx**
- Filtre les documents : `mockDocuments.filter(d => d.uploadedBy === user.id)`
- Statistiques personnelles
- Actions rapides (Upload, Voir documents)

**DocumentUpload.jsx**
- Drag & drop de fichiers
- Validation : type (PDF, JPG, PNG), taille (max 10MB)
- Barre de progression simulée
- Redirection après upload

**DocumentList.jsx**
- Similaire à Manager mais filtrée sur `user.id`
- N'affiche que les documents de l'utilisateur connecté

#### Pages Shared

**DocumentDetail.jsx**
- Utilisée par Manager et Comptable
- Affiche : aperçu PDF, texte OCR, formulaire de données
- Actions selon le rôle :
  - Manager : Valider, Rejeter
  - Comptable : Envoyer vers BC
- Indicateur de confiance IA avec couleurs
- Historique des actions

---

### `/src/app/utils/` - Utilitaires

#### `mockData.js` - Données de démonstration

**Structure :**

```javascript
// Utilisateurs
export const mockUsers = [
  {
    id: 1,
    email: "admin@company.com",
    password: "admin123",
    name: "Sophie Martin",
    role: "admin",
    status: "active"
  },
  // ... autres utilisateurs
];

// Documents
export const mockDocuments = [
  {
    id: 1,
    name: "Facture_001.pdf",
    type: "Facture Achat",
    status: "validé",
    client: "SARL TechnoPlus",
    amount: 2450.80,
    confidence: 0.96,
    uploadedBy: 3,
    ocrText: "FACTURE N° ..."
  },
  // ... autres documents
];

// Helpers
export const statusLabels = {
  en_cours: "En cours",
  validé: "Validé",
  rejeté: "Rejeté",
  dans_bc: "Dans BC"
};

export const statusColors = {
  en_cours: "bg-blue-100 text-blue-800",
  validé: "bg-green-100 text-green-800",
  // ...
};

export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.9) return "text-green-600";
  if (confidence >= 0.7) return "text-orange-600";
  return "text-red-600";
};
```

**Pourquoi séparer les helpers ?**
- Réutilisables dans plusieurs composants
- Centralise la logique métier
- Facilite la maintenance

---

## 🔄 Flux de Données

### Exemple : Connexion

```
1. Utilisateur remplit le formulaire (/login)
   ↓
2. Login.jsx appelle login(email, password)
   ↓
3. AuthContext.login() vérifie dans mockUsers
   ↓
4. Si OK : setUser(userData) + localStorage
   ↓
5. Navigate vers /admin|manager|comptable/dashboard
   ↓
6. ProtectedRoute vérifie user.role
   ↓
7. Si OK : affiche Dashboard avec AdminLayout
   ↓
8. AdminLayout.getNavigationLinks() selon user.role
   ↓
9. Affichage de la sidebar personnalisée
```

### Exemple : Suppression utilisateur

```
1. UserList affiche <UserTable users={users} onDelete={handleDelete} />
   ↓
2. UserTable affiche bouton <Trash2 onClick={() => onDelete(user.id)} />
   ↓
3. Clic → UserTable appelle onDelete(5)
   ↓
4. UserList.handleDelete(5) est exécuté
   ↓
5. Confirmation : window.confirm()
   ↓
6. Si OK : setUsers(users.filter(u => u.id !== 5))
   ↓
7. React re-rend UserList avec nouvelle liste
   ↓
8. UserTable reçoit la liste mise à jour
   ↓
9. L'utilisateur a disparu du tableau
```

---

## 🎨 Styling avec Tailwind CSS

### Principe

Tailwind = classes utilitaires au lieu de CSS custom

**Exemple :**
```html
<!-- Au lieu de -->
<div class="my-button">Cliquer</div>
<style>
  .my-button {
    background-color: blue;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
  }
</style>

<!-- On utilise -->
<div class="bg-blue-600 text-white px-6 py-3 rounded-lg">
  Cliquer
</div>
```

### Classes courantes

- `flex` : display flex
- `items-center` : align-items center
- `justify-between` : justify-content space-between
- `gap-4` : gap de 1rem (16px)
- `px-6` : padding horizontal 1.5rem
- `py-3` : padding vertical 0.75rem
- `rounded-lg` : border-radius 0.5rem
- `bg-blue-600` : background couleur
- `text-white` : couleur texte
- `hover:bg-blue-700` : background au survol
- `transition-colors` : animation douce

### Responsive

- `lg:ml-64` : margin-left sur écrans larges (≥1024px)
- `hidden lg:block` : caché mobile, visible desktop
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` : grille responsive

---

## 🧪 Tests et Débug

### Console du navigateur (F12)

```javascript
// Loguer des valeurs
console.log('User:', user);
console.log('Documents:', documents);

// Inspecter des objets
console.table(mockUsers);

// Erreurs
console.error('Erreur:', error);
```

### React DevTools

Extension Chrome/Firefox pour :
- Inspecter l'arbre des composants
- Voir les props et state
- Tracer les re-renders

---

## 📝 Bonnes Pratiques

### 1. Nommage

```javascript
// Composants : PascalCase
const UserTable = () => {};

// Fonctions : camelCase
const handleSubmit = () => {};

// Constantes : UPPER_SNAKE_CASE
const API_URL = 'https://api.example.com';
```

### 2. Organisation des imports

```javascript
// 1. Libraries externes
import { useState } from 'react';
import { Link } from 'react-router';

// 2. Composants locaux
import AdminLayout from '../../layouts/AdminLayout';
import UserTable from '../../components/users/UserTable';

// 3. Utilitaires
import { mockUsers } from '../../utils/mockData';

// 4. Assets (si applicable)
import logo from '../../assets/logo.png';
```

### 3. Commentaires

```javascript
// ========================================
// 🔐 CONTEXT D'AUTHENTIFICATION
// ========================================
// Description générale

const AuthContext = createContext(null);

// ========================================
// FONCTION DE CONNEXION
// ========================================
// Description de la fonction
const login = (email, password) => {
  // Logique commentée si complexe
};
```

### 4. Décomposition

**Éviter :**
```javascript
// Fonction de 200 lignes
const Dashboard = () => {
  // Tout le code ici
};
```

**Préférer :**
```javascript
// Composants séparés
const StatCard = ({ icon, label, value }) => { ... };
const RecentDocuments = ({ documents }) => { ... };

const Dashboard = () => {
  return (
    <>
      <StatCard ... />
      <RecentDocuments ... />
    </>
  );
};
```

---

## 🚀 Pour aller plus loin

### Ajouter une API Backend

1. Créer un service API
```javascript
// services/api.js
export const userService = {
  getAll: () => fetch('/api/users').then(r => r.json()),
  create: (data) => fetch('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  // ...
};
```

2. Utiliser dans les composants
```javascript
useEffect(() => {
  userService.getAll()
    .then(setUsers)
    .catch(console.error);
}, []);
```

### Ajouter un state manager (Redux, Zustand)

Si l'app devient complexe, centraliser l'état global.

### Ajouter des tests (Jest, React Testing Library)

```javascript
test('Login renders correctly', () => {
  render(<Login />);
  expect(screen.getByText('Se connecter')).toBeInTheDocument();
});
```

---

## 📚 Ressources Apprentissage

- **React** : https://react.dev/learn
- **React Router** : https://reactrouter.com/en/main/start/tutorial
- **Tailwind CSS** : https://tailwindcss.com/docs
- **JavaScript moderne** : https://javascript.info/
- **Git/GitHub** : https://docs.github.com/fr

---

Bonne chance avec votre projet ! 🎓
