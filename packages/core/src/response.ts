import type { Context } from "hono";
import type { ApiResponse, ApiErrorResponse } from "./types";

export function successResponse<T>(
  c: Context,
  data: T,
  startTime: number
): Response {
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

export function errorResponse(
  c: Context,
  statusCode: number,
  message: string,
  code: string
): Response {
  const response: ApiErrorResponse = {
    success: false,
    statusCode,
    message,
    error: { code },
    timestamp: new Date().toISOString(),
    path: c.req.path,
  };

  return c.json(response, statusCode as any);
}

export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  UPSTREAM_ERROR: "UPSTREAM_ERROR",
  UPSTREAM_TIMEOUT: "UPSTREAM_TIMEOUT",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;
