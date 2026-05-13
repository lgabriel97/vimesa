import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import type { Informe, EstadoInforme } from "@/types/informe";

const estadoVariant: Record<
  EstadoInforme,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDIENTE: "secondary",
  APROBADO: "default",
  RECHAZADO: "destructive",
  DEVUELTO: "outline",
};

export default function Inbox() {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("pendiente");

  useEffect(() => {
    setLoading(true);
    const qs = filtro === "todos" ? "" : `?estado=${filtro}`;
    apiFetch<Informe[]>(`/informes${qs}`)
      .then(setInformes)
      .finally(() => setLoading(false));
  }, [filtro]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inbox de informes</h1>
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="aprobado">Aprobados</SelectItem>
            <SelectItem value="rechazado">Rechazados</SelectItem>
            <SelectItem value="devuelto">Devueltos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{informes.length} informes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : informes.length === 0 ? (
            <p className="text-muted-foreground">
              No hay informes en este estado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Nº Orden</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {informes.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">
                      {i.datos?.equipo ?? "-"}
                    </TableCell>
                    <TableCell>{i.datos.cliente ?? "—"}</TableCell>
                    <TableCell>{i.datos.noOrden ?? "—"}</TableCell>
                    <TableCell>{i.tecnico?.nombre ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(i.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={estadoVariant[i.estado]}>
                        {i.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/informes/${i.id}`}>Ver</Link>
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
