import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && currentUser.role !== role) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}
