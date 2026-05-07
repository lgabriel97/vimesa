"use client";

import { useFormContext, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSeparator,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormValues } from "./types/verificacion";
import { TESTS_DISPONIBLES } from "@/VerificationForm/constants/opciones";

export function TestsFirmwareSection() {
  const { register, control } = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests y firmware</CardTitle>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Tests</FieldLegend>
            <FieldGroup>
              {TESTS_DISPONIBLES.map((t) => (
                <Controller
                  key={t.id}
                  name="testsRealizados"
                  control={control}
                  render={({ field }) => {
                    const checked = field.value.includes(t.value);
                    return (
                      <Field orientation="horizontal">
                        <Checkbox
                          id={t.id}
                          checked={checked}
                          onCheckedChange={() => {
                            const next = checked
                              ? field.value.filter((v: string) => v !== t.value)
                              : [...field.value, t.value];
                            field.onChange(next);
                          }}
                        />
                        <FieldLabel htmlFor={t.id} className="font-normal">
                          {t.label}
                        </FieldLabel>
                      </Field>
                    );
                  }}
                />
              ))}
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Firmware</FieldLegend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Versión firmware</FieldLabel>
                <Input placeholder="v1.0.0" {...register("versionFirmware")} />
              </Field>
            </div>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>SNMP V1</FieldLegend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel>IP SNMP V1</FieldLabel>
                <Input placeholder="192.168.1.1" {...register("snmpV1.ip")} />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Contraseña SNMP V1"
                  {...register("snmpV1.password")}
                />
              </Field>
              <Field>
                <FieldLabel>Mask</FieldLabel>
                <Input placeholder="255.255.255.0" {...register("snmpV1.mask")} />
              </Field>
              <Field>
                <FieldLabel>Gateway</FieldLabel>
                <Input placeholder="192.168.1.254" {...register("snmpV1.gateway")} />
              </Field>
            </div>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>SNMP V2</FieldLegend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field>
                <FieldLabel>IP SNMP V2</FieldLabel>
                <Input placeholder="192.168.1.1" {...register("snmpV2.ip")} />
              </Field>
              <Field>
                <FieldLabel>Login</FieldLabel>
                <Input placeholder="admin" {...register("snmpV2.login")} />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Contraseña SNMP V2"
                  {...register("snmpV2.password")}
                />
              </Field>
              <Field>
                <FieldLabel>Mask</FieldLabel>
                <Input placeholder="255.255.255.0" {...register("snmpV2.mask")} />
              </Field>
              <Field>
                <FieldLabel>Gateway</FieldLabel>
                <Input placeholder="192.168.1.254" {...register("snmpV2.gateway")} />
              </Field>
              <Field>
                <FieldLabel>Versión Web Server</FieldLabel>
                <Input placeholder="v1.0.0" {...register("versionWebServer")} />
              </Field>
            </div>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
