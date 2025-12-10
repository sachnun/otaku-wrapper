import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { otakudesuService } from "./services/otakudesu.service";
import type { ApiResponse, ApiErrorResponse } from "./types";
import { openApiSpec } from "./openapi";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger());

// Error handler
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

// Helper function to create success response
function successResponse<T>(c: any, data: T, startTime: number): Response {
  const responseTime = `${Date.now() - startTime}ms`;
  const response: ApiResponse<T> = {
    success: true,
    statusCode: 200,
    message: "OK",
    data,
    timestamp: new Date().toISOString(),
    path: c.req.path,
    responseTime,
  };

  c.header("X-Response-Time", responseTime);
  return c.json(response);
}

// OpenAPI JSON
app.get("/openapi.json", (c) => {
  return c.json(openApiSpec);
});

// Swagger UI
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

// Root redirect to docs
app.get("/", (c) => {
  return c.redirect("/docs");
});

// API Routes

// Home
app.get("/api/home", async (c) => {
  const startTime = Date.now();
  const data = await otakudesuService.getHome();
  return successResponse(c, data, startTime);
});

// Ongoing anime
app.get("/api/ongoing", async (c) => {
  const startTime = Date.now();
  const page = parseInt(c.req.query("page") || "1");
  const data = await otakudesuService.getOngoing(page);
  return successResponse(c, data, startTime);
});

// Complete anime
app.get("/api/complete", async (c) => {
  const startTime = Date.now();
  const page = parseInt(c.req.query("page") || "1");
  const data = await otakudesuService.getComplete(page);
  return successResponse(c, data, startTime);
});

// Anime list
app.get("/api/anime-list", async (c) => {
  const startTime = Date.now();
  const list = await otakudesuService.getAnimeList();
  return successResponse(c, { list }, startTime);
});

// Anime detail
app.get("/api/anime/:slug", async (c) => {
  const startTime = Date.now();
  const slug = c.req.param("slug");
  const data = await otakudesuService.getAnimeDetail(slug);
  return successResponse(c, data, startTime);
});

// Episode detail
app.get("/api/episode/:slug", async (c) => {
  const startTime = Date.now();
  const slug = c.req.param("slug");
  const data = await otakudesuService.getEpisodeDetail(slug);
  return successResponse(c, data, startTime);
});

// Genres list
app.get("/api/genres", async (c) => {
  const startTime = Date.now();
  const genres = await otakudesuService.getGenres();
  return successResponse(c, { genres }, startTime);
});

// Anime by genre
app.get("/api/genres/:genre", async (c) => {
  const startTime = Date.now();
  const genre = c.req.param("genre");
  const page = parseInt(c.req.query("page") || "1");
  const data = await otakudesuService.getAnimeByGenre(genre, page);
  return successResponse(c, data, startTime);
});

// Schedule
app.get("/api/schedule", async (c) => {
  const startTime = Date.now();
  const schedule = await otakudesuService.getSchedule();
  return successResponse(c, { schedule }, startTime);
});

// Search
app.get("/api/search", async (c) => {
  const startTime = Date.now();
  const query = c.req.query("q") || "";
  const anime = await otakudesuService.search(query);
  return successResponse(c, { anime }, startTime);
});

// Resolve streaming (POST)
app.post("/api/resolve-streaming", async (c) => {
  const startTime = Date.now();
  const body = await c.req.json();
  const dataContent = body.dataContent;

  if (!dataContent) {
    const error = new Error("dataContent is required");
    (error as any).statusCode = 400;
    throw error;
  }

  const data = await otakudesuService.resolveStreamingUrl(dataContent);
  return successResponse(c, data, startTime);
});

// Resolve streaming (GET)
app.get("/api/resolve-streaming/:dataContent", async (c) => {
  const startTime = Date.now();
  const dataContent = c.req.param("dataContent");
  const data = await otakudesuService.resolveStreamingUrl(dataContent);
  return successResponse(c, data, startTime);
});

export default app;
