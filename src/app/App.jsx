import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';
// APPLICATION PRINCIPALE

// Point d'entrée de l'application 

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />               {/* RouterProvider devient children  : RouterProvider et toutes les pages peuvent accéder au contexte*/ }
    </AuthProvider>
  );
}
