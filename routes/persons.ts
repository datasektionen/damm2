import express from "express";
import { body, check } from "express-validator";
import { adminPrylisAuth, authorizeHive, validationCheck } from "../common/middlewares";
import { createPerson, deletePersons, getPersons } from "../functions/api/persons";

const router = express.Router();

router.use(authorizeHive);
router.use(adminPrylisAuth);

router.get("/all",
    async (_, res) => {
        const result = await getPersons();
        return res.status(result.statusCode).json(result);
    }
);

router.post("/person",
    body("name").isString().trim().notEmpty().withMessage("name is required"),
    validationCheck,
    async (req, res) => {
        const { name } = req.body;

        const result = await createPerson(name);
        return res.status(result.statusCode).json(result);
    }
);

router.post("/delete",
    body("ids").isArray().withMessage("should be an array"),
    check("ids.*").isInt().withMessage("should be an integer"),
    validationCheck,
    async (req, res) => {
        const { ids } = req.body;
        console.log(req.body);

        const result = await deletePersons(ids);
        return res.status(result.statusCode).json(result);
    }
);

export default router;
