import ApiResponse from '../common/ApiResponse';
import { adminAuth, adminPrylisAuth, authorizePls, validationCheck } from '../common/middlewares';
import express from 'express';
import { body, check, query } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import multer from 'multer';
import { uploadImage, attachImageTo, uploadFile, attachFileTo, getFile, deleteFileFrom, deleteFile } from '../functions/api/files';
import { FOLDER_PATH } from '../common/patterns';

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


// Uploads images (image for a patch or artefact)
router.post("/upload/image",
    authorizePls,
    adminPrylisAuth,
    imageUpload.single("image"),
    // Should not end with /
    query("path").matches(FOLDER_PATH),
    validationCheck,
    hasImage,
async (req, res) => {
    const { path } = req.query;

    const result = await uploadImage(req.file, path as string);
    return res.status(result.statusCode).json(result);
});

router.post("/attach/img-to",
    authorizePls,
    adminAuth,
    body("id").isInt().not().isString().withMessage("should be an integer"),
    body("images").isArray().optional().withMessage("should be an array"),
    check("images.*").isURL().withMessage("should be an image url"),
    body("type").matches(new RegExp(/^(patch)|(artefact)$/)),
    validationCheck,
async (req, res) => {
    const { id, images, type } = req.body;

    const result = await attachImageTo(id, images, type);

    return res.status(result.statusCode).json(result);
});

// Uploads files
router.post("/upload/file",
    authorizePls,
    adminPrylisAuth,
    fileUpload.single("file"),
    // Should not end with /
    query("path").matches(FOLDER_PATH),
    validationCheck,
    hasFile,
async (req, res) => {
    const { path } = req.query;
    
    const result = await uploadFile(req.file, path as string);
    return res.status(result.statusCode).json(result);
});

router.post("/attach/file-to",
    authorizePls,
    adminAuth,
    body("id").isInt().not().isString().withMessage("should be an integer"),
    body("file").trim().isString().notEmpty().withMessage("should be an URL"),
    body("type").matches(new RegExp(/^(patch)|(artefact)$/)).withMessage("should be either 'patch' or 'artefact'"),
    validationCheck,
async (req, res) => {
    const { id, file, type } = req.body;

    const result = await attachFileTo(id, file, type);

    return res.status(result.statusCode).json(result);
});

router.get("/get/:name",
    authorizePls,
    adminPrylisAuth,
async (req, res) => {

    const { name } = req.params;

    getFile(name)
    .then((result: any) => {
        res.status(200).send(result);
    })
    .catch(() => {
        return res.status(StatusCodes.NOT_FOUND).json({
            statusCode: StatusCodes.NOT_FOUND,
        });
    });
});

router.delete("/file",
    authorizePls,
    adminPrylisAuth,
    query("name").isString().trim().notEmpty().withMessage("should be a string"),
    query("id").isInt().withMessage("should be an integer"),
    query("type").matches(new RegExp(/^(patch)|(artefact)$/)).withMessage("should be either 'patch' or 'artefact'"),
    validationCheck,
async (req, res) => {
    const { name, id, type } = req.query;

    deleteFile(name as string)
    .then(async () => {
        await deleteFileFrom(Number(id as string), name as string, type as any);
        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
        });
    })
    .catch(() => {
        res.status(StatusCodes.NOT_FOUND).json({
            statusCode: StatusCodes.NOT_FOUND
        });
        return;
    });
});

export default router;