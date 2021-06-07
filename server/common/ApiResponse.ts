import express from 'express';
import { StatusCodes } from 'http-status-codes';
export interface ApiResponse {
    statusCode: number;
    body?: any;
    error?: any;
}

export const errorResponse = (res: express.Response, statusCode: number, error: any): void => {
    const response: ApiResponse = {
        statusCode,
        error
    };

    res.status(statusCode).json(response);
    return;
};

export const unauthorizedResponse = (res: express.Response): void => {
    const response: ApiResponse = {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: "Unauthorized."
    };

    res.status(StatusCodes.UNAUTHORIZED).send(response);
};


export default ApiResponse;