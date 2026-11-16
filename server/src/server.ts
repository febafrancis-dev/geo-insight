import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.info(`GeoInsight API listening on http://127.0.0.1:${env.PORT}`);
});
