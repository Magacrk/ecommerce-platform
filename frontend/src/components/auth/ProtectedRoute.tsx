import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (roles && roles.length > 0) {
    if (!userRole || !roles.includes(userRole)) {
      // User doesn't have required role, redirect to home
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated (and has required role if specified)
  return <>{children}</>;
};

export default ProtectedRoute; 