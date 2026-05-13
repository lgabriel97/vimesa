import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UCA_ITEMS } from "./constants";

interface Props {
  informe: any;
}

function display(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "")
    return "No presentado";
  return String(value);
}

function ResultBadge({ value }: { value: string | null | undefined }) {
  if (value === "OK") {
    return <span className="text-green-600 font-semibold">OK</span>;
  }
  if (value === "KO") {
    return <span className="text-red-600 font-semibold">KO</span>;
  }
  return <span className="text-muted-foreground">—</span>;
}

export function VerificacionUcaDetalle({ informe }: Props) {
  const datos = informe.datos || {};
  const items = (datos.items || []) as any[];

  return (
    <>
      <h2 className="text-xl font-semibold">Matriz de Verificación de UCA</h2>

      <Card>
        <CardHeader>
          <CardTitle>Verificaciones y/o Comprobación</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Verificaciones y/o Comprobación</TableHead>
                  <TableHead className="text-center w-20">Display</TableHead>
                  <TableHead className="text-center w-20">WEB</TableHead>
                  <TableHead className="text-center w-20">SNMP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {UCA_ITEMS.map((item, i) => {
                  const r = items[i] || {};
                  return (
                    <TableRow key={item.numero}>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        {item.numero}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        {item.descripcion}
                      </TableCell>
                      <TableCell className="text-center align-top">
                        <ResultBadge value={r.resultadoDisplay} />
                      </TableCell>
                      <TableCell className="text-center align-top">
                        <ResultBadge value={r.resultadoWeb} />
                      </TableCell>
                      <TableCell className="text-center align-top">
                        <ResultBadge value={r.resultadoSnmp} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {datos.observaciones ? display(datos.observaciones) : "No presentado"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
