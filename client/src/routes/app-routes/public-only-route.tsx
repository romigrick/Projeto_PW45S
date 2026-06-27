import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export function PublicOnlyRoute() {
  const { authenticated, isAdmin } = useContext(AuthContext);

  if (!authenticated) return <Outlet />;

  return <Navigate to={isAdmin ? "/admin/dashboard" : "/"} replace />;
}
