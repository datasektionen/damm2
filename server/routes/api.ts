import express from 'express';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

import { ping } from '../functions/api/ping';
import patchesRouter from './patches';
import tagsRouter from './tags';
import filesRouter from './files';

router.use("/patches", patchesRouter);
router.use("/tags", tagsRouter);
router.use("/files", filesRouter);

router.get("/ping", (req, res) => {
    res.json(ping());
});

router.get("*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        body: "Invalid API path"
    });
});

export default router;
