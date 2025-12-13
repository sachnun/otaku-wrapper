import { Hono } from "hono";
import { successResponse } from "@otaku-wrapper/core";
import { kusonimeService } from "./services/kusonime.service";

export const kusonimeRoutes = new Hono();

kusonimeRoutes.get("/home", async (c) => {
  const startTime = Date.now();
  const data = await kusonimeService.getHome();
  return successResponse(c, data, startTime);
});

kusonimeRoutes.get("/latest", async (c) => {
  const startTime = Date.now();
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.getLatestAnime(page);
  return successResponse(c, data, startTime);
});

kusonimeRoutes.get("/anime-list", async (c) => {
  const startTime = Date.now();
  const list = await kusonimeService.getAnimeList();
  return successResponse(c, { list }, startTime);
});

kusonimeRoutes.get("/anime/:slug", async (c) => {
  const startTime = Date.now();
  const slug = c.req.param("slug");
  const data = await kusonimeService.getAnimeDetail(slug);
  return successResponse(c, data, startTime);
});

kusonimeRoutes.get("/genres", async (c) => {
  const startTime = Date.now();
  const genres = await kusonimeService.getGenres();
  return successResponse(c, { genres }, startTime);
});

kusonimeRoutes.get("/genres/:genre", async (c) => {
  const startTime = Date.now();
  const genre = c.req.param("genre");
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.getAnimeByGenre(genre, page);
  return successResponse(c, data, startTime);
});

kusonimeRoutes.get("/seasons", async (c) => {
  const startTime = Date.now();
  const seasons = await kusonimeService.getSeasons();
  return successResponse(c, { seasons }, startTime);
});

kusonimeRoutes.get("/seasons/:season", async (c) => {
  const startTime = Date.now();
  const season = c.req.param("season");
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.getAnimeBySeason(season, page);
  return successResponse(c, data, startTime);
});

kusonimeRoutes.get("/search", async (c) => {
  const startTime = Date.now();
  const query = c.req.query("q") || "";
  const page = parseInt(c.req.query("page") || "1");
  const data = await kusonimeService.search(query, page);
  return successResponse(c, data, startTime);
});
