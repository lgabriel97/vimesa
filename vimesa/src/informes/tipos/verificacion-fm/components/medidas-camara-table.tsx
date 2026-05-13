"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MEDIDA_COLUMNS } from "../constants/medidas";
import type { FormValues } from "../schema";
import { Helper } from "@/components/common/helper";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

function parseNumber(value: string): number | null {
  if (value === "") return null;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function MedidasCamaraTable() {
  const [procede, setProcede] = useState(false);
  const { setValue } = useFormContext<FormValues>();
  const rowIdx = 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lectura de parámetros en cámara climática</CardTitle>
        <Helper description="Si es equipo de reserva configurar memorias y tomar lecturas en frecuencias de trabajo" />
      </CardHeader>

      <CardContent>
        <Field orientation="horizontal">
          <Checkbox
            id="camara-procede"
            checked={procede}
            onCheckedChange={(v) => setProcede(v === true)}
          />
          <FieldLabel htmlFor="camara-procede" className="font-normal">
            Procede
          </FieldLabel>
        </Field>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${procede ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <FieldDescription className="mb-4">
            Lectura de parámetros en cámara climática a 45ºC en frecuencia de
            trabajo
          </FieldDescription>

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
                <tr className="bg-muted/30">
                  {MEDIDA_COLUMNS.map((col) => (
                    <td key={col.key} className="border border-border p-1">
                      <Input
                        type="number"
                        step="any"
                        placeholder="—"
                        className="h-8 min-w-18 border-0 bg-transparent px-1 shadow-none focus-visible:ring-1"
                        onChange={(e) =>
                          setValue(
                            `medidasCamara.${rowIdx}.${col.key}`,
                            parseNumber(e.target.value),
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
