export type Rol = "TECNICO" | "ADMIN";
export type EstadoInforme = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "DEVUELTO";
export type TipoEquipo = "NUEVO" | "REPARADO_FABRICA" | "REPARADO_VIMESA";

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
}

export interface Medida {
  id?: string;
  tipo?: "PRINCIPAL" | "CAMARA";
  orden?: number;
  frecMhz: number | null;
  potW: number | null;
  vpaV: number | null;
  ipa1: number | null;
  ipa2: number | null;
  ipa3: number | null;
  tOut: number | null;
  tCase: number | null;
  tPwS: number | null;
  eff: number | null;
  if1: number | null;
  if2: number | null;
  if3: number | null;
}

export interface Informe {
  id: string;
  equipo: string | null;
  noOrden: string | null;
  nSerie: string | null;
  cliente: string | null;
  sitio: string | null;
  tipoEquipo: TipoEquipo | null;
  tempAmbiente: number | null;
  observaciones: string | null;
  versionFirmware: string | null;
  versionWebServer: string | null;
  snmpV1: {
    ip: string | null;
    mask: string | null;
    gateway: string | null;
    password: string | null;
  } | null;
  snmpV2: {
    ip: string | null;
    mask: string | null;
    gateway: string | null;
    login: string | null;
    password: string | null;
  } | null;
  testsRealizados: string[];
  cellnexConfig: string[];
  medidas?: Medida[];
  equipoApto: boolean;
  motivosNoApto: string | null;
  actuaciones: string | null;
  fechaConclusion: string;
  firmaTecnico: string;
  estado: EstadoInforme;
  tecnicoId: string;
  tecnico?: { id: string; nombre: string; email?: string };
  revisor?: { id: string; nombre: string } | null;
  comentariosRevisor: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PdfTipo = "PREVIEW" | "DEFINITIVO";

export interface PdfRecord {
  id: string;
  tipo: PdfTipo;
  createdAt: string;
  generadoPor: { id: string; nombre: string };
  informe?: {
    id: string;
    equipo: string | null;
    cliente: string | null;
    noOrden: string | null;
    estado: EstadoInforme;
  };
}
