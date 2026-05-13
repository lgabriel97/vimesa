import fs from "fs";
import path from "path";

const LOGO_PATH = path.join(__dirname, "vimesa-logo.png");

const LOGO_BASE64 = fs.readFileSync(LOGO_PATH).toString("base64");

/**
 * Logo de Vimesa como data URI, listo para usar en HTML.
 * Se carga una vez al arrancar el proceso.
 */
export const LOGO_DATA_URI = `data:image/png;base64,${LOGO_BASE64}`;
