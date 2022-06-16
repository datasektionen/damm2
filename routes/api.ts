import express from 'express';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

import { ping } from '../functions/api/ping';
import patchesRouter from './patches';
import tagsRouter from './tags';
import filesRouter from './files';
import eventsRouter from './events';
import artefactsRouter from './artefacts';
import storageRouter from './storage';
import { silentAuthorization } from '../common/middlewares';
import { IUserRequest } from '../common/requests';

router.use("/patches", patchesRouter);
router.use("/tags", tagsRouter);
router.use("/files", filesRouter);
router.use("/events", eventsRouter);
router.use("/artefacts", artefactsRouter);
router.use("/storage", storageRouter);

router.get("/ping", (req, res) => {
    res.json(ping());
});

router.get("/check-token",
    silentAuthorization,
async (req: IUserRequest, res) => {
    if (!req.user) return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
    });
    return res.status(StatusCodes.OK).json(req.user);
});

router.get("*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        body: "Invalid API path"
    });
});

export default router;
