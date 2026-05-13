import { app } from "./app";
import { env } from "./lib/env";

app.listen(env.PORT, () => {
  console.log(`
┌──────────────────────────────────────────┐
│  Vimesa — Verificaciones FM             │
│                                          │
│  API:    http://localhost:${String(env.PORT).padEnd(36)}│
│  Front:  http://localhost (puerto 80)    │
│                                          │
│  Credenciales: docker exec vimesa-backend cat /app/seed-info
└──────────────────────────────────────────┘
  `);
});
