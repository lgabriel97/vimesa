// index.ts
import { app } from "./app";
import { env } from "./lib/env";

app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});
