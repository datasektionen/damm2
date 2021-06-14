import { adminPrylisAuth, authorizePls, validationCheck } from '../common/middlewares';
import express from 'express';
import { body, param } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import { getAll, create, update, deleteTag } from '../functions/api/tags';

router.get("/all", async (req, res) => {
    const tags = await getAll();

    return res.status(StatusCodes.OK).json(tags);
});

const tagValidators = [
    body("name").trim().isString().notEmpty().withMessage("should be a string"),
    body("description").trim().isString().optional().withMessage("should be a string"),
    body("color").isHexColor().optional().withMessage("should be a hexadecimal color"),
    body("backgroundColor").isHexColor().optional().withMessage("should be a hexadecimal color"),
    validationCheck,
];

router.post("/create",
    authorizePls,
    adminPrylisAuth,
    body("parent").optional().isInt().not().isString().withMessage("should be an integer"),
    ...tagValidators,
async (req, res) => {
    const { name, description, color, backgroundColor, parent } = req.body;

    const patch = await create(name, description, color, backgroundColor, parent);
    return res.status(patch.statusCode).json(patch);
});

router.put("/update",
    authorizePls,
    adminPrylisAuth,
    body("id").isInt().not().isString().withMessage("should be an integer"),
    ...tagValidators,
async (req, res) => {
    const { id, name, description, color, backgroundColor } = req.body;
    const patch = await update(id, name, description, color, backgroundColor);
    return res.status(patch.statusCode).json(patch);
});

router.delete("/:id",
    authorizePls,
    adminPrylisAuth,
    param("id").isInt().withMessage("should be an integer"),
    validationCheck,
async (req, res) => {
    const id = Number(req.params.id);
    const result = await deleteTag(id);
    return res.status(result.statusCode).json(result);
});

export default router;