"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { FieldGroup } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { CELLNEX_OPCIONES } from "@/VerificationForm/constants/opciones";

export function CellnexSection() {
  const [procede, setProcede] = useState(false);
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración Cellnex</CardTitle>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox
              id="cellnex-procede"
              checked={procede}
              onCheckedChange={(v) => setProcede(v === true)}
            />
            <FieldLabel htmlFor="cellnex-procede" className="font-normal">
              Procede
            </FieldLabel>
          </Field>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${procede ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            {CELLNEX_OPCIONES.map((c) => (
              <Controller
                key={c.id}
                name="cellnexConfig"
                control={control}
                render={({ field }) => {
                  const checked = field.value.includes(c.value);
                  return (
                    <Field orientation="horizontal">
                      <Checkbox
                        id={c.id}
                        checked={checked}
                        onCheckedChange={() => {
                          const next = checked
                            ? field.value.filter((v: string) => v !== c.value)
                            : [...field.value, c.value];
                          field.onChange(next);
                        }}
                      />
                      <FieldLabel htmlFor={c.id} className="font-normal">
                        {c.label}
                      </FieldLabel>
                    </Field>
                  );
                }}
              />
            ))}
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
