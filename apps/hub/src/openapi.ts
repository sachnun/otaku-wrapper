import { openApiSpec as kusonimeOpenApiSpec } from "../../api/kusonime/src/openapi";
import { openApiSpec as otakudesuOpenApiSpec } from "../../api/otakudesu/src/openapi";
import { softkomikOpenApiSpec } from "../../api/softkomik/src/openapi";

function prefixPaths(
  paths: Record<string, any>,
  prefix: string
): Record<string, any> {
  const prefixed: Record<string, any> = {};
  for (const [path, value] of Object.entries(paths)) {
    const normalizedPath = path.startsWith("/api/")
      ? path.slice(4)
      : path.startsWith("/api")
        ? path.slice(4) || "/"
        : path.startsWith("/")
          ? path
          : `/${path}`;
    prefixed[`/api/${prefix}${normalizedPath}`] = value;
  }
  return prefixed;
}

function setPathTags(
  paths: Record<string, any>,
  tag: string
): Record<string, any> {
  const updated: Record<string, any> = {};
  for (const [path, methods] of Object.entries(paths)) {
    updated[path] = {};
    for (const [method, spec] of Object.entries(methods as Record<string, any>)) {
      updated[path][method] = {
        ...spec,
        tags: [tag],
      };
    }
  }
  return updated;
}

function prefixSchemas(
  schemas: Record<string, any>,
  prefix: string
): Record<string, any> {
  const prefixed: Record<string, any> = {};
  for (const [name, schema] of Object.entries(schemas)) {
    prefixed[`${prefix}_${name}`] = schema;
  }
  return prefixed;
}

function updateSchemaRefs(obj: any, prefix: string): any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((item) => updateSchemaRefs(item, prefix));

  const updated: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "$ref" && typeof value === "string") {
      const match = value.match(/#\/components\/schemas\/(.+)/);
      if (match) {
        updated[key] = `#/components/schemas/${prefix}_${match[1]}`;
      } else {
        updated[key] = value;
      }
    } else {
      updated[key] = updateSchemaRefs(value, prefix);
    }
  }
  return updated;
}

export function createOpenApiSpec() {
  const kusonimePaths = updateSchemaRefs(
    setPathTags(prefixPaths(kusonimeOpenApiSpec.paths, "kusonime"), "Kusonime"),
    "Kusonime"
  );

  const meioPaths = updateSchemaRefs(
    setPathTags(
      prefixPaths(
        {
          "/novels": { get: { tags: ["Novels"], summary: "List all novels" } },
          "/novels/latest": { get: { tags: ["Novels"], summary: "Get latest updated novels" } },
          "/novels/search": { get: { tags: ["Novels"], summary: "Search novels" } },
          "/novels/{slug}": { get: { tags: ["Novels"], summary: "Get novel detail" } },
          "/novels/{slug}/chapters": { get: { tags: ["Chapters"], summary: "Get chapter list" } },
          "/novels/{slug}/{chapter}": { get: { tags: ["Chapters"], summary: "Read chapter content" } },
          "/genres": { get: { tags: ["Genres"], summary: "List all genres" } },
          "/genres/{genre}": { get: { tags: ["Genres"], summary: "Get novels by genre" } },
        },
        "meio"
      ),
      "Meio"
    ),
    "Meio"
  );

  const otakudesuPaths = updateSchemaRefs(
    setPathTags(prefixPaths(otakudesuOpenApiSpec.paths, "otakudesu"), "Otakudesu"),
    "Otakudesu"
  );

  const softkomikPaths = updateSchemaRefs(
    setPathTags(prefixPaths(softkomikOpenApiSpec.paths, "softkomik"), "Softkomik"),
    "Softkomik"
  );

  return {
    openapi: "3.0.3",
    info: {
      title: "Otaku Hub API",
      description:
        "Unified API gateway for anime, manga, and novel content. Combines multiple scrapers into a single endpoint.",
      version: "1.0.0",
    },
    tags: [
      { name: "Kusonime", description: "Anime batch downloads from kusonime.com" },
      { name: "Meio", description: "Light novels from meionovels.com" },
      { name: "Otakudesu", description: "Anime streaming from otakudesu.cloud" },
      { name: "Softkomik", description: "Manga/manhwa/manhua from softkomik.com" },
    ],
    paths: {
      ...kusonimePaths,
      ...meioPaths,
      ...otakudesuPaths,
      ...softkomikPaths,
    },
    components: {
      schemas: {
        ...prefixSchemas(kusonimeOpenApiSpec.components?.schemas || {}, "Kusonime"),
        ...prefixSchemas(otakudesuOpenApiSpec.components?.schemas || {}, "Otakudesu"),
        ...prefixSchemas(softkomikOpenApiSpec.components?.schemas || {}, "Softkomik"),
      },
      parameters: {
        ...kusonimeOpenApiSpec.components?.parameters,
        ...otakudesuOpenApiSpec.components?.parameters,
      },
      responses: {
        ...kusonimeOpenApiSpec.components?.responses,
        ...otakudesuOpenApiSpec.components?.responses,
      },
    },
  };
}
