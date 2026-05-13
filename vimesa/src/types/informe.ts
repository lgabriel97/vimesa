export type Rol = "TECNICO" | "ADMIN";
export type EstadoInforme = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "DEVUELTO";
export type TipoFormulario = "VERIFICACION_FM" | "VERIFICACION_FM_DDS" | "VERIFICACION_UCA";

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
}

export interface Informe {
  id: string;
  tipo: TipoFormulario;
  datos: any;
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

export interface PdfRecord {
  id: string;
  createdAt: string;
  generadoPor: { id: string; nombre: string };
  informe?: {
    id: string;
    tipo: TipoFormulario;
    estado: EstadoInforme;
    datos?: any;
  };
}
