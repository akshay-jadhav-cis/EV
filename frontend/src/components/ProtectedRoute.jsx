import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // prevent redirect flicker while auth restores
    return null; // or return a spinner component
  }

  if (!user) {
    return <Navigate to="/users/login" replace />;
  }

  return children;
}
