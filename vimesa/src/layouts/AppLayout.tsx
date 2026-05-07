import { Link, Outlet, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/vimesa-logo.png" alt="Vimesa" className="h-10 w-auto" />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold leading-none">
                Verificaciones
              </span>
              <span className="text-xs text-muted-foreground">
                Protocolo de transmisores FM
              </span>
            </div>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-4 ml-8">
              {user.rol === "TECNICO" && (
                <>
                  <Link to="/nuevo" className="text-sm hover:underline">
                    Nuevo informe
                  </Link>
                  <Link to="/mis-informes" className="text-sm hover:underline">
                    Mis informes
                  </Link>
                </>
              )}
              {user.rol === "ADMIN" && (
                <>
                  <Link to="/inbox" className="text-sm hover:underline">
                    Inbox
                  </Link>
                  <Link to="/pdfs" className="text-sm hover:underline">
                    PDFs
                  </Link>
                </>
              )}
            </nav>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium leading-none">
                  {user.nombre}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.rol === "ADMIN" ? "Administrador" : "Técnico"}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
