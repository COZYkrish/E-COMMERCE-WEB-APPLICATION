import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
