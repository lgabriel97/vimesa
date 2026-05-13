import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import Login from "@/login/pages/Login";
import Inbox from "@/admin/pages/Inbox";
import InformeDetalle from "@/admin/pages/InformeDetalle";
import VerificacionForm from "./informes/tipos/verificacion-fm/Form";
import { TooltipProvider } from "./components/ui/tooltip";
import PdfsAdmin from "@/pages/PdfsAdmin";
import MisInformes from "./pages/MisInformes";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate to={user.rol === "ADMIN" ? "/inbox" : "/mis-informes"} replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            {/* Pública */}
            <Route path="/login" element={<Login />} />

            {/* Protegidas con layout (header + container) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomeRedirect />} />

              <Route
                path="/nuevo"
                element={
                  <ProtectedRoute allowedRoles={["TECNICO"]}>
                    <VerificacionForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/inbox"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Inbox />
                  </ProtectedRoute>
                }
              />

              <Route path="/informes/:id" element={<InformeDetalle />} />

              {/* MOVER AQUÍ DENTRO */}
              <Route
                path="/mis-informes"
                element={
                  <ProtectedRoute allowedRoles={["TECNICO"]}>
                    <MisInformes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pdfs"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <PdfsAdmin />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Cualquier otra ruta → Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
      <Toaster richColors />
    </AuthProvider>
  );
}
