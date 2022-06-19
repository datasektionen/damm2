import express from "express";
import { changeBagLocation, changeBagName, createBag, createBox, getAllBags, getAllBoxes, putPatchInBag, changeBoxName, deleteBag, deleteBox } from "../functions/api/storage";
import { StatusCodes } from "http-status-codes";
import { adminPrylisAuth, authorizePls, validationCheck } from "../common/middlewares";
import { body } from "express-validator";

const router = express.Router();

// All routes here require admin access
// router.use(authorizePls);
// router.use(adminPrylisAuth);

// Get all boxes
router.get("/box/all",
    async (req, res) => {
        const { includePatches } = req.query;
        const doIncludePatches = includePatches === "true";
        const boxes = await getAllBoxes({ includePatches: doIncludePatches });
        res.status(StatusCodes.OK).json(boxes);
    }
);

// Create a box
router.post("/box/create",
    body("name").isString().trim().notEmpty().withMessage("should be a string"),
    validationCheck,
    async (req, res) => {
        const { name } = req.body;

        const box = await createBox(name);
        return res.status(box.statusCode).json(box);
    }
);

// Change bag name
router.put("/box/name",
    body("name").isString().trim().notEmpty().withMessage("should be a string"),
    body("boxId").isInt().notEmpty().withMessage("should be an integer"),
    validationCheck,
    async (req, res) => {
        const { boxId, name } = req.body;
        const result = await changeBoxName(boxId, name);
        return res.status(result.statusCode).json(result);
    },
);

// Get all bags
router.get("/bag/all",
    validationCheck,
    async (req, res) => {
        const { includePatches } = req.query;
        const doIncludePatches = (includePatches ?? "true") === "true";
        const bags = await getAllBags({ includePatches: doIncludePatches });
        res.status(StatusCodes.OK).json(bags);
    }
);

// Create a bag
router.post("/bag/create",
    body("name").isString().trim().notEmpty().withMessage("should be a string"),
    body("boxId").isInt().notEmpty().withMessage("should be an integer"),
    validationCheck,
    async (req, res) => {
        const { name, boxId } = req.body;

        const bag = await createBag(name, boxId);
        return res.status(bag.statusCode).json(bag);
    }
);

// Change bag name
router.put("/bag/name",
    body("name").isString().trim().notEmpty().withMessage("should be a string"),
    body("bagId").isInt().notEmpty().withMessage("should be an integer"),
    validationCheck,
    async (req, res) => {
        const { bagId, name } = req.body;
        const result = await changeBagName(bagId, name);
        return res.status(result.statusCode).json(result);
    },
);

// Move bag to a box
router.put("/bag/box",
    body("bagId").isInt().notEmpty().withMessage("should be an integer"),
    body("boxId").isInt().notEmpty().withMessage("should be an integer"),
    validationCheck,
    async (req, res) => {
        const { bagId, boxId } = req.body;
        const result = await changeBagLocation(bagId, boxId);
        return res.status(result.statusCode).json(result);
    },
);

// Assign patch to bag
router.put("/bag/patch",
    // If bagId is null, we unassign the patch from a bag, hence it is allowed
    body("patchId").isInt().notEmpty().withMessage("should be an integer"),
    validationCheck,
    async (req, res) => {
        const { bagId, patchId } = req.body;
        const result = await putPatchInBag(patchId, bagId);
        return res.status(result.statusCode).json(result);
    },
);

// Delete a bag
router.delete("/bag/:bagId",
    validationCheck,
    async (req, res) => {
        const { bagId } = req.params;
        const result = await deleteBag(parseInt(bagId));
        return res.status(result.statusCode).json(result);
    },
);

// Delete a box
router.delete("/box/:boxId",
    validationCheck,
    async (req, res) => {
        const { boxId } = req.params;
        const result = await deleteBox(parseInt(boxId));
        return res.status(result.statusCode).json(result);
    },
);

export default router;