import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';
import { IUserRequest } from '../../common/requests';

export const getAllPatches = async (user: IUserRequest["user"]): Promise<ApiResponse> => {

    const patches = await prisma.patch.findMany({
        include: {
            tags: {
                include: {
                    children: true,
                }
            },
        }
    }) as any;

    // Delete files if not admin or prylis
    if (!(user?.admin.includes("prylis") || user?.admin.includes("admin"))) {
        patches.forEach((x: any) => {
            delete x.files;
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