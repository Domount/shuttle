import { loadEnv } from "@domount/shuttle/server";
import { createProjectApp } from "#server/app.js";

loadEnv();
const port = Number(process.env.PORT || 4600);
const app = createProjectApp();
app.listen(port, () => {
  console.log(`examples/hello-agent API http://localhost:${port}`);
});
