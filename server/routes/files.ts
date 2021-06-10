import ApiResponse from '../common/ApiResponse';
import { adminPrylisAuth, authorizePls, validationCheck } from '../common/middlewares';
import express from 'express';
import { body, check, param, query } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import multer from 'multer';
import { uploadPatchImage, attachImageToPatch, uploadPatchFile, attachFileToPatch, getPatchFile, deletePatchFile, deleteFileFromPatch } from '../functions/api/files';
import prisma from '../common/client';

const imageUpload = multer({
    fileFilter: (req, file, callback) => {
        // Only checks extension, so it's possible to fool this...
        const validFileType = file.mimetype === "image/jpeg" || file.mimetype === "image/png";
        if (!validFileType) {
            return callback(null, false);
        }
        
        return callback(null, true);
    },
});

const fileUpload = multer({
    fileFilter: (req, file, callback) => {
        if (file.size > 1024*1024*10) {
            return callback(null, false);
        }
        
        return callback(null, true);
    },
});

const hasImage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response: ApiResponse = {
        statusCode: StatusCodes.BAD_REQUEST,
        body: "No image provided."
    };

    if (!req.file) return res.status(response.statusCode).json(response);
    next();
};

const hasFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response: ApiResponse = {
        statusCode: StatusCodes.BAD_REQUEST,
        body: "No file provided."
    };

    if (!req.file) return res.status(response.statusCode).json(response);
    next();
};

// Uploads images (image for a patch)
router.post("/upload/patch-image",
    authorizePls,
    adminPrylisAuth,
    imageUpload.single("image"),
    hasImage,
async (req, res) => {
    
    const result = await uploadPatchImage(req.file);
    return res.status(result.statusCode).json(result);
});

router.post("/attach/img-to-patch",
    authorizePls,
    adminPrylisAuth,
    body("patchId").isInt().not().isString().withMessage("should be an integer"),
    body("images").isArray().optional().withMessage("should be an array"),
    check("images.*").isURL().withMessage("should be an image url"),
    validationCheck,
async (req, res) => {
    const { patchId, images } = req.body;

    const result = await attachImageToPatch(patchId, images);

    return res.status(result.statusCode).json(result);
});

// Uploads files (for a patch)
router.post("/upload/patch-file",
    authorizePls,
    adminPrylisAuth,
    fileUpload.single("file"),
    hasFile,
async (req, res) => {
    const result = await uploadPatchFile(req.file);
    return res.status(result.statusCode).json(result);
});

router.post("/attach/file-to-patch",
    authorizePls,
    adminPrylisAuth,
    body("patchId").isInt().not().isString().withMessage("should be an integer"),
    body("file").trim().isString().notEmpty().withMessage("should be an URL"),
    validationCheck,
async (req, res) => {
    const { patchId, file } = req.body;

    const result = await attachFileToPatch(patchId, file);

    return res.status(result.statusCode).json(result);
});

router.get("/get/:name",
    authorizePls,
    adminPrylisAuth,
async (req, res) => {

    const { name } = req.params;

    getPatchFile(name)
    .then((result: any) => {
        res.status(200).send(result);
    })
    .catch(err => {
        return res.status(StatusCodes.NOT_FOUND).json({
            statusCode: StatusCodes.NOT_FOUND,
        });
    });
});

router.delete("/patch-file",
    authorizePls,
    adminPrylisAuth,
    query("name").isString().trim().notEmpty().withMessage("should be a string"),
    query("patchId").isInt().withMessage("should be a string"),
    validationCheck,
async (req, res) => {
    const { name, patchId } = req.query;
    console.log(req.query)

    deletePatchFile(name as string)
    .then(async response => {
        await deleteFileFromPatch(Number(patchId as string), name as string);
        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
        })
    })
    .catch(err => {
        res.status(StatusCodes.NOT_FOUND).json({
            statusCode: StatusCodes.NOT_FOUND
        })
        return;
    })
})

export default router;