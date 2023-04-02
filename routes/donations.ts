import express from "express";
import { body, check, query } from "express-validator";
import {
  adminPrylisAuth,
  authorizePls,
  validationCheck,
} from "../common/middlewares";
import {
  createDonation,
  createPerson,
  deleteDonations,
  deletePersons,
  getDonations,
  getPersons,
} from "../functions/api/donations";

const router = express.Router();

router.use(authorizePls);
router.use(adminPrylisAuth);

router.get("/persons", async (_, res) => {
  const result = await getPersons();
  return res.status(result.statusCode).json(result);
});

router.post(
  "/person",
  body("name").isString().trim().notEmpty().withMessage("name is required"),
  validationCheck,
  async (req, res) => {
    const { name } = req.body;

    const result = await createPerson(name);
    return res.status(result.statusCode).json(result);
  }
);

router.post(
  "/persons/delete",
  body("ids").isArray().withMessage("should be an array"),
  check("ids.*").isInt().withMessage("should be an integer"),
  validationCheck,
  async (req, res) => {
    const { ids } = req.body;

    const result = await deletePersons(ids);
    return res.status(result.statusCode).json(result);
  }
);

router.post(
  "/",
  body("patchId").isInt().withMessage("should be an integer"),
  body("data").isArray().withMessage("should be an array"),
  check("data.personId").isInt().withMessage("should be an integer"),
  check("data.amount").isInt({ gt: 1 }).withMessage("should be an integer"),
  validationCheck,
  async (req, res) => {
    const { patchId, data } = req.body;

    const result = await createDonation(patchId, data);
    return res.status(result.statusCode).json(result);
  }
);

router.get(
  "/",
  query("patchId").isInt().optional().withMessage("should be an integer"),
  query("personId").isInt().optional().withMessage("should be an integer"),
  query().custom((_, { req }) => {
    if (!req.query?.patchId && !req.query?.personId) {
      throw new Error("patchId or personId is required");
    }
    return true;
  }),
  validationCheck,
  async (req, res) => {
    const { patchId, personId } = req.query;

    const asNumber = (value: string) => parseInt(value, 10);

    const result = await getDonations(
      patchId ? asNumber(patchId as string) : undefined,
      personId ? asNumber(personId as string) : undefined
    );

    return res.status(result.statusCode).json(result);
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await deleteDonations([parseInt(id, 10)]);
  return res.status(result.statusCode).json(result);
});

export default router;
