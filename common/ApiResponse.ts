import express from "express";
import { StatusCodes } from "http-status-codes";
export interface ApiResponse<T = unknown> {
  statusCode: number;
  body?: T;
  error?: unknown;
}

export const errorResponse = (
  res: express.Response,
  statusCode: number,
  error: unknown,
): void => {
  const response: ApiResponse = {
    statusCode,
    error,
  };

  res.status(statusCode).json(response);
  return;
};

export const unauthorizedResponse = (res: express.Response): void => {
  const response: ApiResponse = {
    statusCode: StatusCodes.UNAUTHORIZED,
    body: "Unauthorized.",
  };

  res.status(StatusCodes.UNAUTHORIZED).send(response);
};

export default ApiResponse;
