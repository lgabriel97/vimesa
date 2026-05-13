import puppeteer, { Browser } from "puppeteer";
import { getTipoConfig } from "../informes/registry";

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

export async function cerrarBrowser(): Promise<void> {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

interface GenerarPdfInput {
  informe: any;
  esBorrador: boolean;
}

export async function generarPdfInforme({
  informe,
  esBorrador,
}: GenerarPdfInput): Promise<Buffer> {
  const config = getTipoConfig(informe.tipo);
  const html = config.generarHtml({ informe, esBorrador });

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
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
