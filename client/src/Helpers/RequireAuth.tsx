import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../store";

interface RequireAuthProps {
  allowedRoles?: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const location = useLocation();
  const { isLoggedIn, userRole } = useSelector((state: RootState) => state.user);


  if (!isLoggedIn) {
    return <Navigate to="/denied" state={{ from: location }} replace />;
  }


  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/denied" state={{ from: location }} replace />;
  }


  return <Outlet />;
};

export default RequireAuth;
