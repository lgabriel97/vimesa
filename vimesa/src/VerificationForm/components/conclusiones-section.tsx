"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormValues } from "@/VerificationForm/types/verificacion";

export function ConclusionesSection() {
  const {
    register,
    setValue,
    reset,
    control,
    formState: { isSubmitting },
  } = useFormContext<FormValues>();

  const equipoApto = useWatch({ control, name: "equipoApto" }) ?? false;

  function toggleApto(v: boolean) {
    setValue("equipoApto", v, { shouldDirty: true, shouldTouch: true });
    if (v) {
      setValue("motivosNoApto", "", { shouldDirty: true });
    }
  }

  function handleCancel() {
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conclusiones</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox
              id="apto"
              checked={equipoApto}
              onCheckedChange={(v) => toggleApto(v === true)}
            />
            <FieldLabel htmlFor="apto" className="font-normal">
              Equipo apto
            </FieldLabel>
          </Field>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              !equipoApto ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <Field>
              <FieldLabel>Motivos si no apto</FieldLabel>
              <Textarea
                placeholder="Describir los motivos..."
                className="resize-none"
                {...register("motivosNoApto")}
              />
            </Field>
          </div>

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
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
