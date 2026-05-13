import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/auth/AuthContext";
import { getTipoConfig } from "@/informes/registry";
import { PdfsSection } from "@/components/PdfsSection";
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

export default function InformeDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [informe, setInforme] = useState<Informe | null>(null);
  const [comentarios, setComentarios] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiFetch<Informe>(`/informes/${id}`).then(setInforme);
  }, [id]);

  async function revisar(estado: "APROBADO" | "RECHAZADO" | "DEVUELTO") {
    if (estado !== "APROBADO" && !comentarios.trim()) {
      toast.error("Añade un comentario explicando el motivo");
      return;
    }
    setEnviando(true);
    try {
      await apiFetch(`/informes/${id}/revisar`, {
        method: "PATCH",
        body: JSON.stringify({ estado, comentariosRevisor: comentarios }),
      });
      toast.success(`Informe ${estado.toLowerCase()}`);
      navigate("/inbox");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (!informe) return <p className="text-muted-foreground">Cargando...</p>;

  const config = getTipoConfig(informe.tipo);
  const DetalleEspecifico = config.DetalleComponent;

  const puedeRevisar = user?.rol === "ADMIN" && informe.estado === "PENDIENTE";
  const puedeEditar =
    (user?.rol === "TECNICO" &&
      user.id === informe.tecnicoId &&
      informe.estado === "DEVUELTO") ||
    user?.rol === "ADMIN";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold mt-2">{config.nombre}</h1>
          <p className="text-sm text-muted-foreground">
            Fecha: {new Date(informe.fechaConclusion).toLocaleDateString()} ·
            Firma: {informe.firmaTecnico}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {puedeEditar && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/informes/${informe.id}/editar`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}
          <Badge variant={estadoVariant[informe.estado]} className="text-sm">
            {informe.estado}
          </Badge>
        </div>
      </div>

      {/* Cuerpo específico del tipo */}
      <DetalleEspecifico informe={informe} />

      {/* Revisión previa (común) */}
      {informe.comentariosRevisor && (
        <Card>
          <CardHeader>
            <CardTitle>Revisión previa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Revisor
              </div>
              <div>{informe.revisor?.nombre ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Comentarios
              </div>
              <div>{informe.comentariosRevisor}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de revisión (admin) */}
      {puedeRevisar && (
        <Card>
          <CardHeader>
            <CardTitle>Revisar informe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Comentarios (obligatorio si rechazas o devuelves)"
              rows={4}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => revisar("APROBADO")} disabled={enviando}>
                Aprobar
              </Button>
              <Button
                variant="outline"
                onClick={() => revisar("DEVUELTO")}
                disabled={enviando}
              >
                Devolver para corregir
              </Button>
              <Button
                variant="destructive"
                onClick={() => revisar("RECHAZADO")}
                disabled={enviando}
              >
                Rechazar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <PdfsSection
        informeId={informe.id}
        esTecnicoAutor={user?.id === informe.tecnicoId}
        estadoInforme={informe.estado}
      />
    </div>
  );
}
