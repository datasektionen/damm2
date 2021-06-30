import { adminAuth, authorizePls, validationCheck } from '../common/middlewares';
import express from 'express';
import { body, check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import { getAll, create, update } from '../functions/api/artefacts';
import { DATE_FORMAT } from '../common/patterns';

router.get("/all", async (req, res) => {
    const artefacts = await getAll();
    return res.status(StatusCodes.OK).json(artefacts);
});

router.post("/create",
    authorizePls,
    adminAuth,
    body("name").isString().trim().notEmpty().withMessage("should be a non-empty string"),
    body("description").isString().trim().optional().withMessage("should be a string"),
    body("date").matches(DATE_FORMAT).optional().withMessage("should be a date with format YYYY-MM-DD"),
    body("tags").isArray().optional().withMessage("should be an array"),
    // array items should be an integer and NOT a string that is an integer
    check("tags.*").isInt().not().isString().withMessage("should be an integer"),
    validationCheck,
async (req, res) => {
    const { name, description, date, tags } = req.body;

    const patch = await create(name, description, date, tags);
    return res.status(patch.statusCode).json(patch);
});

router.put("/update",
    authorizePls,
    adminAuth,
    body("id").isInt().not().isString().withMessage("should be an integer"),
    body("name").isString().trim().notEmpty().optional().withMessage("should be a non-empty string"),
    body("description").isString().trim().optional().withMessage("should be a string"),
    body("date").matches(DATE_FORMAT).optional().withMessage("should be a date with format YYYY-MM-DD"),
    body("tags").isArray().optional().withMessage("should be an array"),
    // array items should be an integer and NOT a string that is an integer
    check("tags.*").isInt().not().isString().withMessage("should be an integer"),
    validationCheck,
async (req, res) => {
    const { id, name, description, date, tags } = req.body;

    const patch = await update(id, name, description, date, tags);
    return res.status(patch.statusCode).json(patch);
});



export default router;