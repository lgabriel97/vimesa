// src/informes/tipos/verificacion-fm/defaults.ts
import { DEFAULT_MEDIDAS, DEFAULT_MEDIDAS_CAMARA } from "./constants/medidas";
import type { VerificacionFmDatos, VerificacionFmFormValues } from "./schema";

/** Valores por defecto SOLO de los datos específicos (sin fechaConclusion ni firmaTecnico) */
export const DEFAULT_DATOS_FM: VerificacionFmDatos = {
  equipo: "",
  noOrden: "",
  nSerie: "",
  cliente: "",
  sitio: "",
  tipoEquipo: "nuevo",
  observaciones: "",
  tempAmbiente: null,
  medidas: DEFAULT_MEDIDAS,
  medidasCamara: DEFAULT_MEDIDAS_CAMARA,
  testsRealizados: [],
  cellnexConfig: [],
  versionFirmware: "",
  versionWebServer: "",
  snmpV1: { ip: "", mask: "", gateway: "", password: "" },
  snmpV2: { ip: "", mask: "", gateway: "", login: "", password: "" },
  actuaciones: "",
  equipoApto: false,
  motivosNoApto: "",
};

/** Valores por defecto del formulario completo (datos + comunes) */
export const DEFAULT_FM_FORM_VALUES: VerificacionFmFormValues = {
  ...DEFAULT_DATOS_FM,
  fechaConclusion: "",
  firmaTecnico: "",
};
