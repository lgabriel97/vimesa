"use client";

import {
  useForm,
  FormProvider,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  VerificacionFmDdsFormSchema,
  type VerificacionFmDdsFormValues,
} from "./schema";
import { DEFAULT_FM_DDS_FORM_VALUES } from "./defaults";
import { apiFetch, ApiError } from "@/lib/api";
import { CabeceraSection } from "./components/cabecera-section";
import { CellnexSection } from "./components/cellnex-section";
import { ActuacionesSection } from "./components/actuaciones-section";
import { ConclusionesSection } from "./components/conclusiones-section";
import { MedidasTable } from "./components/medidas-table";
import { TestsFirmwareSection } from "./components/tests-firmware-section";

interface Props {
  informeId?: string;
  defaultDatos?: any;
  onSuccess?: () => void;
}

export default function VerificacionFmDdsForm({
  informeId,
  defaultDatos,
  onSuccess,
}: Props) {
  const navigate = useNavigate();
  const esEdicion = !!informeId;

  const initialValues: VerificacionFmDdsFormValues = {
    ...DEFAULT_FM_DDS_FORM_VALUES,
    ...(defaultDatos ?? {}),
  };

  const methods = useForm<VerificacionFmDdsFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(VerificacionFmDdsFormSchema) as any,
    mode: "onSubmit",
  });

  const { handleSubmit, reset, setError } = methods;

  async function onValid(values: VerificacionFmDdsFormValues) {
    const { fechaConclusion, firmaTecnico, ...datos } = values;

    const payload = {
      tipo: "VERIFICACION_FM_DDS",
      fechaConclusion,
      firmaTecnico,
      datos,
    };

    try {
      if (esEdicion) {
        await apiFetch(`/informes/${informeId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Informe actualizado");
      } else {
        await apiFetch("/informes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Verificación enviada", {
          description: "El informe está pendiente de revisión.",
        });
        reset(DEFAULT_FM_DDS_FORM_VALUES);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/mis-informes");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && err.details) {
        const details = err.details as {
          fieldErrors?: Record<string, string[] | undefined>;
        };
        if (details.fieldErrors) {
          Object.entries(details.fieldErrors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              setError(field as keyof VerificacionFmDdsFormValues, {
                message: messages[0],
              });
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

  const onInvalid: SubmitErrorHandler<VerificacionFmDdsFormValues> = (errors) => {
    const firstPath = getFirstErrorPath(errors);
    if (firstPath) {
      const fieldLabel = getLabelForPath(firstPath);
      toast.error("Falta completar campos", {
        description: `${fieldLabel || "Campo"} es obligatorio.`,
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
        <TestsFirmwareSection />
        <CellnexSection />
        <ActuacionesSection />
        <ConclusionesSection />
      </form>
    </FormProvider>
  );
}

function getFirstErrorPath(
  errors: Record<string, any>,
  prefix = "",
): string | null {
  for (const key of Object.keys(errors)) {
    const value = errors[key];
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && "message" in value && "type" in value) {
      return path;
    }
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
