import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  informe: any;
}

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

export function VerificacionFmDdsDetalle({ informe }: Props) {
  const datos = informe.datos || {};
  const medidasPrincipal = (datos.medidas || []) as any[];
  const tests = (datos.testsRealizados || []) as string[];
  const cellnex = (datos.cellnexConfig || []) as string[];

  return (
    <>
      {datos.equipo && (
        <h2 className="text-xl font-semibold">{datos.equipo}</h2>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identificación</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Cliente" value={display(datos.cliente)} />
          <Field label="Sitio" value={display(datos.sitio)} />
          <Field label="Nº orden" value={display(datos.noOrden)} />
          <Field label="Nº serie" value={display(datos.nSerie)} />
          <Field label="Tipo equipo" value={display(datos.tipoEquipo)} />
          <Field
            label="Temp. ambiente"
            value={
              datos.tempAmbiente !== null && datos.tempAmbiente !== undefined
                ? `${datos.tempAmbiente} °C`
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
            <Field label="Firmware" value={display(datos.versionFirmware)} />
            <Field label="Web Server" value={display(datos.versionWebServer)} />
          </div>
          <Separator />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Tests realizados
            </div>
            <div className="flex flex-wrap gap-1">
              {tests.length === 0 ? (
                <span className="text-sm text-muted-foreground">Ninguno</span>
              ) : (
                tests.map((t) => (
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
              {cellnex.length === 0 ? (
                <span className="text-sm text-muted-foreground">Ninguno</span>
              ) : (
                cellnex.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))
              )}
            </div>
          </div>
          {datos.observaciones && (
            <Field label="Observaciones" value={display(datos.observaciones)} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SNMP V1</CardTitle>
        </CardHeader>
        <CardContent>
          {datos.snmpV1 ? (
            <div className="grid grid-cols-2 gap-4">
              <Field label="IP" value={display(datos.snmpV1.ip)} />
              <Field label="Mask" value={display(datos.snmpV1.mask)} />
              <Field label="Gateway" value={display(datos.snmpV1.gateway)} />
              <Field label="Password" value={display(datos.snmpV1.password)} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No presentado</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SNMP V2</CardTitle>
        </CardHeader>
        <CardContent>
          {datos.snmpV2 ? (
            <div className="grid grid-cols-2 gap-4">
              <Field label="IP" value={display(datos.snmpV2.ip)} />
              <Field label="Mask" value={display(datos.snmpV2.mask)} />
              <Field label="Gateway" value={display(datos.snmpV2.gateway)} />
              <Field label="Login" value={display(datos.snmpV2.login)} />
              <Field label="Password" value={display(datos.snmpV2.password)} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No presentado</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mediciones — Temperatura ambiente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Frec MHz</TableHead>
                  <TableHead>Pot W</TableHead>
                  <TableHead>Vpa V</TableHead>
                  <TableHead>Ipa1</TableHead>
                  <TableHead>Ipa2</TableHead>
                  <TableHead>Ipa3</TableHead>
                  <TableHead>TOut</TableHead>
                  <TableHead>TCase</TableHead>
                  <TableHead>TPwS</TableHead>
                  <TableHead>Eff</TableHead>
                  <TableHead>IF1</TableHead>
                  <TableHead>IF2</TableHead>
                  <TableHead>IF3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medidasPrincipal.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>{m.frecMhz ?? "—"}</TableCell>
                    <TableCell>{m.potW ?? "—"}</TableCell>
                    <TableCell>{m.vpaV ?? "—"}</TableCell>
                    <TableCell>{m.ipa1 ?? "—"}</TableCell>
                    <TableCell>{m.ipa2 ?? "—"}</TableCell>
                    <TableCell>{m.ipa3 ?? "—"}</TableCell>
                    <TableCell>{m.tOut ?? "—"}</TableCell>
                    <TableCell>{m.tCase ?? "—"}</TableCell>
                    <TableCell>{m.tPwS ?? "—"}</TableCell>
                    <TableCell>{m.eff ?? "—"}</TableCell>
                    <TableCell>{m.if1 ?? "—"}</TableCell>
                    <TableCell>{m.if2 ?? "—"}</TableCell>
                    <TableCell>{m.if3 ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
              <Badge variant={datos.equipoApto ? "default" : "destructive"}>
                {datos.equipoApto ? "Sí" : "No"}
              </Badge>
            }
          />
          {!datos.equipoApto && (
            <Field label="Motivos" value={display(datos.motivosNoApto)} />
          )}
          {datos.actuaciones && (
            <Field label="Actuaciones" value={display(datos.actuaciones)} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
