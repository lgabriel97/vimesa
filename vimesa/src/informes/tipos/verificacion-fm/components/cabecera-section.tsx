"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSeparator,
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormValues } from "../schema";
import { TIPO_EQUIPO_OPCIONES } from "../constants/opciones";

export function CabeceraSection() {
  const [bpLabel, setBPLabel] = useState("");
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Protocolo de verificación — Transmisor FM Vimesa BP{bpLabel} LCD
        </CardTitle>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <FieldLabel>Equipo</FieldLabel>
              <Input
                placeholder="BPXXXXX"
                {...register("equipo")}
                onChange={(e) => setBPLabel(e.target.value)}
              />
              {errors.equipo && (
                <FieldDescription className="text-destructive">
                  {errors.equipo.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>No. Orden</FieldLabel>
              <Input placeholder="OT-00000" {...register("noOrden")} />
              {errors.noOrden && (
                <FieldDescription className="text-destructive">
                  {errors.noOrden.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>N/S (Nº de serie)</FieldLabel>
              <Input placeholder="SN-00000" {...register("nSerie")} />
              {errors.nSerie && (
                <FieldDescription className="text-destructive">
                  {errors.nSerie.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Cliente</FieldLabel>
              <Input
                placeholder="Nombre del cliente"
                {...register("cliente")}
              />
              {errors.cliente && (
                <FieldDescription className="text-destructive">
                  {errors.cliente.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Sitio</FieldLabel>
              <Input placeholder="Ubicación" {...register("sitio")} />
              {errors.sitio && (
                <FieldDescription className="text-destructive">
                  {errors.sitio.message}
                </FieldDescription>
              )}
            </Field>
          </div>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Tipo de equipo</FieldLegend>
            <Controller
              name="tipoEquipo"
              control={control}
              render={({ field }) => (
                <FieldGroup>
                  <RadioGroup
                    name="tipoEquipo"
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-col gap-3"
                  >
                    {TIPO_EQUIPO_OPCIONES.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <RadioGroupItem value={opt.value} id={opt.id} />
                        <FieldLabel htmlFor={opt.id} className="font-normal">
                          {opt.label}
                        </FieldLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FieldGroup>
              )}
            />
          </FieldSet>

          <Field>
            <FieldLabel>Observaciones</FieldLabel>
            <Textarea
              placeholder="Observaciones generales del equipo"
              className="resize-none"
              {...register("observaciones")}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
