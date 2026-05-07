"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MEDIDA_COLUMNS,
  LOCKED_ROW_COUNT,
} from "@/VerificationForm/constants/medidas";
import type { FormValues } from "@/VerificationForm/types/verificacion";
import { Helper } from "@/components/common/helper";

export function MedidasTable() {
  const { control, register } = useFormContext<FormValues>();
  const { fields } = useFieldArray({ control, name: "medidas" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medidas</CardTitle>
        <Helper description="Si es equipo de reserva configurar memorias y tomar lecturas en frecuencias de trabajo" />
      </CardHeader>
      <CardContent>
        <FieldDescription className="mb-4">
          Lecturas tomadas después de al menos 10 min en funcionamiento a 88,
          98, 108 MHz y frecuencia de trabajo.
        </FieldDescription>

        <Field className="mb-3">
          <FieldLabel>Temperatura ambiente (ºC)</FieldLabel>
          <Input
            type="number"
            step="0.1"
            placeholder="25"
            {...register("tempAmbiente", {
              setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
            })}
          />
        </Field>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {MEDIDA_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="border border-border bg-muted px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, rowIdx) => (
                <tr key={field.id} className="even:bg-muted/30">
                  {MEDIDA_COLUMNS.map((col) => {
                    const isLocked = col.locked && rowIdx < LOCKED_ROW_COUNT;
                    return (
                      <td key={col.key} className="border border-border p-1">
                        <Input
                          type="number"
                          step="any"
                          placeholder="—"
                          readOnly={isLocked}
                          tabIndex={isLocked ? -1 : 0}
                          className={`h-8 min-w-18 border-0 bg-transparent px-1 shadow-none focus-visible:ring-1 ${
                            isLocked ? "text-muted-foreground" : ""
                          }`}
                          {...register(`medidas.${rowIdx}.${col.key}`, {
                            setValueAs: (v) =>
                              v === "" || v == null ? null : Number(v),
                          })}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
