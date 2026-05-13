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

export const InformeSchema = z.object({
  fechaConclusion: z.string().min(1),
  firmaTecnico: z.string().min(1),

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
  medidasCamara: z.array(MedidaSchema),
});

export const RevisionSchema = z.object({
  estado: z.enum(["APROBADO", "RECHAZADO", "DEVUELTO"]),
  comentariosRevisor: z.string().optional(),
});

export type InformeInput = z.infer<typeof InformeSchema>;
