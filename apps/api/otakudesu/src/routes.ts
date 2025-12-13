import { Hono } from "hono";
import { successResponse } from "@otaku-wrapper/core";
import { otakudesuService } from "./services/otakudesu.service";

export const otakudesuRoutes = new Hono();

otakudesuRoutes.get("/home", async (c) => {
  const startTime = Date.now();
  const data = await otakudesuService.getHome();
  return successResponse(c, data, startTime);
});

otakudesuRoutes.get("/ongoing", async (c) => {
  const startTime = Date.now();
  const page = parseInt(c.req.query("page") || "1");
  const data = await otakudesuService.getOngoing(page);
  return successResponse(c, data, startTime);
});

otakudesuRoutes.get("/complete", async (c) => {
  const startTime = Date.now();
  const page = parseInt(c.req.query("page") || "1");
  const data = await otakudesuService.getComplete(page);
  return successResponse(c, data, startTime);
});

otakudesuRoutes.get("/anime-list", async (c) => {
  const startTime = Date.now();
  const list = await otakudesuService.getAnimeList();
  return successResponse(c, { list }, startTime);
});

otakudesuRoutes.get("/anime/:slug", async (c) => {
  const startTime = Date.now();
  const slug = c.req.param("slug");
  const data = await otakudesuService.getAnimeDetail(slug);
  return successResponse(c, data, startTime);
});

otakudesuRoutes.get("/episode/:slug", async (c) => {
  const startTime = Date.now();
  const slug = c.req.param("slug");
  const data = await otakudesuService.getEpisodeDetail(slug);
  return successResponse(c, data, startTime);
});

otakudesuRoutes.get("/genres", async (c) => {
  const startTime = Date.now();
  const genres = await otakudesuService.getGenres();
  return successResponse(c, { genres }, startTime);
});

otakudesuRoutes.get("/genres/:genre", async (c) => {
  const startTime = Date.now();
  const genre = c.req.param("genre");
  const page = parseInt(c.req.query("page") || "1");
  const data = await otakudesuService.getAnimeByGenre(genre, page);
  return successResponse(c, data, startTime);
});

otakudesuRoutes.get("/schedule", async (c) => {
  const startTime = Date.now();
  const schedule = await otakudesuService.getSchedule();
  return successResponse(c, { schedule }, startTime);
});

otakudesuRoutes.get("/search", async (c) => {
  const startTime = Date.now();
  const query = c.req.query("q") || "";
  const anime = await otakudesuService.search(query);
  return successResponse(c, { anime }, startTime);
});

otakudesuRoutes.post("/resolve-streaming", async (c) => {
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

otakudesuRoutes.get("/resolve-streaming/:dataContent", async (c) => {
  const startTime = Date.now();
  const dataContent = c.req.param("dataContent");
  const data = await otakudesuService.resolveStreamingUrl(dataContent);
  return successResponse(c, data, startTime);
});
