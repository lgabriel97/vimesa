import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { User, Rol } from "@/types/informe";

type Modo = "list" | "create" | "edit";

interface FormData {
  email: string;
  nombre: string;
  password: string;
  rol: Rol;
}

const emptyForm: FormData = {
  email: "",
  nombre: "",
  password: "",
  rol: "TECNICO",
};

const rolLabel: Record<Rol, string> = {
  TECNICO: "Técnico",
  ADMIN: "Administrador",
  GOD: "Super Admin",
};

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState<Modo>("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    apiFetch<User[]>("/usuarios")
      .then(setUsuarios)
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  function resetForm() {
    setForm(emptyForm);
    setError("");
    setEditId(null);
    setModo("list");
  }

  function handleEdit(u: User) {
    setEditId(u.id);
    setForm({ email: u.email, nombre: u.nombre, password: "", rol: u.rol });
    setModo("edit");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (modo === "create") {
        await apiFetch("/usuarios", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Usuario creado");
      } else if (modo === "edit" && editId) {
        const body: Record<string, unknown> = {
          email: form.email,
          nombre: form.nombre,
          rol: form.rol,
        };

        await apiFetch(`/usuarios/${editId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });

        if (form.password) {
          await apiFetch(`/usuarios/${editId}/password`, {
            method: "PATCH",
            body: JSON.stringify({ password: form.password }),
          });
        }

        toast.success("Usuario actualizado");
      }
      resetForm();
      cargar();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCambiarPassword(id: string) {
    const password = prompt("Nueva contraseña (mín. 6 caracteres):");
    if (!password || password.length < 6) return;

    try {
      await apiFetch(`/usuarios/${id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
      });
      toast.success("Contraseña actualizada");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleEliminar(u: User) {
    if (!confirm(`¿Eliminar a "${u.nombre}" (${u.email})?`)) return;

    try {
      await apiFetch(`/usuarios/${u.id}`, { method: "DELETE" });
      toast.success("Usuario eliminado");
      cargar();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
        {modo === "list" && (
          <Button onClick={() => { setModo("create"); setError(""); }}>
            Crear usuario
          </Button>
        )}
        {modo !== "list" && (
          <Button variant="outline" onClick={resetForm}>
            Cancelar
          </Button>
        )}
      </div>

      {(modo === "create" || modo === "edit") && (
        <Card>
          <CardHeader>
            <CardTitle>
              {modo === "create" ? "Nuevo usuario" : "Editar usuario"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rol">Rol</Label>
                  <Select
                    value={form.rol}
                    onValueChange={(v: Rol) => setForm({ ...form, rol: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TECNICO">Técnico</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="GOD">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {modo === "create" ? "Contraseña" : "Nueva contraseña (dejar vacío para no cambiar)"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={modo === "create"}
                    minLength={modo === "create" ? 6 : undefined}
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit">
                {modo === "create" ? "Crear" : "Guardar cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{usuarios.length} usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-muted-foreground">No hay usuarios</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nombre}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{rolLabel[u.rol]}</TableCell>
                    <TableCell className="text-sm">
                      {new Date((u as any).createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(u)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCambiarPassword(u.id)}
                      >
                        Contraseña
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleEliminar(u)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
