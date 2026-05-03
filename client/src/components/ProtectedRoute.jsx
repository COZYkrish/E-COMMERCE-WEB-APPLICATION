import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
