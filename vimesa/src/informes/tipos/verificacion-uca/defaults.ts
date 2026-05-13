import type { VerificacionUcaDatos, VerificacionUcaFormValues } from "./schema";
import { UCA_ITEMS } from "./constants";

export const DEFAULT_DATOS_UCA: VerificacionUcaDatos = {
  observaciones: "",
  items: UCA_ITEMS.map(() => ({
    resultadoDisplay: null,
    resultadoWeb: null,
    resultadoSnmp: null,
  })),
};

export const DEFAULT_UCA_FORM_VALUES: VerificacionUcaFormValues = {
  ...DEFAULT_DATOS_UCA,
  fechaConclusion: "",
  firmaTecnico: "",
};
