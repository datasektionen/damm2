import AWS from 'aws-sdk';
import ApiResponse from '../../common/ApiResponse';
import configuration from '../../common/configuration';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Jimp from 'jimp';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';

AWS.config.update({ region: configuration.AWS_REGION });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// Gets aws key from AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the .env file
AWS.config.getCredentials((err) => {
    if (err) console.log(err);
    else console.log(AWS.config.credentials?.accessKeyId);
});

const compressPatchImage = async (file: Express.Multer.File): Promise<Buffer> => {
    const image = await Jimp.read(file.buffer);
    return await image.resize(200, Jimp.AUTO)
        .quality(30)
        .getBufferAsync(image.getMIME());
};

const uploadToS3 = ({ Bucket, Key, Body, ContentType }: { Bucket: string, Key: string; Body: Buffer; ContentType: string; }) => {
    return s3.upload({
        Bucket,
        Key,
        Body,
        ContentType,
        Metadata: {
            "Cache-Control": "max-age: 86400"
        }
    });
};

export const uploadPatchImage = async (file: Express.Multer.File): Promise<ApiResponse> => {

    const fileName = uuidv4();
    const extension = path.extname(file.originalname);
    const fullFileName = fileName + extension;

    const uploadResults: any[] = [];

    try {
        const result = await uploadToS3({
            Bucket: configuration.AWS_S3_BUCKET,
            Key: `patches/${fullFileName}`,
            Body: Buffer.from(file.buffer),
            ContentType: file.mimetype,
        }).promise();

        uploadResults.push(result);

    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }

    try {
        const compressedImage = await compressPatchImage(file);

        const result = await uploadToS3({
            Bucket: configuration.AWS_S3_BUCKET,
            Key: `patches/${fileName}-compressed${extension}`,
            Body: compressedImage,
            ContentType: file.mimetype,
        }).promise();

        uploadResults.push(result);

        return {
            statusCode: StatusCodes.CREATED,
            body: uploadResults,
        };

    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            body: uploadResults,
            error: err,
        };
    }
};

export const attachImageToPatch = async (patchId: number, images: string[]): Promise<ApiResponse> => {
    try {
        await prisma.patch.update({
            where: {
                id: patchId,
            },
            data: {
                images,
            },
        });

        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

// Patch files require auth to GET
export const uploadPatchFile = async (file: Express.Multer.File): Promise<ApiResponse> => {
    const fileName = Date.now() + "-" + file.originalname;

    try {
        const result = await uploadToS3({
            Bucket: configuration.AWS_S3_BUCKET,
            Key: `patch-files/${fileName}`,
            Body: Buffer.from(file.buffer),
            ContentType: file.mimetype,
        }).promise();

        return {
            statusCode: StatusCodes.CREATED,
            body: result,
        };

    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const attachFileToPatch = async (patchId: number, fileName: string): Promise<ApiResponse> => {
    try {
        await prisma.patch.update({
            where: {
                id: patchId,
            },
            data: {
                files: {
                    push: fileName,
                }
            },
        });

        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const getPatchFile = async (name: string) => {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: configuration.AWS_S3_BUCKET,
            Key: `${name}`,
        })
        .promise()
        .then(res => {
            resolve(res.Body);
        })
        .catch(() => {
            reject(null);
        });
    });
};

export const deletePatchFile = async (name: string) => {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: configuration.AWS_S3_BUCKET,
            Key: `${name}`,
        })
        .promise()
        .then(res => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    });
};

export const deleteFileFromPatch = async (patchId: number, name: string) => {
    const files = (await prisma.patch.findUnique({
        where: {
            id: patchId
        }
    }))?.files;
    return await prisma.patch.update({
        where: {
            id: patchId,
        },
        data: {
            files: {
                set: files?.filter(f => f !== name)
            }
        }
    });
};