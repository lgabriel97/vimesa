import { LOGO_DATA_URI } from "../../assets/logo";

function v(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

function result(value: string | null | undefined): string {
  if (value === "OK") return '<span style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:7pt;padding:1px 8px;border-radius:2px;">OK</span>';
  if (value === "KO") return '<span style="display:inline-block;background:#dc2626;color:#fff;font-weight:700;font-size:7pt;padding:1px 8px;border-radius:2px;">KO</span>';
  return "";
}

const ITEMS = [
  { n: "1", d: "Configuración UCA vía display, Web Server y gestión de Jumper" },
  { n: "2", d: "Credenciales de autentificación" },
  { n: "3", d: "Comprobación de todas las Pantallas de Configuración y Lectura de estados" },
  { n: "4", d: "Sustituir UCA sin producir Corte de la Emisión de FM" },
  { n: "5", d: "Comprobación Orden de Reset a Tx Individual" },
  { n: "6", d: "Comprobación Orden de Reset a todos los Tx" },
  { n: "8", d: "Comprobación señalización ON/OFF de todos los Tx" },
  { n: "9", d: "Comprobación Funcionamiento si Traba Sistema Radiante abierta" },
  { n: "10", d: "Comprobación Funcionamiento si Traba Carga Radiante abierta" },
  { n: "11", d: "Comprobación de Función Inicializar UCA" },
  { n: "12", d: "Comprobación de función Txs ON/Txs OFF" },
  { n: "13", d: "Comprobación de TxPn ON/OFF" },
  { n: "14", d: "Comprobación de TxR ON/OFF" },
  { n: "15", d: "Comprobación de la señalización de alarmas en la UCA" },
  { n: "15.1", d: "Alarma General Txn o TxR" },
  { n: "15.2", d: "Fallo RF Txn o TxR" },
  { n: "15.3", d: "Presencia/Ausencia de Red (AC) Txn o TxR" },
  { n: "15.4", d: "Señalización TxPn o TxR Local/Remoto" },
  { n: "15.5", d: "Fallo Matriz de Audio" },
  { n: "15.6", d: "Alarma de Motor Cxn" },
  { n: "15.7", d: "Descargar Log de Eventos" },
  { n: "16", d: "Comprobación de la Conmutación Manual de todos los TxP y TxR" },
  { n: "16.1", d: "TxP1 a TxPn a Carga" },
  { n: "16.2", d: "TxP1 a TxPn a Antena" },
  { n: "16.3", d: "TxR a Ax y TxR a Carga" },
  { n: "16.4", d: "Estado Inicial UCA" },
  { n: "16.5", d: "Tx's en Antena ON" },
  { n: "16.6", d: "Tx's OFF" },
  { n: "16.7", d: "TxPn ON/OFF" },
  { n: "16.8", d: "TxR ON/OFF" },
  { n: "17", d: "Comprobación de la Conmutación Automática de todos los TxP y TxR" },
  { n: "17.1", d: "Conmutación TxP1 a TxPn a Carga" },
  { n: "17.2", d: "Conmutación TxP1 a TxPn a Antena" },
  { n: "17.3", d: "Conmutación TxR a Ax y TxR a Carga" },
  { n: "17.4", d: "Conmutaciones con Prioridad" },
  { n: "17.5", d: "Conmutaciones con Prioridad Cero" },
  { n: "17.6", d: "Conmutación si Fallo TxR en Ax y en ON" },
];

interface PlantillaInput {
  informe: any;
  esBorrador: boolean;
}

export function generarHtmlVerificacionUca({ informe, esBorrador }: PlantillaInput): string {
  const datos = informe.datos || {};
  const results = datos.items || [];

  const filas = ITEMS.map((item, i) => {
    const r = results[i] || {};
    return `
    <tr>
      <td style="text-align: center; width: 40px;">${item.n}</td>
      <td>${item.d}</td>
      <td style="text-align: center;">${result(r.resultadoDisplay)}</td>
      <td style="text-align: center;">${result(r.resultadoWeb)}</td>
      <td style="text-align: center;">${result(r.resultadoSnmp)}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Protocolo Verificación UCA</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4 landscape; margin: 10mm 8mm; }
  body {
    font-family: 'Calibri', Arial, sans-serif;
    font-size: 8pt;
    color: #000;
    position: relative;
  }
  ${esBorrador ? `
  body::before {
    content: "BORRADOR";
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 120pt; font-weight: 700;
    color: rgba(255, 0, 0, 0.12); z-index: -1;
  }` : ""}
  .cabecera { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .cabecera img { height: 40px; }
  .cabecera-direccion { text-align: right; font-size: 6.5pt; color: #444; line-height: 1.3; }
  .titulo {
    background: #fff; border: 1px solid #000; text-align: center;
    font-weight: 700; font-size: 10pt; padding: 4px; margin-bottom: 4px;
  }
  table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
  td, th { border: 1px solid #000; padding: 2px 4px; vertical-align: middle; }
  th { background: #f0f0f0; font-weight: 700; text-align: center; font-size: 7.5pt; }
</style>
</head>
<body>
  <div class="cabecera">
    <img src="${LOGO_DATA_URI}" alt="Vimesa" />
    <div class="cabecera-direccion">
      Calle Batalla de Brunete, 48 - 28946 Fuenlabrada - Madrid<br>
      Tel: 91 606 88 70 &nbsp; email: vimesa@vimesa.es
    </div>
  </div>

  <div class="titulo">MATRIZ DE VERIFICACION DE UCA VIMESA</div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">No</th>
        <th>Verificaciones y/o Comprobación</th>
        <th style="width: 50px;">Display</th>
        <th style="width: 50px;">WEB</th>
        <th style="width: 50px;">SNMP</th>
      </tr>
    </thead>
    <tbody>
      ${filas}
    </tbody>
  </table>

  <div style="margin-top: 8px;">
    <table>
      <tr>
        <td style="width: 25%;"><b>Técnico:</b> ${v(informe.tecnico?.nombre)}</td>
        <td style="width: 25%;"><b>Fecha:</b> ${informe.fechaConclusion ? new Date(informe.fechaConclusion).toLocaleDateString("es-ES") : ""}</td>
        <td style="width: 25%;"><b>Firma:</b> ${v(informe.firmaTecnico)}</td>
        <td style="width: 25%;"><b>Observaciones:</b> ${v(datos.observaciones)}</td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 4px; font-size: 7pt;">
    <b>Leyenda:</b> OK = Bien &nbsp;&nbsp;&nbsp; KO = Mal
  </div>
</body>
</html>`;
}
