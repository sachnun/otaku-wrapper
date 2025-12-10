import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { successResponse, type ApiErrorResponse } from "@otaku-wrapper/core";
import { kusonimeService } from "./services/kusonime.service";
import { openApiSpec } from "./openapi";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.onError((err, c) => {
  const statusCode = (err as any).statusCode || 500;
  const path = c.req.path;

  let resource = "RESOURCE";
  if (path.includes("/anime/")) resource = "ANIME";
  else if (path.includes("/genres/")) resource = "GENRE";
  else if (path.includes("/seasons/")) resource = "SEASON";
  else if (path.includes("/search")) resource = "SEARCH";

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

app.get("/api/home", async (c) => {
  const startTime = Date.now();
  const data = await kusonimeService.getHome();
  return successResponse(c, data, startTime);
});

app.get("/api/latest", async (c) => {
  const startTime = Date.now();
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.getLatestAnime(page);
  return successResponse(c, data, startTime);
});

app.get("/api/anime-list", async (c) => {
  const startTime = Date.now();
  const list = await kusonimeService.getAnimeList();
  return successResponse(c, { list }, startTime);
});

app.get("/api/anime/:slug", async (c) => {
  const startTime = Date.now();
  const slug = c.req.param("slug");
  const data = await kusonimeService.getAnimeDetail(slug);
  return successResponse(c, data, startTime);
});

app.get("/api/genres", async (c) => {
  const startTime = Date.now();
  const genres = await kusonimeService.getGenres();
  return successResponse(c, { genres }, startTime);
});

app.get("/api/genres/:genre", async (c) => {
  const startTime = Date.now();
  const genre = c.req.param("genre");
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.getAnimeByGenre(genre, page);
  return successResponse(c, data, startTime);
});

app.get("/api/seasons", async (c) => {
  const startTime = Date.now();
  const seasons = await kusonimeService.getSeasons();
  return successResponse(c, { seasons }, startTime);
});

app.get("/api/seasons/:season", async (c) => {
  const startTime = Date.now();
  const season = c.req.param("season");
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.getAnimeBySeason(season, page);
  return successResponse(c, data, startTime);
});

app.get("/api/search", async (c) => {
  const startTime = Date.now();
  const query = c.req.query("q") || "";
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.search(query, page);
  return successResponse(c, data, startTime);
});

export default app;
