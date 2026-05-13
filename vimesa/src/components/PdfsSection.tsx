import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Download, FileText, RefreshCw } from "lucide-react";
import { apiFetch, downloadPdf } from "@/lib/api";
import { useAuth } from "@/auth/AuthContext";
import type { PdfRecord, EstadoInforme } from "@/types/informe";

interface Props {
  informeId: string;
  esTecnicoAutor: boolean;
  estadoInforme: EstadoInforme;
}

export function PdfsSection({ informeId, esTecnicoAutor, estadoInforme }: Props) {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState<PdfRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);

  async function cargar() {
    setLoading(true);
    try {
      const data = await apiFetch<PdfRecord[]>(`/informes/${informeId}/pdfs`);
      setPdfs(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [informeId]);

  async function generar(tipo: "preview" | "definitivo") {
    setGenerando(true);
    try {
      await apiFetch(`/informes/${informeId}/pdf`, {
        method: "POST",
        body: JSON.stringify({ tipo }),
      });
      toast.success(
        tipo === "preview" ? "Borrador generado" : "PDF definitivo generado",
      );
      await cargar();
    } catch (err: any) {
      toast.error(err.message || "Error al generar PDF");
    } finally {
      setGenerando(false);
    }
  }

  async function descargar(pdfId: string) {
    try {
      await downloadPdf(pdfId);
    } catch (err: any) {
      toast.error(err.message || "Error al descargar");
    }
  }

  const puedeGenerarPreview = user?.rol === "TECNICO" && esTecnicoAutor;
  const puedeGenerarDefinitivo = user?.rol === "ADMIN";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos PDF
        </CardTitle>
        <div className="flex gap-2">
          {puedeGenerarPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => generar("preview")}
              disabled={generando}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {pdfs.length === 0 ? "Generar PDF" : "Regenerar PDF"}
            </Button>
          )}
          {puedeGenerarDefinitivo && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => generar("definitivo")}
              disabled={generando}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerar definitivo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Cargando...</p>
        ) : pdfs.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hay PDFs generados aún
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Generado por</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pdfs.map((pdf) => (
                <TableRow key={pdf.id}>
                  <TableCell>
                    <Badge
                      variant={estadoInforme === "APROBADO" ? "default" : "secondary"}
                    >
                      {estadoInforme === "APROBADO" ? "Definitivo" : "Borrador"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(pdf.createdAt).toLocaleString("es-ES")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {pdf.generadoPor.nombre}
                  </TableCell>
                  <TableCell className="text-right">
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
  );
}
