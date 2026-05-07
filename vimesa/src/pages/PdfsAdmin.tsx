import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router";
import { Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, downloadPdf } from "@/lib/api";
import type { PdfRecord } from "@/types/informe";

export default function MisPdfs() {
  const [pdfs, setPdfs] = useState<PdfRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<PdfRecord[]>("/pdfs")
      .then(setPdfs)
      .finally(() => setLoading(false));
  }, []);

  async function descargar(id: string) {
    try {
      await downloadPdf(id);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mis borradores</h1>

      <Card>
        <CardHeader>
          <CardTitle>{pdfs.length} borradores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : pdfs.length === 0 ? (
            <p className="text-muted-foreground">
              Aún no has generado ningún borrador. Genera uno desde el detalle
              de un informe.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Nº Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado informe</TableHead>
                  <TableHead>Generado</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfs.map((pdf) => (
                  <TableRow key={pdf.id}>
                    <TableCell className="font-medium">
                      {pdf.informe?.equipo ?? "—"}
                    </TableCell>
                    <TableCell>{pdf.informe?.noOrden ?? "—"}</TableCell>
                    <TableCell>{pdf.informe?.cliente ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pdf.informe?.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(pdf.createdAt).toLocaleString("es-ES")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/informes/${pdf.informe?.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => descargar(pdf.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
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
