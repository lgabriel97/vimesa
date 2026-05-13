import type { ComponentType } from "react";
import type { TipoFormulario } from "@/types/informe";
import VerificacionFmForm from "./tipos/verificacion-fm/Form";
import { VerificacionFmDetalle } from "./tipos/verificacion-fm/Detalle";
import { DEFAULT_DATOS_FM } from "./tipos/verificacion-fm/defaults";
import VerificacionFmDdsForm from "./tipos/verificacion-fm-dds/Form";
import { VerificacionFmDdsDetalle } from "./tipos/verificacion-fm-dds/Detalle";
import { DEFAULT_DATOS_FM_DDS } from "./tipos/verificacion-fm-dds/defaults";
import VerificacionUcaForm from "./tipos/verificacion-uca/Form";
import { VerificacionUcaDetalle } from "./tipos/verificacion-uca/Detalle";
import { DEFAULT_DATOS_UCA } from "./tipos/verificacion-uca/defaults";

export interface TipoInformeConfig {
  nombre: string;
  /** Componente que renderiza el formulario para este tipo */
  FormComponent: ComponentType<{
    informeId?: string;
    defaultDatos?: any;
    onSuccess?: () => void;
  }>;
  /** Componente que renderiza el detalle de un informe ya creado */
  DetalleComponent: ComponentType<{ informe: any }>;
  /** Valores por defecto del campo `datos` para un informe nuevo */
  defaultDatos: any;
}

export const TIPOS_INFORME: Record<TipoFormulario, TipoInformeConfig> = {
  VERIFICACION_FM: {
    nombre: "Verificación de transmisor FM LCD",
    FormComponent: VerificacionFmForm,
    DetalleComponent: VerificacionFmDetalle,
    defaultDatos: DEFAULT_DATOS_FM,
  },
  VERIFICACION_FM_DDS: {
    nombre: "Verificación de transmisor FM DDS",
    FormComponent: VerificacionFmDdsForm,
    DetalleComponent: VerificacionFmDdsDetalle,
    defaultDatos: DEFAULT_DATOS_FM_DDS,
  },
  VERIFICACION_UCA: {
    nombre: "Verificación de UCA",
    FormComponent: VerificacionUcaForm,
    DetalleComponent: VerificacionUcaDetalle,
    defaultDatos: DEFAULT_DATOS_UCA,
  },
};

export function getTipoConfig(tipo: TipoFormulario): TipoInformeConfig {
  const config = TIPOS_INFORME[tipo];
  if (!config) throw new Error(`Tipo de informe desconocido: ${tipo}`);
  return config;
}
