import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';

export const DEFAULT_TEXT_COLOR = "#FFFFFF";
export const DEFAULT_BG_COLOR = "#E83D84";

export const getAll = async (): Promise<ApiResponse> => {

    const tags = await prisma.tag.findMany({
        include: {
            children: true,
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
    children: number[] = [],
): Promise<ApiResponse> => {

    try {
        const tag = await prisma.tag.create({
            data: {
                name,
                description,
                color,
                backgroundColor,
                children: {
                    // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-an-existing-record
                    connect:  children.map(x => {return { id: x };}),
                }
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