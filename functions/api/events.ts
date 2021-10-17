import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../common/client';
import { EventType } from '.prisma/client';

export const getAll = async (): Promise<ApiResponse> => {
    const result = await prisma.event.findMany({});
    return {
        statusCode: StatusCodes.OK,
        body: result,
    };
};

export const createEvent = async (title: string, content: string, date: string, type: string, protocol: string, createdBy: string): Promise<ApiResponse> => {
    
    try {
        const result = await prisma.event.create({
            data: {
                title,
                content,
                date,
                // Convert from string to enum
                type: (<any>EventType)[type],
                protocol,
                createdBy,
            },
        });

        return {
            statusCode: StatusCodes.CREATED,
            body: result,
        };

    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const updateEvent = async ({ id, title, content, date, type, protocol }: {id: number, title?: string, content?: string, date?: string, type?: string, protocol?: string}): Promise<ApiResponse> => {
    
    const data = {} as any;

    if (title) data.title = title;
    if (content) data.content = content;
    if (date) data.date = date;
    if (type) data.type = type;
    if (protocol) data.protocol = protocol;

    try {
        const result = await prisma.event.update({
            where: {
                id,
            },
            data,
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

export const deleteEvent = async (id: number): Promise<ApiResponse> => {
    try {
        await prisma.event.delete({
            where: {
                id,
            }
        });
        
        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err
        };
    }
};