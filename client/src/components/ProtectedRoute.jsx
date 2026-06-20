import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Prevent page flicker on refresh
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        Loading...
      </div>
    );
  }

  // ❌ Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}