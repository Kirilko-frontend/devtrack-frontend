import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/app/providers/AuthProvider';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
