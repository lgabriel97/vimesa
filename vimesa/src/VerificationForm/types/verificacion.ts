export type { FormValues, MedidaRow } from "@/lib/schemas/informe";

export type MedidaColumn = {
  key: string;
  label: string;
  locked?: boolean;
};

export type TipoEquipoOption = {
  value: "nuevo" | "reparado_fabrica" | "reparado_vimesa";
  label: string;
  id: string;
};

export type TestOption = {
  value: string;
  label: string;
  id: string;
};

export type CellnexOption = {
  value: string;
  label: string;
  id: string;
};
