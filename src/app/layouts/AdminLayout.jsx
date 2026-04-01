import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
  FileStack,
  User,
  UserCircle 
} from 'lucide-react';
import { useState } from 'react';

// LAYOUT PRINCIPAL AVEC SIDEBAR ET NAVBAR

// Layout utilisé pour toutes les pages protégées
// Affiche la navigation selon la hiérarchie des rôles :
// - ADMIN : voit tout (admin + manager + comptable)
// - MANAGER : voit manager + comptable
// - COMPTABLE : voit uniquement comptable

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ========================================
  // CONFIGURATION DES LIENS DE NAVIGATION
  // Selon la hiérarchie des rôles
  // ========================================
  const getNavigationLinks = () => {
    const links = [];

    // ===== ADMIN : Accès à TOUT =====
    if (user.role === 'ADMIN') {
      links.push(
        {
          path: '/admin/dashboard',
          label: 'Dashboard Admin',
          icon: LayoutDashboard,
          section: 'Administration'
        },
        {
          path: '/admin/users',
          label: 'Gestion Utilisateurs',
          icon: Users,
          section: 'Administration'
        },
        {
          path: '/admin/audit',
          label: 'Logs d\'audit',
          icon: ClipboardList,
          section: 'Administration'
        },
        {
          path: '/manager/documents',
          label: 'Tous les documents',
          icon: FileStack,
          section: 'Gestion'
        },
        {
          path: '/comptable/documents',
          label: 'Mes documents',
          icon: FileText,
          section: 'Documents'
        },
        {
          path: '/comptable/upload',
          label: 'Upload document',
          icon: Upload,
          section: 'Documents'
        }
      );
    }
    // ===== MANAGER : Accès à manager + comptable =====
    else if (user.role === 'MANAGER') {
      links.push(
        {
          path: '/manager/dashboard',
          label: 'Dashboard Manager',
          icon: LayoutDashboard,
          section: 'Gestion'
        },
        {
          path: '/manager/documents',
          label: 'Tous les documents',
          icon: FileStack,
          section: 'Gestion'
        },
        {
          path: '/manager/audit',
          label: 'Logs d\'audit',
          icon: ClipboardList,
          section: 'Gestion'
        },
        {
          path: '/comptable/documents',
          label: 'Mes documents',
          icon: FileText,
          section: 'Documents'
        },
        {
          path: '/comptable/upload',
          label: 'Upload document',
          icon: Upload,
          section: 'Documents'
        }
      );
    }
    // ===== COMPTABLE : Accès uniquement à ses fonctionnalités =====
    else if (user.role === 'COMPTABLE') {
      links.push(
        {
          path: '/comptable/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          section: 'Documents'
        },
        {
          path: '/comptable/documents',
          label: 'Mes documents',
          icon: FileText,
          section: 'Documents'
        },
        {
          path: '/comptable/upload',
          label: 'Upload document',
          icon: Upload,
          section: 'Documents'
        }
      );
    }

    return links;
  };

  const navigationLinks = getNavigationLinks();

  // Grouper les liens par section
  const groupedLinks = navigationLinks.reduce((acc, link) => {
    if (!acc[link.section]) {
      acc[link.section] = [];
    }
    acc[link.section].push(link);
    return acc;
  }, {});

  const getProfilePath = () => {
    switch (user.role) {
      case 'ADMIN': return '/admin/profile';
      case 'MANAGER': return '/manager/profile';
      case 'COMPTABLE': return '/comptable/profile';
      default: return '/comptable/profile';
    }

  };
  const profilePath = getProfilePath();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========================================
          SIDEBAR DESKTOP
          ======================================== */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 hidden lg:block">
        {/* Logo et titre */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">DocuManage</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion Documentaire IA</p>
        </div>

        {/* Navigation avec sections */}
        <nav className="px-4 space-y-6">
          {Object.entries(groupedLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section}
              </h3>
              <div className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Icon size={20} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profil utilisateur en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.nom?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.nom}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        
        <Link to={profilePath}className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors mb-1 ${location.pathname === profilePath
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
            }`}
        >
          <User size={18} />
          <span className="text-sm">Mon Profil</span>
        </Link>
        </div>



      </aside>

      {/* ========================================
          SIDEBAR MOBILE (avec overlay)
          ======================================== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 h-full w-64 bg-white">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blue-600">DocuManage</h1>
                <p className="text-sm text-gray-500 mt-1">Gestion Documentaire IA</p>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="px-4 space-y-6">
              {Object.entries(groupedLinks).map(([section, links]) => (
                <div key={section}>
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {section}
                  </h3>
                  <div className="space-y-1">
                    {links.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;

                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <Icon size={20} />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t border-gray-200 p-4">
              {/* Info utilisateur */}
              <div className="flex items-center gap-3 px-2 py-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.nom?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.nom}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
                </div>
              </div>
 
              <Link
                to={profilePath}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors mb-1 ${
                  location.pathname === profilePath
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User size={18} />
                <span className="text-sm">Mon Profil</span>
              </Link>
              </div>
          </aside>
        </div>
      )}

      {/* ========================================
          CONTENU PRINCIPAL
          ======================================== */}
      <div className="lg:ml-64">
        {/* Navbar en haut */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 lg:flex-none"></div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nom}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
               <Link
                to={profilePath}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors mb-1 ${
                  location.pathname === profilePath
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserCircle size={18} />
                <span className="hidden sm:inline">Profil</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;