import { loadEnv } from "@domount/shuttle/server";
import { createProjectApp } from "#server/app.js";

loadEnv();
const port = Number(process.env.PORT || {{serverPort}});
const app = createProjectApp();
app.listen(port, () => {
  console.log(`{{projectName}} API http://localhost:${port}`);
});
