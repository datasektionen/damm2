import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';

export const DEFAULT_TEXT_COLOR = "#FFFFFF";
export const DEFAULT_BG_COLOR = "#E83D84";

export const getAll = async (): Promise<ApiResponse> => {

    const tags = await prisma.tag.findMany({
        include: {
            children: true,
        },
        where: {
            tagId: null
        }
    });

    return {
        statusCode: StatusCodes.OK,
        body: tags,
    };
};

export const create = async (
    name: string,
    description = "",
    color: string = DEFAULT_TEXT_COLOR,
    backgroundColor: string = DEFAULT_BG_COLOR,
    parent: number,
): Promise<ApiResponse> => {

    try {
        if (await prisma.tag.findUnique({where: {name}}) !== null) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                body: "Tagg med samma namn finns redan"
            };
        }

        const tag = await prisma.tag.create({
            data: {
                name,
                description,
                color,
                backgroundColor,
                tagId: parent,
            },
            include: {
                children: true,
            }
        });
    
        return {
            statusCode: StatusCodes.CREATED,
            body: tag,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err
        };
    }
};

export const update = async (
    id: number,
    name: string,
    description = "",
    color: string = DEFAULT_TEXT_COLOR,
    backgroundColor: string = DEFAULT_BG_COLOR,
): Promise<ApiResponse> => {

    const nameExists = await prisma.tag.findUnique({
        where: {
            name,
        }
    });

    if (nameExists !== null && nameExists.id !== id) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            body: "En annan tag har samma namn"
        };
    }

    const data = {} as any;

    if (name) {
        data.name = name;
    }
    if (description) {
        data.description = description;
    }
    if (color) {
        data.color = color;
    }
    if (backgroundColor) {
        data.backgroundColor = backgroundColor;
    }

    try {
        await prisma.tag.update({
            where: {
                id,
            },
            data,
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

export const deleteTag = async (id: number): Promise<ApiResponse> => {
    try {
        const result = await prisma.tag.delete({
            where: {
                id,
            },
            include: {
                children: true,
            }
        });
        // On delete cascade not possible in prisma as of writing this (i.e. to define it in the .prisma-file.)
        result.children.forEach(async t => {
            await prisma.tag.delete({
                where: {
                    id: t.id,
                }
            });
        });
        console.log(result);
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
    return {
        statusCode: StatusCodes.OK,
    };
};