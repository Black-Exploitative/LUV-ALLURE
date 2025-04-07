// frontend/src/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * A wrapper component for protecting routes that require authentication
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, authChecked } = useAuth();
  const location = useLocation();

  // Show nothing while auth is being checked initially
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page with the return URL
  if (!currentUser && !loading) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If logged in or still loading (but auth checked), render children
  return children;
};

export default ProtectedRoute;