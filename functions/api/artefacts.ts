import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';
import { deleteFile } from './files';

export const getAll = async (): Promise<ApiResponse> => {
    const result = await prisma.artefact.findMany({
        include: {
            tags: {
                include: {
                    children: true,
                }
            },
        }
    });
    return {
        statusCode: StatusCodes.OK,
        body: result,
    };
};

export const create = async (name: string, description = "", date = "", tags: number[] = []): Promise<ApiResponse> => {
    try {
        const result = await prisma.artefact.create({
            data: {
                name,
                description,
                date,
                tags: {
                    connect: tags.map(x => {return { id: x };}),
                },
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
            body: result,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err
        };
    }
};

export const update = async (id: number, name: string, description: string, date: string, tags: number[]): Promise<ApiResponse> => {
    try {
        const data: any = { };
    
        if (name) {
            data.name = name;
        }
        if (description) {
            data.description = description;
        }
        if (date) {
            data.date = date;
        }
        if (tags) {
            data.tags = {
                set: tags.map((t: number) => {return {id: t};}),
            };
        }
    
        const result = await prisma.artefact.update({
            where: {
                id,
            },
            data,
            include: {
                tags: {
                    include: {
                        children: true,
                    }
                },
            }
        });
    
        return {
            statusCode: StatusCodes.OK,
            body: result,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const deleteArtefact = async (id: number): Promise<ApiResponse> => {

    const artefact = await prisma.artefact.findUnique({
        where: {
            id,
        }
    });

    if (!artefact) return {
        statusCode: StatusCodes.NOT_FOUND
    };

    const errors = [];

    // Delete images
    for (const img of artefact?.images) {
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
    for (const file of artefact.files) {
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
        await prisma.artefact.delete({
            where: {
                id,
            }
        });
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: [
                "Failed to delete Artefact from database",
                ...errors,
            ]
        };
    }

    return {
        statusCode: StatusCodes.OK,
        error: errors,
    };
};