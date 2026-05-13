import { z } from "zod";

export const MedidaRowSchema = z.object({
  frecMhz: z.number().nullable(),
  potW: z.number().nullable(),
  vpaV: z.number().nullable(),
  ipa1: z.number().nullable(),
  ipa2: z.number().nullable(),
  ipa3: z.number().nullable(),
  tOut: z.number().nullable(),
  tCase: z.number().nullable(),
  tPwS: z.number().nullable(),
  eff: z.number().nullable(),
  if1: z.number().nullable(),
  if2: z.number().nullable(),
  if3: z.number().nullable(),
});

export const InformeSchema = z.object({
  // Únicos campos obligatorios
  fechaConclusion: z.string().min(1, "Obligatorio"),
  firmaTecnico: z.string().min(1, "Obligatorio"),

  // Strings opcionales
  equipo: z.string().optional(),
  noOrden: z.string().optional(),
  nSerie: z.string().optional(),
  cliente: z.string().optional(),
  sitio: z.string().optional(),
  observaciones: z.string().optional(),
  versionFirmware: z.string().optional(),
  versionWebServer: z.string().optional(),
  actuaciones: z.string().optional(),
  motivosNoApto: z.string().optional(),

  tipoEquipo: z.enum(["nuevo", "reparado_fabrica", "reparado_vimesa"]).optional(),
  tempAmbiente: z.number().nullable().optional(),
  equipoApto: z.boolean(),

  // Sin .default() - defaults van en DEFAULT_VALUES del form
  testsRealizados: z.array(z.string()),
  cellnexConfig: z.array(z.string()),

  snmpV1: z.object({
    ip: z.string().optional(),
    mask: z.string().optional(),
    gateway: z.string().optional(),
    password: z.string().optional(),
  }).optional(),

  snmpV2: z.object({
    ip: z.string().optional(),
    mask: z.string().optional(),
    gateway: z.string().optional(),
    login: z.string().optional(),
    password: z.string().optional(),
  }).optional(),

  medidas: z.array(MedidaRowSchema),
  medidasCamara: z.array(MedidaRowSchema),
});

export type FormValues = z.infer<typeof InformeSchema>;
export type MedidaRow = z.infer<typeof MedidaRowSchema>;
