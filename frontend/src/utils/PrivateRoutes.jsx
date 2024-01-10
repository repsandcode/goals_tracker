import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  let auth = false;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
