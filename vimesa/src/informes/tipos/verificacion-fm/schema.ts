import { z } from "zod";

// (Mantén tu MedidaSchema actual y los helpers numOrNull / optionalString como estaban.)

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

/**
 * Datos específicos del formulario Verificación FM.
 */
export const VerificacionFmDatosSchema = z.object({
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
  medidasCamara: z.array(MedidaSchema),
});

/**
 * Schema del FORMULARIO en sí mismo (lo que el form-state maneja).
 * Incluye los campos comunes que el técnico también rellena (fecha, firma).
 */
export const VerificacionFmFormSchema = z.object({
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
  medidasCamara: z.array(MedidaSchema),
});

export type VerificacionFmDatos = z.infer<typeof VerificacionFmDatosSchema>;
export type VerificacionFmFormValues = z.infer<typeof VerificacionFmFormSchema>;

// Aliases para compatibilidad con componentes existentes
export type FormValues = VerificacionFmFormValues;
export type MedidaRow = z.infer<typeof MedidaSchema>;
