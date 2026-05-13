import { DEFAULT_MEDIDAS } from "./constants/medidas";
import type { VerificacionFmDdsDatos, VerificacionFmDdsFormValues } from "./schema";

export const DEFAULT_DATOS_FM_DDS: VerificacionFmDdsDatos = {
  equipo: "",
  noOrden: "",
  nSerie: "",
  cliente: "",
  sitio: "",
  tipoEquipo: "nuevo",
  observaciones: "",
  tempAmbiente: null,
  medidas: DEFAULT_MEDIDAS,
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

export const DEFAULT_FM_DDS_FORM_VALUES: VerificacionFmDdsFormValues = {
  ...DEFAULT_DATOS_FM_DDS,
  fechaConclusion: "",
  firmaTecnico: "",
};
