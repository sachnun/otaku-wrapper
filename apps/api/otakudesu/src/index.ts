import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { type ApiErrorResponse } from "@otaku-wrapper/core";
import { openApiSpec } from "./openapi";
import { otakudesuRoutes } from "./routes";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.onError((err, c) => {
  const statusCode = (err as any).statusCode || 500;
  const path = c.req.path;

  let resource = "RESOURCE";
  if (path.includes("/anime/")) resource = "ANIME";
  else if (path.includes("/episode/")) resource = "EPISODE";
  else if (path.includes("/genres/")) resource = "GENRE";
  else if (path.includes("/search")) resource = "SEARCH";
  else if (path.includes("/resolve-streaming")) resource = "STREAMING";

  const statusMap: Record<number, string> = {
    400: "BAD_REQUEST",
    404: `${resource}_NOT_FOUND`,
    502: "UPSTREAM_ERROR",
    504: "UPSTREAM_TIMEOUT",
    429: "RATE_LIMIT_EXCEEDED",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
  };

  const errorCode = statusMap[statusCode] || "INTERNAL_ERROR";

  const errorResponse: ApiErrorResponse = {
    success: false,
    statusCode,
    message: err.message || "Internal server error",
    error: {
      code: errorCode,
    },
    timestamp: new Date().toISOString(),
    path,
  };

  return c.json(errorResponse, statusCode);
});

app.get("/openapi.json", (c) => {
  return c.json(openApiSpec);
});

app.get("/docs", swaggerUI({ url: "/openapi.json" }));

app.get("/", (c) => {
  return c.redirect("/docs");
});

app.route("/api", otakudesuRoutes);

export default app;
export { otakudesuRoutes, openApiSpec as otakudesuOpenApiSpec };
