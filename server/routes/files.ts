import ApiResponse from '../common/ApiResponse';
import { validationCheck } from '../common/middlewares';
import express from 'express';
import { body, check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
import multer from 'multer';
import { uploadPatchImage, attachToPatch } from '../functions/api/files';

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

const hasImage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response: ApiResponse = {
        statusCode: StatusCodes.BAD_REQUEST,
        body: "No image provided."
    };

    if (!req.file) return res.status(response.statusCode).json(response);
    next();
};

// Uploads images and attaches to a patch.
router.post("/upload",
    imageUpload.single("image"),
    hasImage,
async (req, res) => {
    
    const result = await uploadPatchImage(req.file);
    return res.status(result.statusCode).json(result);
});

router.post("/attach-to-patch",
    body("patchId").isInt().not().isString().withMessage("should be an integer"),
    body("images").isArray().optional().withMessage("should be an array"),
    check("images.*").isURL().withMessage("should be an image url"),
    validationCheck,
async (req, res) => {
    const { patchId, images } = req.body;

    const result = await attachToPatch(patchId, images);

    return res.status(result.statusCode).json(result);
});

export default router;