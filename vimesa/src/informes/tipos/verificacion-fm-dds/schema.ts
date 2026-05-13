import { z } from "zod";

const numOrNull = z.union([z.number(), z.null()]).optional().nullable();
const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().nullable().optional(),
);

export const MedidaSchema = z.object({
  frecMhz: z.number().nullable(),
  potW: numOrNull,
  vpaV: numOrNull,
  ipa1: numOrNull,
  ipa2: numOrNull,
  ipa3: numOrNull,
  tOut: numOrNull,
  tCase: numOrNull,
  tPwS: numOrNull,
  eff: numOrNull,
  if1: numOrNull,
  if2: numOrNull,
  if3: numOrNull,
});

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
    .optional(),
  snmpV2: z
    .object({
      ip: optionalString,
      mask: optionalString,
      gateway: optionalString,
      login: optionalString,
      password: optionalString,
    })
    .optional(),
  medidas: z.array(MedidaSchema),
});

export const VerificacionFmDdsFormSchema = z.object({
  fechaConclusion: z.string().min(1, "Obligatorio"),
  firmaTecnico: z.string().min(1, "Obligatorio"),

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
  tipoEquipo: z.enum(["nuevo", "reparado_fabrica", "reparado_vimesa"]).optional(),
  tempAmbiente: z.number().nullable().optional(),
  equipoApto: z.boolean(),
  testsRealizados: z.array(z.string()),
  cellnexConfig: z.array(z.string()),
  snmpV1: z.object({
    ip: optionalString,
    mask: optionalString,
    gateway: optionalString,
    password: optionalString,
  }).optional(),
  snmpV2: z.object({
    ip: optionalString,
    mask: optionalString,
    gateway: optionalString,
    login: optionalString,
    password: optionalString,
  }).optional(),
  medidas: z.array(MedidaSchema),
});

export type VerificacionFmDdsDatos = z.infer<typeof VerificacionFmDdsDatosSchema>;
export type VerificacionFmDdsFormValues = z.infer<typeof VerificacionFmDdsFormSchema>;

export type FormValues = VerificacionFmDdsFormValues;
export type MedidaRow = z.infer<typeof MedidaSchema>;
