import {
  adminPrylisAuth,
  authorizeHive,
  silentAuthorization,
  validationCheck,
} from "../common/middlewares";
import { IUserRequest } from "../common/requests";
import { getAll, create, update, deleteTag } from "../functions/api/tags";
import { TagType } from "@prisma/client";
import express from "express";
import { body, matchedData, param, query } from "express-validator";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get(
  "/all",
  silentAuthorization,
  query("type")
    .optional()
    .isIn(Object.values(TagType))
    .withMessage("should be either 'PATCH' or 'ARTEFACT'"),
  validationCheck,
  async (req: IUserRequest, res) => {
    const { type } = matchedData<{ type?: TagType }>(req);
    const tags = await getAll(req.user, type);

    return res.status(StatusCodes.OK).json(tags);
  },
);

const tagValidators = [
  body("name").trim().isString().notEmpty().withMessage("should be a string"),
  body("description")
    .trim()
    .isString()
    .optional()
    .withMessage("should be a string"),
  body("color")
    .isHexColor()
    .optional()
    .withMessage("should be a hexadecimal color"),
  body("backgroundColor")
    .isHexColor()
    .optional()
    .withMessage("should be a hexadecimal color"),
  validationCheck,
];

router.post(
  "/create",
  authorizeHive,
  adminPrylisAuth,
  body("parent")
    .optional()
    .isInt()
    .not()
    .isString()
    .withMessage("should be an integer"),
  body("type")
    .isString()
    .trim()
    .isIn(Object.values(TagType))
    .withMessage("should be either 'PATCH' or 'ARTEFACT'"),
  body("category").isString().withMessage("should be a string"),
  ...tagValidators,
  async (req, res) => {
    const { name, description, color, backgroundColor, type, category } =
      req.body;

    const patch = await create(
      name,
      description,
      color,
      backgroundColor,
      type,
      category,
    );
    return res.status(patch.statusCode).json(patch);
  },
);

router.put(
  "/update",
  authorizeHive,
  adminPrylisAuth,
  body("id").isInt().not().isString().withMessage("should be an integer"),
  ...tagValidators,
  async (req, res) => {
    const { id, name, description, color, backgroundColor, category } =
      req.body;
    const patch = await update(
      id,
      name,
      description,
      color,
      backgroundColor,
      category,
    );
    return res.status(patch.statusCode).json(patch);
  },
);

router.delete(
  "/:id",
  authorizeHive,
  adminPrylisAuth,
  param("id").isInt().withMessage("should be an integer"),
  validationCheck,
  async (req, res) => {
    const id = Number(req.params.id);
    const result = await deleteTag(id);
    return res.status(result.statusCode).json(result);
  },
);

export default router;
