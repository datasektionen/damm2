import express from "express";
import { body, check } from "express-validator";
import { adminPrylisAuth, authorizePls, validationCheck } from "../common/middlewares";
import { createPerson, deletePersons, getPersons } from "../functions/api/donations";

const router = express.Router();

router.use(authorizePls);
router.use(adminPrylisAuth);

router.get("/persons",
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

router.post("/persons/delete",
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