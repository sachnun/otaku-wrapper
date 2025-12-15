import * as cheerio from "cheerio";

export const DEFAULT_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

export interface FetchOptions {
  headers?: HeadersInit;
  referer?: string;
  method?: "GET" | "POST";
  body?: string;
}

export async function fetchHtml(
  url: string,
  options?: FetchOptions
): Promise<cheerio.CheerioAPI> {
  const headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    ...options?.headers,
  };

  if (options?.referer) {
    (headers as Record<string, string>)["Referer"] = options.referer;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  return cheerio.load(html);
}

export async function fetchText(
  url: string,
  options?: FetchOptions
): Promise<string> {
  const headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    ...options?.headers,
  };

  if (options?.referer) {
    (headers as Record<string, string>)["Referer"] = options.referer;
  }

  const response = await fetch(url, {
    method: options?.method || "GET",
    headers,
    body: options?.body,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

export async function fetchJson<T>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    Accept: "application/json",
    ...options?.headers,
  };

  if (options?.referer) {
    (headers as Record<string, string>)["Referer"] = options.referer;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

export { cheerio };
