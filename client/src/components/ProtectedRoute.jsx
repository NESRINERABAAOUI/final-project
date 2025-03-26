import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
