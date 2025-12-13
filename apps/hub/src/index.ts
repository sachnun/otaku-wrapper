import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";

import { kusonimeRoutes } from "../../api/kusonime/src/routes";
import { meioRoutes } from "../../api/meio/src/routes";
import { otakudesuRoutes } from "../../api/otakudesu/src/routes";
import { softkomikRoutes } from "../../api/softkomik/src/routes";

import { createOpenApiSpec } from "./openapi";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.get("/", (c) => c.redirect("/docs"));

app.get("/docs", swaggerUI({ url: "/openapi.json" }));

app.get("/openapi.json", (c) => c.json(createOpenApiSpec()));

app.route("/api/kusonime", kusonimeRoutes);
app.route("/api/meio", meioRoutes);
app.route("/api/otakudesu", otakudesuRoutes);
app.route("/api/softkomik", softkomikRoutes);

export default app;
