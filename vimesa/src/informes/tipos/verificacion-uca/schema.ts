import { z } from "zod";

const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().nullable().optional(),
);

const resultEnum = z.enum(["OK", "KO"]).nullable();

const ItemResultSchema = z.object({
  resultadoDisplay: resultEnum,
  resultadoWeb: resultEnum,
  resultadoSnmp: resultEnum,
});

export const VerificacionUcaDatosSchema = z.object({
  observaciones: optionalString,
  items: z.array(ItemResultSchema),
});

export const VerificacionUcaFormSchema = z.object({
  fechaConclusion: z.string().min(1, "Obligatorio"),
  firmaTecnico: z.string().min(1, "Obligatorio"),
  observaciones: optionalString,
  items: z.array(ItemResultSchema),
});

export type VerificacionUcaDatos = z.infer<typeof VerificacionUcaDatosSchema>;
export type VerificacionUcaFormValues = z.infer<typeof VerificacionUcaFormSchema>;

export type { ItemResultSchema };
export type ItemResult = z.infer<typeof ItemResultSchema>;
