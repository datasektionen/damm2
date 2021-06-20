import { adminPrylisAuth, authorizePls, silentAuthorization, validationCheck } from '../common/middlewares';
import express from 'express';
import { IUserRequest } from '../common/requests';
import { body, check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import { getAllPatches, create, update } from '../functions/api/patches';
import { DATE_FORMAT } from '../common/patterns';

router.get("/all",
    silentAuthorization,
async (req: IUserRequest, res) => {
    const patches = await getAllPatches(req.user);
    return res.status(StatusCodes.OK).json(patches);
});

router.post("/create",
    authorizePls,
    adminPrylisAuth,
    body("name").trim().isString().notEmpty().withMessage("should be a string"),
    body("description").trim().isString().optional().withMessage("should be a string"),
    body("date").matches(DATE_FORMAT).optional().withMessage("should be a date with format YYYY-MM-DD"),
    body("tags").isArray().optional().withMessage("should be an array"),
    // array items should be an integer and NOT a string that is an integer
    check("tags.*").isInt().not().isString().withMessage("should be an integer"),
    body("creators").isArray().optional().withMessage("should be an array"),
    check("creators.*").isString().trim().notEmpty().withMessage("should be a string"),
    validationCheck,
async (req, res) => {
    const { name, description, date, tags, creators } = req.body;

    const patch = await create(name, description, date, creators, tags);
    return res.status(patch.statusCode).json(patch);
});

router.put("/update",
    authorizePls,
    adminPrylisAuth,
    body("patchId").isInt().not().isString().withMessage("should be an integer"),
    body("name").trim().isString().notEmpty().optional().withMessage("should be a string"),
    body("description").trim().isString().optional().withMessage("should be a string"),
    body("date").matches(DATE_FORMAT).optional().withMessage("should be a date with format YYYY-MM-DD"),
    body("tags").isArray().optional().withMessage("should be an array"),
    // array items should be an integer and NOT a string that is an integer
    check("tags.*").isInt().not().isString().withMessage("should be an integer"),
    body("creators").isArray().optional().withMessage("should be an array"),
    check("creators.*").isString().trim().notEmpty().withMessage("should be a string"),
    validationCheck,
async (req, res) => {
    const { patchId, name, date, description, tags, creators, files } = req.body;

    const result = await update(patchId, { name, date, description, tags, creators, files });
    return res.status(result.statusCode).json(result);
});

export default router;