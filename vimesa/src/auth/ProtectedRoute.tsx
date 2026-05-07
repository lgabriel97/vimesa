import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import type { Rol } from "@/types/informe";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Rol[];
}) {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="p-8 text-muted-foreground">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.rol))
    return <Navigate to="/" replace />;
  return <>{children}</>;
}
