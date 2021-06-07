import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';

export const getAllPatches = async (): Promise<ApiResponse> => {

    const patches = await prisma.patch.findMany({
        include: {
            tags: true,
        }
    });

    return {
        statusCode: StatusCodes.OK,
        body: patches,
    };
};

export const create = async (
    name: string,
    description = "",
    date: (string | null) = null,
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
                tags: true,
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