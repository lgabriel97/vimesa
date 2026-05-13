import { LOGO_DATA_URI } from "../../assets/logo";

// Helper para mostrar valores que pueden ser null
function v(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

// Helper para checkbox marcado/desmarcado
function check(condition: boolean): string {
  return condition ? "☒" : "☐";
}

// Helper para mapear el enum del backend al texto humano
const TIPO_EQUIPO_LABEL: Record<string, string> = {
  NUEVO: "nuevo",
  REPARADO_FABRICA: "reparado en fábrica",
  REPARADO_VIMESA: "reparado en Vimesa",
};

interface PlantillaInput {
  informe: any; // tipo Informe + medidas + tecnico
  esBorrador: boolean; // true si es preview, marca con "BORRADOR"
}

export function generarHtmlInforme({
  informe,
  esBorrador,
}: PlantillaInput): string {
  const medidasPrincipal = (informe.medidas || []).filter(
    (m: any) => m.tipo === "PRINCIPAL",
  );
  const medidasCamara = (informe.medidas || []).filter(
    (m: any) => m.tipo === "CAMARA",
  );

  // Tests realizados (array de strings) y configuración Cellnex
  const tests = informe.testsRealizados || [];
  const cellnex = informe.cellnexConfig || [];

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Protocolo Verificación</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @page {
    size: A4;
    margin: 12mm 10mm;
  }

  body {
    font-family: 'Calibri', Arial, sans-serif;
    font-size: 9pt;
    color: #000;
    position: relative;
  }

  ${
    esBorrador
      ? `
  body::before {
    content: "BORRADOR";
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 120pt;
    font-weight: 700;
    color: rgba(255, 0, 0, 0.12);
    z-index: -1;
    pointer-events: none;
  }
  `
      : ""
  }

  .cabecera {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .cabecera img {
    height: 50px;
    width: auto;
  }

  .cabecera-direccion {
    text-align: right;
    font-size: 7pt;
    color: #444;
    line-height: 1.3;
  }

  .titulo {
    background: #fff;
    border: 1px solid #000;
    text-align: center;
    font-weight: 700;
    font-size: 11pt;
    padding: 4px;
    margin-bottom: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #000;
  }

  td, th {
    border: 1px solid #000;
    padding: 3px 5px;
    vertical-align: middle;
  }

  th {
    background: #f0f0f0;
    font-weight: 700;
    text-align: left;
    font-size: 9pt;
  }

  .seccion-header {
    background: #fff;
    text-align: center;
    font-weight: 700;
    border-top: none;
  }

  .label { width: 18%; font-weight: 600; }
  .label-narrow { width: 12%; font-weight: 600; }

  /* Tablas de mediciones */
  table.medidas th, table.medidas td {
    text-align: center;
    font-size: 8pt;
    height: 18px;
  }

  table.medidas th { background: #fff; }

  /* Filas vacías para mediciones */
  table.medidas td.celda-vacia { min-height: 18px; }

  /* Sección de checkboxes */
  .checkbox-row {
    display: flex;
    justify-content: space-between;
  }

  .checkbox-text {
    flex: 1;
  }

  .checkbox-mark {
    width: 18px;
    text-align: center;
    font-size: 11pt;
  }

  /* Bloque conclusiones */
  .conclusion-area {
    height: 80px;
  }
</style>
</head>
<body>

  <div class="cabecera">
    <img src="${LOGO_DATA_URI}" alt="Vimesa" />
    <div class="cabecera-direccion">
      Calle Batalla de Brunete, 48 - 28946 Fuenlabrada - Madrid<br>
      Tel: 91 606 88 70  Fax: 91 606 88 42  email: vimesa@vimesa.es - http://www.vimesa.es
    </div>
  </div>

  <div class="titulo">PROTOCOLO DE VERIFICACION DE TRANSMISORES DE FM VIMESA</div>

  <table>
    <tr>
      <td colspan="4">Equipo: Transmisor de FM Vimesa BP ${v(informe.equipo)} LCD &nbsp;&nbsp;&nbsp; </td>
    </tr>
    <tr>
      <td class="label">No. Orden:</td>
      <td>${v(informe.noOrden)}</td>
      <td class="label">N/S:</td>
      <td>${v(informe.nSerie)}</td>
    </tr>
    <tr>
      <td class="label">Técnico:</td>
      <td>${v(informe.tecnico?.nombre)}</td>
      <td class="label">Fecha:</td>
      <td>${informe.fechaConclusion ? new Date(informe.fechaConclusion).toLocaleDateString("es-ES") : ""}</td>
    </tr>
    <tr>
      <td class="label">Cliente:</td>
      <td>${v(informe.cliente)}</td>
      <td class="label">Sitio:</td>
      <td>${v(informe.sitio)}</td>
    </tr>
    <tr>
      <td colspan="2">
        <div>${check(informe.tipoEquipo === "NUEVO")} Equipo nuevo</div>
        <div>${check(informe.tipoEquipo === "REPARADO_FABRICA")} Equipo reparado en fábrica &nbsp;&nbsp; ${check(informe.tipoEquipo === "REPARADO_VIMESA")} Equipo reparado en Vimesa</div>
      </td>
      <td class="label">Observaciones:</td>
      <td>${v(informe.observaciones)}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: 700;">
        Lectura de parámetros a temperatura ambiente de: ${v(informe.tempAmbiente)} ºC
      </td>
    </tr>
    <tr>
      <td colspan="4" style="font-size: 8pt;">
        Después de al menos 10 minutos en funcionamiento (88 MHz, 98 MHz, 108 MHz y Frec. de trabajo)<br>
        Si es equipo de reserva configurar memorias y tomar lecturas en frecuencias de trabajo
      </td>
    </tr>
  </table>

  <table class="medidas">
    <tr>
      <th>Frec.(MHz)</th>
      <th>Pot(W)</th>
      <th>Vpa(V)</th>
      <th>Ipa1(A)</th>
      <th>Ipa2(A)</th>
      <th>Ipa3(A)</th>
      <th>TOut(ºC)</th>
      <th>TCase(ºC)</th>
      <th>TPwS(ºC)</th>
      <th>Eff(%)</th>
      <th>IF1(A)</th>
      <th>IF2(A)</th>
      <th>IF3(A)</th>
    </tr>
    ${renderFilasMedidas(medidasPrincipal)}
  </table>

  <table>
    <tr>
      <td colspan="13" style="text-align: center; font-weight: 700;">
        Lectura de parámetros en cámara climática a 45ºC (si procede) en frecuencia de trabajo
      </td>
    </tr>
  </table>

  <table class="medidas">
    <tr>
      <th>Frec.(MHz)</th>
      <th>Pot(W)</th>
      <th>Vpa(V)</th>
      <th>Ipa1(A)</th>
      <th>Ipa2(A)</th>
      <th>Ipa3(A)</th>
      <th>TOut(ºC)</th>
      <th>TCase(ºC)</th>
      <th>TPwS(ºC)</th>
      <th>Eff(%)</th>
      <th>IF1(A)</th>
      <th>IF2(A)</th>
      <th>IF3(A)</th>
    </tr>
    ${renderFilasMedidas(medidasCamara, 1)}
  </table>

  <table>
    <tr>
      <td colspan="2" style="text-align: center; font-weight: 700;">Otras comprobaciones</td>
    </tr>
    <tr>
      <td style="width: 50%;">
        <div>${check(tests.includes("web_snmp"))} Test WEB / SNMP V2</div>
        <div>${check(tests.includes("vibracion"))} Test de Vibración</div>
        <div>${check(tests.includes("audio"))} Test de Audio (más info en Reporte de Analizador de Mod.)</div>
        <div>${check(tests.includes("rds"))} Test RDS</div>
        <div>${check(tests.includes("tlc_tls"))} Test TLC/TLS</div>
        <div>${check(tests.includes("pll"))} Test PLL</div>
        <div style="margin-top: 4px;"><b>Versión Firmware:</b> ${v(informe.versionFirmware)}</div>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <div><b>IP SNMP V1:</b> ${v(informe.snmpV1?.ip)}</div>
        <div><b>Password:</b> ${v(informe.snmpV1?.password)}</div>
        <div><b>Mask:</b> ${v(informe.snmpV1?.mask)}</div>
        <div><b>Gateway:</b> ${v(informe.snmpV1?.gateway)}</div>
        <div style="margin-top: 4px;"><b>IP SNMP V2:</b> ${v(informe.snmpV2?.ip)}</div>
        <div><b>Login:</b> ${v(informe.snmpV2?.login)} &nbsp;&nbsp; <b>Password:</b> ${v(informe.snmpV2?.password)}</div>
        <div><b>Mask:</b> ${v(informe.snmpV2?.mask)}</div>
        <div><b>Gateway:</b> ${v(informe.snmpV2?.gateway)}</div>
        <div style="margin-top: 4px;"><b>Versión Web Server:</b> ${v(informe.versionWebServer)}</div>
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <td colspan="2" style="text-align: center; font-weight: 700;">Configuración Cellnex (si procede)</td>
    </tr>
    <tr>
      <td style="width: 50%;">
        <div>${check(cellnex.includes("snmp_traps"))} IP SNMP Traps 10.1.107.56</div>
        <div>${check(cellnex.includes("ntp"))} IP NTP 10.1.109.10</div>
        <div>${check(cellnex.includes("dns"))} IP DNS 10.1.109.111</div>
      </td>
      <td style="width: 50%;">
        <div>${check(cellnex.includes("audio_lr"))} Nivel de entrada Audio L &amp; R: 14.5 dBu</div>
        <div>${check(cellnex.includes("audio_mpx"))} Nivel de entrada Audio MPX: 4.1 dBu</div>
        <div>${check(cellnex.includes("db25"))} Parámetros DB 25</div>
        <div>${check(cellnex.includes("19khz"))} Nivel 19 KHz O.Amp: -8</div>
      </td>
    </tr>
  </table>

  <table>
    <tr><td style="text-align: center; font-weight: 700;">Actuaciones adicionales y observaciones</td></tr>
    <tr><td class="conclusion-area">${v(informe.actuaciones)}</td></tr>
  </table>

  <table>
    <tr><td colspan="2" style="text-align: center; font-weight: 700;">Conclusiones</td></tr>
    <tr>
      <td style="width: 50%;">${check(informe.equipoApto)} <b>Equipo apto</b></td>
      <td><b>Fecha:</b> ${informe.fechaConclusion ? new Date(informe.fechaConclusion).toLocaleDateString("es-ES") : ""}</td>
    </tr>
    <tr style="height: 50px;">
      <td><b>Motivos si no apto:</b><br>${v(informe.motivosNoApto)}</td>
      <td><b>Firma Técnico:</b><br>${v(informe.firmaTecnico)}</td>
    </tr>
  </table>

</body>
</html>`;
}

function renderFilasMedidas(medidas: any[], minFilas: number = 4): string {
  const filas = [...medidas];
  while (filas.length < minFilas) {
    filas.push({});
  }

  return filas
    .map(
      (m) => `
    <tr>
      <td>${v(m.frecMhz)}</td>
      <td>${v(m.potW)}</td>
      <td>${v(m.vpaV)}</td>
      <td>${v(m.ipa1)}</td>
      <td>${v(m.ipa2)}</td>
      <td>${v(m.ipa3)}</td>
      <td>${v(m.tOut)}</td>
      <td>${v(m.tCase)}</td>
      <td>${v(m.tPwS)}</td>
      <td>${v(m.eff)}</td>
      <td>${v(m.if1)}</td>
      <td>${v(m.if2)}</td>
      <td>${v(m.if3)}</td>
    </tr>
  `,
    )
    .join("");
}
