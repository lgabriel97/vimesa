"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  VerificacionUcaFormSchema,
  type VerificacionUcaFormValues,
} from "./schema";
import { DEFAULT_UCA_FORM_VALUES } from "./defaults";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { UCA_ITEMS } from "./constants";

type SubmitErrorHandler = (errors: Record<string, any>) => void;

interface Props {
  informeId?: string;
  defaultDatos?: any;
  onSuccess?: () => void;
}

function ResultToggle({
  value,
  onChange,
}: {
  value: "OK" | "KO" | null;
  onChange: (v: "OK" | "KO" | null) => void;
}) {
  function cycle() {
    if (!value) onChange("OK");
    else if (value === "OK") onChange("KO");
    else onChange(null);
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={cycle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") cycle(); }}
      className={`inline-block w-8 cursor-pointer select-none rounded text-xs font-semibold transition-colors hover:bg-muted ${
        value === "OK"
          ? "text-green-600"
          : value === "KO"
            ? "text-red-600"
            : "text-muted-foreground"
      }`}
    >
      {value ?? "—"}
    </span>
  );
}

export default function VerificacionUcaForm({
  informeId,
  defaultDatos,
  onSuccess,
}: Props) {
  const navigate = useNavigate();
  const esEdicion = !!informeId;

  const initialValues: VerificacionUcaFormValues = {
    ...DEFAULT_UCA_FORM_VALUES,
    ...(defaultDatos ?? {}),
  };

  const methods = useForm<VerificacionUcaFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(VerificacionUcaFormSchema) as any,
    mode: "onSubmit",
  });

  const { handleSubmit, register, setValue, watch, reset, formState: { isSubmitting } } = methods;
  const items = watch("items");

  async function onValid(values: VerificacionUcaFormValues) {
    const { fechaConclusion, firmaTecnico, ...datos } = values;
    const payload = {
      tipo: "VERIFICACION_UCA",
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
        reset(DEFAULT_UCA_FORM_VALUES);
      }
      if (onSuccess) onSuccess();
      else navigate("/mis-informes");
    } catch (err) {
      toast.error("Error al enviar", {
        description:
          err instanceof Error ? err.message : "No se pudo enviar el informe",
      });
    }
  }

  const onInvalid: SubmitErrorHandler = (_errors) => {
    toast.error("Falta completar campos", {
      description: "Revisa los campos obligatorios.",
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="w-full max-w-6xl space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Verificación de UCA</CardTitle>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Observaciones</FieldLabel>
              <Textarea
                placeholder="Observaciones adicionales..."
                className="resize-none"
                {...register("observaciones")}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verificaciones y/o Comprobación</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground w-12">No</th>
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">Verificaciones y/o Comprobación</th>
                    <th className="text-center px-2 py-2 font-medium text-muted-foreground w-16">Display</th>
                    <th className="text-center px-2 py-2 font-medium text-muted-foreground w-16">WEB</th>
                    <th className="text-center px-2 py-2 font-medium text-muted-foreground w-16">SNMP</th>
                  </tr>
                </thead>
                <tbody>
                  {UCA_ITEMS.map((item, i) => (
                    <tr key={item.numero} className="border-b hover:bg-muted/30">
                      <td className="px-3 py-1.5 text-xs text-muted-foreground align-top pt-3">
                        {item.numero}
                      </td>
                      <td className="px-3 py-1.5 text-xs align-top pt-3">
                        {item.descripcion}
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <ResultToggle
                          value={items?.[i]?.resultadoDisplay ?? null}
                          onChange={(v) => setValue(`items.${i}.resultadoDisplay`, v)}
                        />
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <ResultToggle
                          value={items?.[i]?.resultadoWeb ?? null}
                          onChange={(v) => setValue(`items.${i}.resultadoWeb`, v)}
                        />
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <ResultToggle
                          value={items?.[i]?.resultadoSnmp ?? null}
                          onChange={(v) => setValue(`items.${i}.resultadoSnmp`, v)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conclusiones</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Fecha</FieldLabel>
                  <Input type="date" {...register("fechaConclusion")} />
                </Field>
                <Field>
                  <FieldLabel>Firma técnico</FieldLabel>
                  <Input
                    placeholder="Nombre y apellidos"
                    {...register("firmaTecnico")}
                  />
                </Field>
              </div>
              <Field orientation="horizontal">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Guardar verificación"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
