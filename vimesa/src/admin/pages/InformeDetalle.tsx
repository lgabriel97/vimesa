import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/auth/AuthContext";
import type { Informe, EstadoInforme } from "@/types/informe";
import { PdfsSection } from "@/components/PdfsSection";

const estadoVariant: Record<
  EstadoInforme,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDIENTE: "secondary",
  APROBADO: "default",
  RECHAZADO: "destructive",
  DEVUELTO: "outline",
};

function display(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "")
    return "No presentado";
  return String(value);
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

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

  const puedeRevisar = user?.rol === "ADMIN" && informe.estado === "PENDIENTE";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold mt-2">{informe.equipo}</h1>
        </div>
        <Badge variant={estadoVariant[informe.estado]} className="text-sm">
          {informe.estado}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identificación</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Cliente" value={display(informe.cliente)} />
          <Field label="Sitio" value={display(informe.sitio)} />
          <Field label="Nº orden" value={display(informe.noOrden)} />
          <Field label="Nº serie" value={display(informe.nSerie)} />
          <Field label="Tipo equipo" value={display(informe.tipoEquipo)} />
          <Field
            label="Temp. ambiente"
            value={
              informe.tempAmbiente !== null
                ? `${informe.tempAmbiente} °C`
                : display(null)
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Firmware y configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Firmware" value={display(informe.versionFirmware)} />
            <Field
              label="Web Server"
              value={display(informe.versionWebServer)}
            />
          </div>
          <Separator />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Tests realizados
            </div>
            <div className="flex flex-wrap gap-1">
              {informe.testsRealizados.length === 0 ? (
                <span className="text-sm text-muted-foreground">Ninguno</span>
              ) : (
                informe.testsRealizados.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Cellnex configurado
            </div>
            <div className="flex flex-wrap gap-1">
              {informe.cellnexConfig.length === 0 ? (
                <span className="text-sm text-muted-foreground">Ninguno</span>
              ) : (
                informe.cellnexConfig.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))
              )}
            </div>
          </div>
          {informe.observaciones && (
            <Field
              label="Observaciones"
              value={display(informe.observaciones)}
            />
          )}
        </CardContent>
      </Card>

      {informe.snmpV1 ? (
        <Card>
          <CardHeader>
            <CardTitle>SNMP V1</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="IP" value={display(informe.snmpV1.ip)} />
            <Field label="Mask" value={display(informe.snmpV1.mask)} />
            <Field label="Gateway" value={display(informe.snmpV1.gateway)} />
            <Field label="Password" value={display(informe.snmpV1.password)} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>SNMP V1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No presentado</p>
          </CardContent>
        </Card>
      )}

      {informe.snmpV2 ? (
        <Card>
          <CardHeader>
            <CardTitle>SNMP V2</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="IP" value={display(informe.snmpV2.ip)} />
            <Field label="Mask" value={display(informe.snmpV2.mask)} />
            <Field label="Gateway" value={display(informe.snmpV2.gateway)} />
            <Field label="Login" value={display(informe.snmpV2.login)} />
            <Field label="Password" value={display(informe.snmpV2.password)} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>SNMP V2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No presentado</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mediciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Frec MHz</TableHead>
                <TableHead>Pot W</TableHead>
                <TableHead>Vpa V</TableHead>
                <TableHead>Ipa1</TableHead>
                <TableHead>Ipa2</TableHead>
                <TableHead>Ipa3</TableHead>
                <TableHead>Eff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {informe.medidas?.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Badge variant="outline">{m.tipo}</Badge>
                  </TableCell>
                  <TableCell>{m.frecMhz}</TableCell>
                  <TableCell>{m.potW ?? "—"}</TableCell>
                  <TableCell>{m.vpaV ?? "—"}</TableCell>
                  <TableCell>{m.ipa1 ?? "—"}</TableCell>
                  <TableCell>{m.ipa2 ?? "—"}</TableCell>
                  <TableCell>{m.ipa3 ?? "—"}</TableCell>
                  <TableCell>{m.eff ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conclusión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field
            label="Apto"
            value={
              <Badge variant={informe.equipoApto ? "default" : "destructive"}>
                {informe.equipoApto ? "Sí" : "No"}
              </Badge>
            }
          />
          {!informe.equipoApto && (
            <Field label="Motivos" value={display(informe.motivosNoApto)} />
          )}
          {informe.actuaciones && (
            <Field label="Actuaciones" value={display(informe.actuaciones)} />
          )}
          <Field label="Firma técnico" value={informe.firmaTecnico} />
          <Field
            label="Fecha conclusión"
            value={new Date(informe.fechaConclusion).toLocaleDateString()}
          />
        </CardContent>
      </Card>

      {informe.comentariosRevisor && (
        <Card>
          <CardHeader>
            <CardTitle>Revisión previa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Field label="Revisor" value={informe.revisor?.nombre} />
            <Field label="Comentarios" value={informe.comentariosRevisor} />
            {informe.reviewedAt && (
              <Field
                label="Revisado"
                value={new Date(informe.reviewedAt).toLocaleString()}
              />
            )}
          </CardContent>
        </Card>
      )}

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
      />
    </div>
  );
}
