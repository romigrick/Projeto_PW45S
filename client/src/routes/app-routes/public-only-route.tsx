
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export function PublicOnlyRoute() {
  const { authenticated } = useContext(AuthContext);

  return authenticated ? (
    <Navigate to="/" replace />
  ) : (
    <Outlet />      
  );
}
