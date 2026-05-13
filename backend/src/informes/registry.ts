import { z } from "zod";
import { VerificacionFmDatosSchema } from "./verificacion-fm/schema";
import { generarHtmlVerificacionFm } from "./verificacion-fm/pdf";
import { VerificacionFmDdsDatosSchema } from "./verificacion-fm-dds/schema";
import { generarHtmlVerificacionFmDds } from "./verificacion-fm-dds/pdf";
import { VerificacionUcaDatosSchema } from "./verificacion-uca/schema";
import { generarHtmlVerificacionUca } from "./verificacion-uca/pdf";

export interface TipoInformeConfig {
  /** Schema Zod para validar el campo `datos` */
  schema: z.ZodTypeAny;
  /** Función que genera el HTML del PDF a partir del informe completo */
  generarHtml: (input: { informe: any; esBorrador: boolean }) => string;
  /** Nombre humano para mostrar en la UI */
  nombre: string;
}

export const TIPOS_INFORME: Record<string, TipoInformeConfig> = {
  VERIFICACION_FM: {
    schema: VerificacionFmDatosSchema,
    generarHtml: generarHtmlVerificacionFm,
    nombre: "Verificación de transmisor FM",
  },
  VERIFICACION_FM_DDS: {
    schema: VerificacionFmDdsDatosSchema,
    generarHtml: generarHtmlVerificacionFmDds,
    nombre: "Verificación de transmisor FM DDS",
  },
  VERIFICACION_UCA: {
    schema: VerificacionUcaDatosSchema,
    generarHtml: generarHtmlVerificacionUca,
    nombre: "Verificación de UCA",
  },
};

export function getTipoConfig(tipo: string): TipoInformeConfig {
  const config = TIPOS_INFORME[tipo];
  if (!config) {
    throw new Error(`Tipo de informe desconocido: ${tipo}`);
  }
  return config;
}
