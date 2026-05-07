"use client";

import {
  useForm,
  FormProvider,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { FormValues } from "./types/verificacion";
import { InformeSchema } from "@/lib/schemas/informe";
import { apiFetch, ApiError } from "@/lib/api";
import { CabeceraSection } from "./components/cabecera-section";
import { CellnexSection, ActuacionesSection, ConclusionesSection } from ".";
import { MedidasTable } from "./components/medidas-table";
import { MedidasCamaraTable } from "./components/medidas-camara-table";
import { TestsFirmwareSection } from "./tests-firmware-section";
import { DEFAULT_MEDIDAS, DEFAULT_MEDIDAS_CAMARA } from "./constants/medidas";

const DEFAULT_VALUES: FormValues = {
  equipo: "",
  noOrden: "",
  nSerie: "",
  cliente: "",
  sitio: "",
  tipoEquipo: "nuevo",
  observaciones: "",
  tempAmbiente: null,
  medidas: DEFAULT_MEDIDAS,
  medidasCamara: DEFAULT_MEDIDAS_CAMARA,
  testsRealizados: [],
  cellnexConfig: [],
  versionFirmware: "",
  versionWebServer: "",
  snmpV1: { ip: "", mask: "", gateway: "", password: "" },
  snmpV2: { ip: "", mask: "", gateway: "", login: "", password: "" },
  actuaciones: "",
  equipoApto: false,
  motivosNoApto: "",
  fechaConclusion: "",
  firmaTecnico: "",
};

export default function VerificacionForm() {
  const methods = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(InformeSchema),
    mode: "onSubmit",
  });

  const { handleSubmit, reset, setError } = methods;

  async function onValid(data: FormValues) {
    try {
      await apiFetch("/informes", {
        method: "POST",
        body: JSON.stringify(data),
      });
      toast.success("Verificación enviada", {
        description:
          "El informe ha sido registrado y está pendiente de revisión.",
      });
      reset(DEFAULT_VALUES);
      // Si en el futuro tienes una vista "mis informes", redirige aquí:
      // navigate("/mis-informes");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && err.details) {
        // El backend valida con el mismo schema Zod, así que en condiciones
        // normales no debería haber errores aquí. Pero por si acaso:
        const details = err.details as {
          fieldErrors?: Record<string, string[] | undefined>;
        };
        if (details.fieldErrors) {
          Object.entries(details.fieldErrors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              setError(field as keyof FormValues, { message: messages[0] });
            }
          });
        }
        toast.error("Datos inválidos", {
          description: "Revisa los campos marcados.",
        });
        return;
      }

      toast.error("Error al enviar", {
        description:
          err instanceof Error ? err.message : "No se pudo enviar el informe",
      });
    }
  }

  const onInvalid: SubmitErrorHandler<FormValues> = (errors) => {
    // Coge el primer error del árbol y enfoca el campo
    const firstPath = getFirstErrorPath(errors);
    if (firstPath) {
      const fieldLabel = getLabelForPath(firstPath);
      toast.error("Falta completar campos", {
        description: `${fieldLabel || "Campo"} es obligatorio.`,
        duration: 5000,
      });

      const el = document.querySelector(`[name="${firstPath}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if ("focus" in el) (el as HTMLElement).focus();
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="w-full max-w-6xl space-y-6"
      >
        <CabeceraSection />
        <MedidasTable />
        <MedidasCamaraTable />
        <TestsFirmwareSection />
        <CellnexSection />
        <ActuacionesSection />
        <ConclusionesSection />

        {/* Si tu ConclusionesSection ya tiene el botón submit, ignora este bloque.
            Si no, descomenta: */}
        {/*
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar verificación"}
          </Button>
        </div>
        */}
      </form>
    </FormProvider>
  );
}

/** Recorre el objeto de errores de RHF y devuelve el primer path con error (notación a.b.c). */
function getFirstErrorPath(
  errors: Record<string, any>,
  prefix = "",
): string | null {
  for (const key of Object.keys(errors)) {
    const value = errors[key];
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;

    // Si es una hoja (tiene `message`), es el primer error
    if (typeof value === "object" && "message" in value && "type" in value) {
      return path;
    }
    // Si es un objeto anidado, baja recursivo
    if (typeof value === "object") {
      const nested = getFirstErrorPath(value, path);
      if (nested) return nested;
    }
  }
  return null;
}

function getLabelForPath(path: string): string | null {
  const labels: Record<string, string> = {
    fechaConclusion: "Fecha",
    firmaTecnico: "Firma técnico",
  };
  return labels[path] || null;
}
