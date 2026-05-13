import type {
  TipoEquipoOption,
  TestOption,
  CellnexOption,
} from "../types/verificacion";

export const TIPO_EQUIPO_OPCIONES: TipoEquipoOption[] = [
  { value: "nuevo", label: "Equipo nuevo", id: "tipo-nuevo" },
  {
    value: "reparado_fabrica",
    label: "Equipo reparado en fábrica",
    id: "tipo-fabrica",
  },
  {
    value: "reparado_vimesa",
    label: "Equipo reparado en Vimesa",
    id: "tipo-vimesa",
  },
];

export const TESTS_DISPONIBLES: TestOption[] = [
  { value: "web_snmp", label: "Test Web/SNMP V2", id: "test-web-snmp" },
  { value: "vibracion", label: "Test de Vibración", id: "test-vibracion" },
  { value: "rds", label: "Test RDS", id: "test-rds" },
  { value: "tlc_tls", label: "Test TLC/TLS", id: "test-tlc-tls" },
  { value: "audio", label: "Test de Audio", id: "test-audio" },
  { value: "pll", label: "Test PLL", id: "test-pll" },
];

export const CELLNEX_OPCIONES: CellnexOption[] = [
  { value: "snmp_traps", label: "IP SNMP Traps 10.1.107.56", id: "cx-snmp" },
  { value: "ntp", label: "IP NTP 10.1.109.10", id: "cx-ntp" },
  { value: "dns", label: "IP DNS 10.1.109.111", id: "cx-dns" },
  {
    value: "audio_lr",
    label: "Nivel de entrada Audio L&R: 14.5 dBu",
    id: "cx-audio-lr",
  },
  {
    value: "audio_mpx",
    label: "Nivel de entrada Audio MPX: 4.1 dBu",
    id: "cx-mpx",
  },
  { value: "db25", label: "Parámetros DB 25", id: "cx-db25" },
  { value: "19khz", label: "Nivel 19 KHz O.Amp: -8", id: "cx-19khz" },
];
