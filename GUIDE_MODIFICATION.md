# 🛠️ Guide de Modification Rapide

Guide pratique pour modifier et étendre l'application facilement.

---

## 🎯 Modifications Courantes

### 1. Changer les couleurs de l'application

**Fichier :** Tous les composants (classes Tailwind)

**Couleur principale (bleu) → vert :**

```javascript
// Avant
className="bg-blue-600 text-white"
className="text-blue-700"
className="border-blue-200"

// Après
className="bg-green-600 text-white"
className="text-green-700"
className="border-green-200"
```

**Rechercher/Remplacer dans tout le projet :**
- `blue-50` → `green-50`
- `blue-100` → `green-100`
- `blue-600` → `green-600`
- `blue-700` → `green-700`

---

### 2. Ajouter un utilisateur de test

**Fichier :** `/src/app/utils/mockData.js`

```javascript
export const mockUsers = [
  // ... utilisateurs existants
  {
    id: 6, // ID unique
    email: "nouveau@company.com",
    password: "password123",
    name: "Nouvel Utilisateur",
    role: "comptable", // ou "manager" ou "admin"
    status: "active",
    createdAt: "2026-03-04",
    lastLogin: "2026-03-04"
  }
];
```

---

### 3. Ajouter un nouveau document mock

**Fichier :** `/src/app/utils/mockData.js`

```javascript
export const mockDocuments = [
  // ... documents existants
  {
    id: 9, // ID unique
    name: "Mon_Document.pdf",
    type: "Facture Achat", // ou "Facture Vente", "Bon de Commande", "Contrat"
    status: "en_cours", // ou "validé", "rejeté", "dans_bc"
    client: "Nom du Client",
    amount: 1500.00,
    date: "2026-03-04",
    reference: "REF-2026-001",
    confidence: 0.95, // Score IA entre 0 et 1
    uploadedBy: 3, // ID de l'utilisateur
    uploadedByName: "Marie Lefebvre",
    uploadedAt: "2026-03-04 10:00",
    validatedBy: null,
    validatedAt: null,
    ocrText: "Texte extrait du document...",
    fileUrl: "/mock/document.pdf"
  }
];
```

---

### 4. Modifier le nom de l'application

**Fichiers à modifier :**

1. **`/src/app/layouts/AdminLayout.jsx`**
```javascript
// Ligne ~160 et ~230
<h1 className="text-2xl font-bold text-blue-600">DocuManage</h1>
// Changer en :
<h1 className="text-2xl font-bold text-blue-600">MonApp</h1>
```

2. **`/src/app/pages/auth/Login.jsx`**
```javascript
// Ligne ~60
<h1 className="text-3xl font-bold text-gray-900">DocuManage</h1>
// Changer en :
<h1 className="text-3xl font-bold text-gray-900">MonApp</h1>
```

3. **`/README.md`**
```markdown
# 📄 DocuManage - Application de Gestion Documentaire Intelligente
# Changer en :
# 📄 MonApp - Application de Gestion Documentaire Intelligente
```

---

### 5. Ajouter une nouvelle section dans la sidebar

**Fichier :** `/src/app/layouts/AdminLayout.jsx`

```javascript
// Dans la fonction getNavigationLinks()
const getNavigationLinks = () => {
  const links = [];

  if (user.role === 'admin') {
    links.push(
      // ... liens existants
      { 
        path: '/admin/nouvelle-page',
        label: 'Ma Nouvelle Page',
        icon: Settings, // Importer de lucide-react
        section: 'Administration' // Groupe dans la sidebar
      }
    );
  }
  
  return links;
};
```

---

## 🆕 Ajouts de Fonctionnalités

### Ajouter une nouvelle page Admin

**Étape 1 : Créer le composant de page**

Fichier : `/src/app/pages/admin/NouvellePage.jsx`

```javascript
import AdminLayout from '../../layouts/AdminLayout';

// ========================================
// 📄 NOUVELLE PAGE ADMIN
// ========================================
// Description de la page

const NouvellePage = () => {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Ma Nouvelle Page
          </h1>
          <p className="text-gray-600 mt-2">
            Description de la page
          </p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p>Contenu de ma page</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NouvellePage;
```

**Étape 2 : Ajouter la route**

Fichier : `/src/app/routes.jsx`

```javascript
// En haut du fichier
import NouvellePage from './pages/admin/NouvellePage';

// Dans le router
{
  path: '/admin/nouvelle-page',
  element: (
    <ProtectedRoute allowedRoles={['admin']}>
      <NouvellePage />
    </ProtectedRoute>
  )
}
```

**Étape 3 : Ajouter le lien dans la sidebar**

Fichier : `/src/app/layouts/AdminLayout.jsx`

```javascript
// Importer l'icône
import { Settings } from 'lucide-react';

// Dans getNavigationLinks()
if (user.role === 'admin') {
  links.push(
    // ... autres liens
    {
      path: '/admin/nouvelle-page',
      label: 'Ma Nouvelle Page',
      icon: Settings,
      section: 'Administration'
    }
  );
}
```

---

### Ajouter un nouveau composant réutilisable

**Exemple : Carte de statistique**

Fichier : `/src/app/components/common/StatCard.jsx`

```javascript
// ========================================
// 📊 COMPOSANT CARTE DE STATISTIQUE
// ========================================
// Affiche une statistique avec icône et valeur

const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Icône */}
      <div className={`bg-${color}-500 p-3 rounded-lg inline-flex mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      
      {/* Valeur */}
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      
      {/* Label */}
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

export default StatCard;
```

**Utilisation :**

```javascript
import StatCard from '../components/common/StatCard';
import { Users, FileText } from 'lucide-react';

function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <StatCard
        icon={Users}
        label="Utilisateurs"
        value={125}
        color="blue"
      />
      <StatCard
        icon={FileText}
        label="Documents"
        value={458}
        color="green"
      />
    </div>
  );
}
```

---

### Ajouter un nouveau type de document

**Fichier :** `/src/app/utils/mockData.js`

```javascript
// Ajouter aux types existants
export const documentTypes = [
  'Facture Achat',
  'Facture Vente',
  'Bon de Commande',
  'Contrat',
  'Devis', // NOUVEAU
  'Note de Frais' // NOUVEAU
];
```

**Fichier :** `/src/app/pages/shared/DocumentDetail.jsx`

```javascript
// Dans le select du formulaire
<select name="type" ...>
  <option value="Facture Achat">Facture Achat</option>
  <option value="Facture Vente">Facture Vente</option>
  <option value="Bon de Commande">Bon de Commande</option>
  <option value="Contrat">Contrat</option>
  <option value="Devis">Devis</option> {/* NOUVEAU */}
  <option value="Note de Frais">Note de Frais</option> {/* NOUVEAU */}
</select>
```

---

### Ajouter un filtre de date

**Fichier :** Page avec tableau (ex: `DocumentList.jsx`)

```javascript
// Ajouter un état pour la date
const [filterDate, setFilterDate] = useState('');

// Modifier le filtre
const filteredDocs = documents.filter(doc => {
  const matchesSearch = /* ... */;
  const matchesType = /* ... */;
  
  // NOUVEAU : filtre par date
  const matchesDate = !filterDate || doc.date === filterDate;
  
  return matchesSearch && matchesType && matchesDate;
});

// Ajouter l'input dans le JSX
<div className="grid grid-cols-4 gap-4">
  {/* Filtres existants */}
  
  {/* NOUVEAU filtre date */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Date
    </label>
    <input
      type="date"
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
</div>
```

---

## 🎨 Personnalisation Visuelle

### Changer l'avatar utilisateur

**Fichier :** `/src/app/layouts/AdminLayout.jsx`

```javascript
// Remplacer l'initiale par une image
<div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
  {user?.name?.charAt(0).toUpperCase()}
</div>

// Par :
<img 
  src={user?.avatar || '/default-avatar.png'} 
  alt={user?.name}
  className="w-10 h-10 rounded-full object-cover"
/>
```

### Ajouter un mode sombre

**1. Créer un contexte Theme**

Fichier : `/src/app/contexts/ThemeContext.jsx`

```javascript
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

**2. Utiliser dans App.jsx**

```javascript
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
```

**3. Ajouter un bouton toggle**

```javascript
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
```

**4. Ajouter les classes dark:**

```javascript
// Exemple
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Contenu
</div>
```

---

## 🔧 Modifications Avancées

### Ajouter la pagination

```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

// Calculer les items de la page actuelle
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);

// Calculer le nombre total de pages
const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

// Composant pagination
<div className="flex justify-center gap-2 mt-6">
  <button
    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
  >
    Précédent
  </button>
  
  <span className="px-4 py-2">
    Page {currentPage} sur {totalPages}
  </span>
  
  <button
    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
  >
    Suivant
  </button>
</div>
```

### Ajouter un tri sur les colonnes

```javascript
const [sortBy, setSortBy] = useState('name');
const [sortOrder, setSortOrder] = useState('asc');

// Fonction de tri
const sortedDocs = [...filteredDocs].sort((a, b) => {
  if (sortOrder === 'asc') {
    return a[sortBy] > b[sortBy] ? 1 : -1;
  } else {
    return a[sortBy] < b[sortBy] ? 1 : -1;
  }
});

// En-tête de colonne cliquable
<th 
  onClick={() => {
    if (sortBy === 'name') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('name');
      setSortOrder('asc');
    }
  }}
  className="cursor-pointer hover:bg-gray-100"
>
  Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
</th>
```

### Ajouter des notifications (Toast)

**Installer sonner (déjà dans package.json)**

```javascript
import { toast } from 'sonner';

// Dans un composant
const handleSave = () => {
  // ... logique de sauvegarde
  
  toast.success('Document enregistré avec succès !');
  // ou
  toast.error('Erreur lors de l\'enregistrement');
  // ou
  toast.info('Traitement en cours...');
};
```

**Ajouter le Toaster dans App.jsx**

```javascript
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}
```

---

## 🐛 Résolution de Problèmes Courants

### Le composant ne se met pas à jour

**Problème :** J'ai modifié une variable mais rien ne change

**Solution :** Utiliser `useState`

```javascript
// ❌ Mauvais
let count = 0;
count++; // Ne déclenche pas de re-render

// ✅ Bon
const [count, setCount] = useState(0);
setCount(count + 1); // Déclenche un re-render
```

### Erreur "Cannot read property of undefined"

**Problème :** `user.name` alors que `user` est `null`

**Solution :** Utiliser l'optional chaining

```javascript
// ❌ Mauvais
<p>{user.name}</p> // Erreur si user est null

// ✅ Bon
<p>{user?.name}</p> // Affiche rien si user est null
<p>{user?.name || 'Invité'}</p> // Valeur par défaut
```

### Warning "Each child should have a unique key"

**Problème :** Liste sans `key`

**Solution :**

```javascript
// ❌ Mauvais
{users.map(user => (
  <div>{user.name}</div>
))}

// ✅ Bon
{users.map(user => (
  <div key={user.id}>{user.name}</div>
))}
```

### Le formulaire se soumet et la page recharge

**Problème :** `<form>` sans `e.preventDefault()`

**Solution :**

```javascript
const handleSubmit = (e) => {
  e.preventDefault(); // IMPORTANT
  // ... logique
};
```

---

## 📋 Checklist avant de modifier

- [ ] Je comprends ce que fait le code actuel
- [ ] J'ai identifié le bon fichier à modifier
- [ ] J'ai fait une copie de sauvegarde (ou commit Git)
- [ ] J'ai testé ma modification
- [ ] J'ai vérifié qu'il n'y a pas d'erreurs dans la console
- [ ] J'ai documenté mon changement (commentaires)

---

## 💡 Conseils

1. **Modifier petit à petit** : Une modification à la fois
2. **Tester immédiatement** : Vérifier que ça fonctionne avant de continuer
3. **Utiliser la console** : `console.log()` est votre ami
4. **Lire les erreurs** : Les messages d'erreur indiquent souvent la solution
5. **Copier/adapter** : S'inspirer du code existant

---

Bon développement ! 🚀
