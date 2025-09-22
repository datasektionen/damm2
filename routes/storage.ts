import prisma from "../common/client";
import {
  adminPrylisAuth,
  authorizeHive,
  validationCheck,
} from "../common/middlewares";
import {
  changeBagLocation,
  changeBagName,
  createBag,
  createBox,
  getAllBags,
  getAllBoxes,
  putPatchInBag,
  changeBoxName,
  deleteBag,
  deleteBox,
  deleteBags,
  deleteBoxes,
  changeMultipleBagsLocation,
  updateManyPatches,
} from "../functions/api/storage";
import express from "express";
import { body, check } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { parse as json2csv } from "json2csv";

const router = express.Router();

// All routes here require admin access
router.use(authorizeHive);
router.use(adminPrylisAuth);

// Get all boxes
router.get("/box/all", async (req, res) => {
  const { includePatches } = req.query;
  const doIncludePatches = includePatches === "true";
  const boxes = await getAllBoxes({ includePatches: doIncludePatches });
  res.status(StatusCodes.OK).json(boxes);
});

// Create a box
router.post(
  "/box/create",
  body("name").isString().trim().notEmpty().withMessage("should be a string"),
  validationCheck,
  async (req, res) => {
    const { name } = req.body;

    const box = await createBox(name);
    return res.status(box.statusCode).json(box);
  }
);

// Change bag name
router.put(
  "/box/name",
  body("name").isString().trim().notEmpty().withMessage("should be a string"),
  body("boxId").isInt().notEmpty().withMessage("should be an integer"),
  validationCheck,
  async (req, res) => {
    const { boxId, name } = req.body;
    const result = await changeBoxName(boxId, name);
    return res.status(result.statusCode).json(result);
  }
);

// Get all bags
router.get("/bag/all", validationCheck, async (req, res) => {
  const { includePatches } = req.query;
  const doIncludePatches = (includePatches ?? "true") === "true";
  const bags = await getAllBags({ includePatches: doIncludePatches });
  res.status(StatusCodes.OK).json(bags);
});

// Create a bag
router.post(
  "/bag/create",
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
router.put(
  "/bag/name",
  body("name").isString().trim().notEmpty().withMessage("should be a string"),
  body("bagId").isInt().notEmpty().withMessage("should be an integer"),
  validationCheck,
  async (req, res) => {
    const { bagId, name } = req.body;
    const result = await changeBagName(bagId, name);
    return res.status(result.statusCode).json(result);
  }
);

// Move bag to a box
router.put(
  "/bag/box",
  body("bagId").isInt().notEmpty().withMessage("should be an integer"),
  body("boxId").isInt().notEmpty().withMessage("should be an integer"),
  validationCheck,
  async (req, res) => {
    const { bagId, boxId } = req.body;
    const result = await changeBagLocation(bagId, boxId);
    return res.status(result.statusCode).json(result);
  }
);

// Assign patch to bag
router.put(
  "/bag/patch",
  // If bagId is null, we unassign the patch from a bag, hence it is allowed
  body("patchId").isInt().notEmpty().withMessage("should be an integer"),
  validationCheck,
  async (req, res) => {
    const { bagId, patchId } = req.body;
    const result = await putPatchInBag(patchId, bagId);
    return res.status(result.statusCode).json(result);
  }
);

// Delete a bag
router.delete("/bag/:bagId", validationCheck, async (req, res) => {
  const { bagId } = req.params;
  const result = await deleteBag(parseInt(bagId));
  return res.status(result.statusCode).json(result);
});

// Delete a box
router.delete("/box/:boxId", validationCheck, async (req, res) => {
  const { boxId } = req.params;
  const result = await deleteBox(parseInt(boxId));
  return res.status(result.statusCode).json(result);
});

router.post(
  "/bags/delete",
  body("bags").isArray({ min: 1 }).withMessage("should be an array"),
  check("bags.*").isInt().withMessage("array should contain integers"),
  validationCheck,
  async (req, res) => {
    const { bags } = req.body;
    const result = await deleteBags(bags);
    return res.status(result.statusCode).json(result);
  }
);

router.post(
  "/boxes/delete",
  body("boxes").isArray({ min: 1 }).withMessage("should be an array"),
  check("boxes.*").isInt().withMessage("array should contain integers"),
  validationCheck,
  async (req, res) => {
    const { boxes } = req.body;
    const result = await deleteBoxes(boxes);
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/bags/box",
  body("boxId").isInt().withMessage("should be an integer"),
  body("bags").isArray({ min: 1 }).withMessage("should be an array"),
  check("bags.*").isInt().withMessage("array should contain integers"),
  validationCheck,
  async (req, res) => {
    const { bags, boxId } = req.body;
    const result = await changeMultipleBagsLocation(bags, boxId);
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/patches/bag",
  body("bagId").isInt().withMessage("should be an integer"),
  body("patches").isArray({ min: 1 }).withMessage("should be an array"),
  check("patches.*").isInt().withMessage("array should contain integers"),
  validationCheck,
  async (req, res) => {
    const { bagId, patches: patchesStrings } = req.body;
    const patches = patchesStrings.map((x: string) => parseInt(x, 10));
    const result = await updateManyPatches({ patchIds: patches, bagId });
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/patches/amount",
  body("amount").isInt({ min: 0 }).withMessage("should be an integer"),
  body("patches").isArray({ min: 1 }).withMessage("should be an array"),
  check("patches.*").isInt().withMessage("array should contain integers"),
  validationCheck,
  async (req, res) => {
    const { amount, patches } = req.body;
    const result = await updateManyPatches({
      patchIds: patches.map((x: string) => parseInt(x, 10)),
      amount,
    });
    return res.status(result.statusCode).json(result);
  }
);

router.get("/export", async (req, res) => {
  const fields = [
    "id",
    "name",
    "description",
    "date",
    "createdAt",
    "updatedAt",
    "creators",
    "images",
    "files",
    "bagId",
    "boxId",
    "bagName",
    "boxName",
    "amount",
    "tags",
  ];
  const patches = await prisma.patch.findMany({
    include: { bag: { include: { box: true } }, tags: true, createdBy: {
      include: {
        person: true,
      },
    }, },
  });
  const data = json2csv(
    patches.map((p) => ({
      ...p,
      creators: p.createdBy.map((t) =>(t.person.name)).join(", "),
      bagName: p.bag?.name ?? "Ingen påse",
      tags: p.tags.map((t) => ({ name: t.name, type: t.type })),
      boxId: p.bag?.box?.id ?? null,
      boxName: p.bag?.box?.name ?? "Ingen låda",
    })),
    { fields }
  );
  res.setHeader("Content-Type", "text/csv");
  res.send(data);
});

export default router;
