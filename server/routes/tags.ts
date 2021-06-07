import { adminPrylisAuth, authorizePls, validationCheck } from '../common/middlewares';
import express from 'express';
import { body, check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import { getAll, create } from '../functions/api/tags';

router.get("/all", async (req, res) => {
    const tags = await getAll();

    return res.status(StatusCodes.OK).json(tags);
});

router.post("/create",
    authorizePls,
    adminPrylisAuth,
    body("name").trim().isString().notEmpty().withMessage("should be a string"),
    body("description").trim().isString().optional().withMessage("should be a string"),
    body("color").isHexColor().optional().withMessage("should be a hexadecimal color"),
    body("backgroundColor").isHexColor().optional().withMessage("should be a hexadecimal color"),
    body("children").isArray().optional().withMessage("should be an array"),
    // array items should be an integer and NOT a string that is an integer
    check("children.*").isInt().not().isString().withMessage("should be an integer"),
    validationCheck,
async (req, res) => {
    const { name, description, color, backgroundColor, children } = req.body;

    const patch = await create(name, description, color, backgroundColor, children);
    return res.status(patch.statusCode).json(patch);
});

export default router;