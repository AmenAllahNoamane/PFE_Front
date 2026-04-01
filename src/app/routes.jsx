import { createBrowserRouter, Navigate } from 'react-router';

// Auth
import Login from './pages/auth/Login';
import Unauthorized from './pages/Unauthorized';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';
import UserCreate from './pages/admin/UserCreate';
import UserEdit from './pages/admin/UserEdit';
import AdminAuditLog from './pages/admin/AuditLog';

// Manager
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerDocumentList from './pages/manager/DocumentList';

// Comptable
import ComptableDashboard from './pages/comptable/Dashboard';
import ComptableDocumentList from './pages/comptable/DocumentList';
import DocumentUpload from './pages/comptable/DocumentUpload';

// Shared
import DocumentDetail from './pages/shared/DocumentDetail';
import Profile from './pages/shared/Profile';

// Protected Route
import ProtectedRoute from './components/auth/ProtectedRoute';

// ========================================
//  CONFIGURATION DES ROUTES

// 
// HIÉRARCHIE DES PERMISSIONS :
// - admin : accès à ['admin'] = tout
// - manager : accès à ['manager'] = manager + comptable
// - comptable : accès à ['comptable'] = uniquement comptable
//
// Le composant ProtectedRoute gère automatiquement la hiérarchie

export const router = createBrowserRouter([
  // Route racine - redirige vers login
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },

  // ROUTES PUBLIQUES (sans authentification)
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },

  // ROUTES ADMIN (admin seulement)

  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
    
 
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <UserList />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/users/create',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <UserCreate />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/users/:id/edit',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <UserEdit />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/audit',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminAuditLog />
      </ProtectedRoute>
    )
  },
 {
  path: '/admin/profile',
  element: (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Profile />
    </ProtectedRoute>
  )
},
  // ROUTES MANAGER (admin + manager)


  {
    path: '/manager/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <ManagerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/documents',
    element: (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <ManagerDocumentList />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/documents/:id',
    element: (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <DocumentDetail />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/audit',
    element: (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AdminAuditLog />
      </ProtectedRoute>
    )
  },
{
  path: '/manager/profile',
  element: (
    <ProtectedRoute allowedRoles={['MANAGER']}>
      <Profile />
    </ProtectedRoute>
  )
},
  
  // ROUTES COMPTABLE (admin + manager + comptable)
  
  
  {
    path: '/comptable/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['COMPTABLE']}>
        <ComptableDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/comptable/upload',
    element: (
      <ProtectedRoute allowedRoles={['COMPTABLE']}>
        <DocumentUpload />
      </ProtectedRoute>
    )
  },
  {
    path: '/comptable/documents',
    element: (
      <ProtectedRoute allowedRoles={['COMPTABLE']}>
        <ComptableDocumentList />
      </ProtectedRoute>
    )
  },
  {
    path: '/comptable/documents/:id',
    element: (
      <ProtectedRoute allowedRoles={['COMPTABLE']}>
        <DocumentDetail />
      </ProtectedRoute>
    )
  },
  {
  path: '/comptable/profile',
  element: (
    <ProtectedRoute allowedRoles={['COMPTABLE']}>
      <Profile />
    </ProtectedRoute>
  )
},

  // ========================================
  // 404 - PAGE NON TROUVÉE
  // ========================================
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>
    )
  }
]);