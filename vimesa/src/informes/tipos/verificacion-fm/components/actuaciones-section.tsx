"use client";

import { useFormContext } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormValues } from "../types/verificacion";

export function ActuacionesSection() {
  const { register } = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actuaciones adicionales y observaciones</CardTitle>
      </CardHeader>

      <CardContent>
        <Field>
          <Textarea
            placeholder="Describir actuaciones realizadas y observaciones adicionales..."
            rows={5}
            className="resize-none"
            {...register("actuaciones")}
          />
        </Field>
      </CardContent>
    </Card>
  );
}
