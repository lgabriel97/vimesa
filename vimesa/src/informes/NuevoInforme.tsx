import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TIPOS_INFORME, getTipoConfig } from "./registry";
import type { TipoFormulario } from "@/types/informe";

export default function NuevoInforme() {
  const navigate = useNavigate();
  const [tipoSeleccionado, setTipoSeleccionado] =
    useState<TipoFormulario | null>(null);

  const tipos = Object.entries(TIPOS_INFORME) as [
    TipoFormulario,
    (typeof TIPOS_INFORME)[TipoFormulario],
  ][];

  // Si solo hay un tipo, lo seleccionamos automáticamente
  // (esto se quitará cuando haya más tipos)
  if (tipos.length === 1 && !tipoSeleccionado) {
    const [unicoTipo] = tipos[0];
    setTipoSeleccionado(unicoTipo);
  }

  if (!tipoSeleccionado) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Nuevo informe</h1>
        <p className="text-muted-foreground">
          ¿Qué tipo de informe quieres crear?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tipos.map(([tipo, config]) => (
            <Card
              key={tipo}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setTipoSeleccionado(tipo)}
            >
              <CardHeader>
                <CardTitle>{config.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTipoSeleccionado(tipo)}
                >
                  Crear
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const config = getTipoConfig(tipoSeleccionado);
  const FormComponent = config.FormComponent;

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/mis-informes")}
        >
          ← Volver
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">{config.nombre}</h1>
      <FormComponent defaultDatos={config.defaultDatos} />
    </div>
  );
}
