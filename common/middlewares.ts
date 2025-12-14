import express from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, unauthorizedResponse } from './ApiResponse';
import axios from 'axios';
import configuration from './configuration';
import { IUserRequest } from './requests';

/**
 * Middleware that checks if there are any validation errors, if there are, it
 * sends 400 Bad Request. Otherwise it calls the next function in the chain.
 * @param req the request object
 * @param res the response object
 * @param next next function
 */
export const validationCheck = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorResponse(res, StatusCodes.BAD_REQUEST, errors.array());
        return;
    }
    next();
};

// Authorizes against hive.
// Takes token either in Authorization header or as a query string
export const authorizeHive = async (req: IUserRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.session.user === undefined) {
        unauthorizedResponse(res);
        return;
    } else {
        const user = req.session.user;

        req.user = user;

        next();
    }
};

export const adminAuth = async (req: IUserRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.user?.admin.includes("admin")) return next();

    unauthorizedResponse(res);
};

export const prylisAuth = async (req: IUserRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.user?.admin.includes("prylis")) return next();

    unauthorizedResponse(res);
};

export const adminPrylisAuth = async (req: IUserRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.user?.admin.includes("admin") || req.user?.admin.includes("prylis")) return next();

    unauthorizedResponse(res);
};

// Checks authorization but does not reject.
// Takes token either in Authorization header or as a query string
export const silentAuthorization = async (req: IUserRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.session.user === undefined) {
        next();
        return;
    } else {
        const user = req.session.user;

        req.user = user;
        next();
    }
};
