import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';

// APPLICATION PRINCIPALE

// Point d'entrée de l'application 

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />               {/* RouterProvider devient children  : RouterProvider et toutes les pages peuvent accéder au contexte*/ }
    </AuthProvider>
  );
}
