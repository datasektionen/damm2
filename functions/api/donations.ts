import prisma from "../../common/client";
import ApiResponse from "../../common/ApiResponse";
import { catchErrors } from "./storage";
import { StatusCodes } from "http-status-codes";

export const getPersons = async (): Promise<ApiResponse> => {
    return await catchErrors(async () => {
        const result = await prisma.person.findMany({
            include: {
                createdPatches: true,
            }
        });

        return {
            statusCode: StatusCodes.OK,
            body: result,
        };
    });
};

export const createPerson = async (name: string): Promise<ApiResponse> => {
    return await catchErrors(async () => {
        const result = await prisma.person.create({
            data: {
                name,
            }
        });

        return {
            statusCode: StatusCodes.OK,
            body: result,
        };
    });
};

export const deletePersons = async (ids: number[]): Promise<ApiResponse> => {
    return await catchErrors(async () => {
        console.log(ids);
        await prisma.userCreatedPatch.deleteMany({
            where: {
                OR: ids.map(id => ({ personId: id })),
            }
        });

        const result = await prisma.person.deleteMany({
            where: {
                OR: ids.map(id => ({ id })),
            },
        });

        return {
            statusCode: StatusCodes.OK,
            body: result,
        };
    });
};
