import express from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, unauthorizedResponse } from './ApiResponse';
import axios from 'axios';
import configuration from './configuration';
import { IUserRequest } from './requests';

type hivePermission = {
    id: string,
    scope?: string
}

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
    const authorizationHeader = req.headers.authorization;
    let token;
    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token || token.length === 0) {
        unauthorizedResponse(res);
        return;
    }

    try {
        const response = await axios.get(`${configuration.LOGIN_API_URL}/verify/${token}.json?api_key=${configuration.LOGIN_API_KEY}`);
        if (response.status !== StatusCodes.OK) {
            unauthorizedResponse(res);
            return;
        }

        const user = response.data;

        const config = {
            headers: { Authorization: `Bearer ${configuration.HIVE_API_KEY}` }
        };

        const hiveResponse = await axios.get<hivePermission[]>(`${configuration.HIVE_API_URL}/user/${user.user}/permissions`, config);
        const permissions = [];
        for (const perm of hiveResponse.data) {
            permissions.push(perm.id)
        }
        req.user = { ...user, admin: permissions };

        next();
    } catch (err) {
        unauthorizedResponse(res);
        return;
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
    const authorizationHeader = req.headers.authorization;
    let token;
    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token || token.length === 0) {
        next();
        return;
    }

    try {
        const response = await axios.get(`${configuration.LOGIN_API_URL}/verify/${token}.json?api_key=${configuration.LOGIN_API_KEY}`);
        if (response.status !== StatusCodes.OK) {
            next();
            return;
        }

        const user = response.data;

        const config = {
            headers: { Authorization: `Bearer ${configuration.HIVE_API_KEY}` }
        };

        const hiveResponse = await axios.get<hivePermission[]>(`${configuration.HIVE_API_URL}/user/${user.user}/permissions`, config);
        const permissions = [];
        for (const perm of hiveResponse.data) {
            permissions.push(perm.id)
        }
        req.user = { ...user, admin: permissions };

        next();
    } catch (err) {
        console.log(err)
        next();
    }
};
