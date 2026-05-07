import puppeteer, { Browser } from "puppeteer";
import { generarHtmlInforme } from "./plantilla";

let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserPromise;
}

// Llamar al apagar la app, opcional
export async function cerrarBrowser(): Promise<void> {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

interface GenerarPdfInput {
  informe: any; // Informe con relaciones (tecnico, medidas)
  esBorrador: boolean;
}

export async function generarPdfInforme({
  informe,
  esBorrador,
}: GenerarPdfInput): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    const html = generarHtmlInforme({ informe, esBorrador });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "10mm", bottom: "12mm", left: "10mm" },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}
