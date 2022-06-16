import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';
import { IUserRequest } from '../../common/requests';
import { URL } from 'url';
import { deleteFile } from './files';
import { Bag, Patch } from '@prisma/client';

export const getAllPatches = async (user: IUserRequest["user"]): Promise<ApiResponse> => {

    const patches = await prisma.patch.findMany({
        include: {
            tags: {
                include: {
                    children: true,
                }
            },
            bag: {
                include: {
                    box: true,
                },
            },
        }
    });

    // Delete files if not admin or prylis
    if (!(user?.admin.includes("prylis") || user?.admin.includes("admin"))) {
        patches.forEach((x: Partial<Patch>) => {
            delete x.files;
        });
        patches.forEach((p: Partial<Patch & { bag: Bag | null; }>) => {
            delete p.bag;
            delete p.bagId;
        });
    }

    return {
        statusCode: StatusCodes.OK,
        body: patches,
    };
};

export const create = async (
    name: string,
    description = "",
    date = "",
    creators: string[] = [],
    tags: number[] = [],
): Promise<ApiResponse> => {

    try {
        const patch = await prisma.patch.create({
            data: {
                name,
                description,
                date,
                creators,
                // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-an-existing-record
                tags: {
                    connect: tags.map(x => {return { id: x };}),
                },
                images: [],
            },
            include: {
                tags: {
                    include: {
                        children: true,
                    }
                },
            }
        });

        return {
            statusCode: StatusCodes.CREATED,
            body: patch
        };

    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err
        };
    }
};

export const update = async (patchId: number, {name, date, description, tags, creators, files}: {name?: string, date?: string, description?: string, tags?: number[], creators: string[], files?: string[]}): Promise<ApiResponse> => {
    const data: any = { };

    if (name) {
        data.name = name;
    }
    if (date) {
        data.date = date;
    }
    if (description) {
        data.description = description;
    }
    if (tags) {
        data.tags = {
            set: tags.map((t: number) => {return {id: t};}),
        };
    }
    if (creators) {
        data.creators = {
            set: creators,
        };
    }
    if (files) {
        data.files = {
            set: files,
        };
    }

    const result = await prisma.patch.update({
        where: {
            id: patchId,
        },
        data,
    });

    return {
        statusCode: 200,
        body: result
    };
};

export const deletePatch = async (id: number): Promise<ApiResponse> => {

    const patch = await prisma.patch.findUnique({
        where: {
            id,
        }
    });

    if (!patch) return {
        statusCode: StatusCodes.NOT_FOUND
    };

    const errors = [];

    // Delete images
    for (const img of patch?.images) {
        const url = new URL(img);
        // Skip first '/'
        const name = url.pathname.substring(1);
        try {
            await deleteFile(name);
        } catch (err) {
            errors.push({
                "error": `Something went wrong when deleting image ${name}`
            });
        }
    }

    // Delete files
    for (const file of patch.files) {
        const name = file;
        try {
            await deleteFile(name);
        } catch (err) {
            errors.push({
                "error": `Something went wrong when deleting file ${name}`
            });
        }
    }

    // Delete from database
    try {
        await prisma.patch.delete({
            where: {
                id,
            }
        });
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: [
                "Failed to delete Patch from database",
                ...errors,
            ]
        };
    }

    return {
        statusCode: StatusCodes.OK,
        error: errors,
    };
};