import { z } from "zod";
import { MedidaSchema } from "../verificacion-fm/schema";

const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().nullable().optional(),
);

export const VerificacionFmDdsDatosSchema = z.object({
  equipo: optionalString,
  noOrden: optionalString,
  nSerie: optionalString,
  cliente: optionalString,
  sitio: optionalString,
  observaciones: optionalString,
  versionFirmware: optionalString,
  versionWebServer: optionalString,
  actuaciones: optionalString,
  motivosNoApto: optionalString,

  tipoEquipo: z
    .enum(["nuevo", "reparado_fabrica", "reparado_vimesa"])
    .nullable()
    .optional(),
  tempAmbiente: z.number().nullable().optional(),
  equipoApto: z.boolean(),
  testsRealizados: z.array(z.string()),
  cellnexConfig: z.array(z.string()),

  snmpV1: z
    .object({
      ip: optionalString,
      mask: optionalString,
      gateway: optionalString,
      password: optionalString,
    })
    .nullable()
    .optional(),

  snmpV2: z
    .object({
      ip: optionalString,
      mask: optionalString,
      gateway: optionalString,
      login: optionalString,
      password: optionalString,
    })
    .nullable()
    .optional(),

  medidas: z.array(MedidaSchema),
});

export type VerificacionFmDdsDatos = z.infer<typeof VerificacionFmDdsDatosSchema>;
