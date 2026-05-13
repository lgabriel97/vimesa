import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { apiFetch } from "@/lib/api";
import { getTipoConfig } from "./registry";
import type { Informe } from "@/types/informe";

export default function EditarInforme() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [informe, setInforme] = useState<Informe | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch<Informe>(`/informes/${id}`).then(setInforme);
  }, [id]);

  if (!informe) return <p className="text-muted-foreground">Cargando...</p>;

  const config = getTipoConfig(informe.tipo);
  const FormComponent = config.FormComponent;

  // Mezclamos los datos del informe con la fecha y firma comunes
  // para que el form los reciba como defaults planos
  const fecha = informe.fechaConclusion
    ? informe.fechaConclusion.slice(0, 10)
    : "";
  const defaultValues = {
    ...informe.datos,
    fechaConclusion: fecha,
    firmaTecnico: informe.firmaTecnico,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar {config.nombre}</h1>
      <FormComponent
        informeId={informe.id}
        defaultDatos={defaultValues}
        onSuccess={() => navigate(`/informes/${informe.id}`)}
      />
    </div>
  );
}
