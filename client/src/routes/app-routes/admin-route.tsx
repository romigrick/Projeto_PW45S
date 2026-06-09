import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute = () => {
  const { authenticated, authenticatedUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = authenticatedUser?.authorities?.some(
    (auth) => auth.authority === 'ROLE_ADMIN'
  );

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
