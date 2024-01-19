import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Outlet />;
};

export default PrivateRoutes;
