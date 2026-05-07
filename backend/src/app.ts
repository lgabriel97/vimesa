import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import informesRoutes from "./routes/informes";
import pdfsRoutes from "./routes/pdfs";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/informes", informesRoutes);
app.use("/api/pdfs", pdfsRoutes);

app.use(errorHandler);
