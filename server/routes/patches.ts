import { adminPrylisAuth, authorizePls, validationCheck } from '../common/middlewares';
import express from 'express';
import { body, check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import { getAllPatches, create } from '../functions/api/patches';

router.get("/all", async (req, res) => {
    const patches = await getAllPatches();
    return res.status(StatusCodes.OK).json(patches);
});

router.post("/create",
    authorizePls,
    adminPrylisAuth,
    body("name").trim().isString().notEmpty().withMessage("should be a string"),
    body("description").trim().isString().optional().withMessage("should be a string"),
    body("date").notEmpty().isString().optional().withMessage("should be a date"),
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
    body("patchId").isInt().not().isString().withMessage("should be an integer"),
    validationCheck,
async (req, res) => {

})

export default router;