import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import ApiResponse from "../../common/ApiResponse";
import configuration from "../../common/configuration";
import { randomUUID } from "crypto";
import path from "path";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";
import prisma from "../../common/client";

const s3 = new S3Client({ region: configuration.AWS_REGION });

// Gets aws key from AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the .env file
s3.config
  .credentials()
  .then((credentials) => console.log(credentials.accessKeyId))
  .catch((err) => console.log(err));

// Keep libvips memory usage low in the 512 MB container
sharp.cache(false);

const compressImage = async (file: Express.Multer.File): Promise<Buffer> => {
  return await sharp(file.buffer).rotate().resize({ width: 250 }).toBuffer();
};

const uploadToS3 = ({
  Bucket,
  Key,
  Body,
  ContentType,
}: {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}) => {
  return new Upload({
    client: s3,
    params: {
      Bucket,
      Key,
      Body,
      ContentType,
      // 2 days hours (48 hours)
      CacheControl: "max-age=172800",
    },
  }).done();
};

export const uploadImage = async (
  file: Express.Multer.File,
  folder: string,
): Promise<ApiResponse> => {
  const fileName = randomUUID();
  const extension = path.extname(file.originalname);
  const fullFileName = fileName + extension;

  const uploadResults: Awaited<ReturnType<typeof uploadToS3>>[] = [];

  try {
    const result = await uploadToS3({
      Bucket: configuration.AWS_S3_BUCKET,
      Key: `${folder}/${fullFileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    uploadResults.push(result);
  } catch (err) {
    console.log(err);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: err,
    };
  }

  try {
    const compressedImage = await compressImage(file);

    const result = await uploadToS3({
      Bucket: configuration.AWS_S3_BUCKET,
      Key: `${folder}/${fileName}-compressed${extension}`,
      Body: compressedImage,
      ContentType: file.mimetype,
    });

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

export const attachImageTo = async (
  id: number,
  images: string[],
  type: "patch" | "artefact",
): Promise<ApiResponse> => {
  try {
    if (type === "patch") {
      await prisma.patch.update({
        where: {
          id,
        },
        data: {
          images,
        },
      });
    } else {
      await prisma.artefact.update({
        where: {
          id,
        },
        data: {
          images,
        },
      });
    }

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
export const uploadFile = async (
  file: Express.Multer.File,
  folder: string,
): Promise<ApiResponse> => {
  const fileName = Date.now() + "-" + file.originalname;

  try {
    const result = await uploadToS3({
      Bucket: configuration.AWS_S3_BUCKET,
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

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

export const attachFileTo = async (
  id: number,
  fileName: string,
  type: "patch" | "artefact",
): Promise<ApiResponse> => {
  try {
    if (type === "patch") {
      await prisma.patch.update({
        where: {
          id,
        },
        data: {
          files: {
            push: fileName,
          },
        },
      });
    } else {
      await prisma.artefact.update({
        where: {
          id,
        },
        data: {
          files: {
            push: fileName,
          },
        },
      });
    }

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

export const getFile = async (name: string) => {
  return new Promise<Buffer>((resolve, reject) => {
    s3.send(
      new GetObjectCommand({
        Bucket: configuration.AWS_S3_BUCKET,
        Key: `${name}`,
      }),
    )
      .then(async (res) => {
        resolve(Buffer.from(await res.Body!.transformToByteArray()));
      })
      .catch(() => {
        reject(null);
      });
  });
};

export const deleteFile = async (name: string) => {
  return new Promise((resolve, reject) => {
    s3.send(
      new DeleteObjectCommand({
        Bucket: configuration.AWS_S3_BUCKET,
        Key: `${name}`,
      }),
    )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteFileFrom = async (
  id: number,
  name: string,
  type: "patch" | "artefact",
) => {
  let files;
  if (type === "patch") {
    files = (
      await prisma.patch.findUnique({
        where: {
          id,
        },
      })
    )?.files;
    return await prisma.patch.update({
      where: {
        id,
      },
      data: {
        files: {
          set: files?.filter((f) => f !== name),
        },
      },
    });
  } else {
    files = (
      await prisma.artefact.findUnique({
        where: {
          id,
        },
      })
    )?.files;
    return await prisma.artefact.update({
      where: {
        id,
      },
      data: {
        files: {
          set: files?.filter((f) => f !== name),
        },
      },
    });
  }
};
