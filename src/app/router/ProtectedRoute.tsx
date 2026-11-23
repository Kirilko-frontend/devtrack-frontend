import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '@/app/providers/useAuth';
import { AppLoader } from '@/shared/ui';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
