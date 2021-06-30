import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';

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