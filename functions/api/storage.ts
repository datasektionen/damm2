import prisma from "../../common/client";
import ApiResponse from "../../common/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { Bag, Box, Patch } from "@prisma/client";

export const getAllBoxes = async ({
    includePatches = false,
}: { includePatches: boolean; }): Promise<ApiResponse> => {
    const boxes = await prisma.box.findMany({
        include: {
            bags: {
                include: {
                    patches: true,
                }
            }
        },
        orderBy: {
            id: "asc"
        }
    });

    return {
        statusCode: StatusCodes.OK,
        body: boxes.map(b => ({
            ...b,
            "#patches": b.bags.reduce((acc, bag) => bag?.patches?.length + acc, 0), // How many patches the box has
            bags: b.bags.map((bag: Partial<Bag & { patches: Patch[] }>) => {
                const length = bag.patches?.length;
                if (!includePatches) delete bag.patches;
                return {
                    ...bag,
                    "#patches": length, // always include how many patches a bag has
                };
            }),
        })),
    };
};

export const getAllBags = async ({
    includePatches = true,
}: { includePatches: boolean; }): Promise<ApiResponse> => {
    const bags = await prisma.bag.findMany({
        include: {
            patches: true,
            box: true,
        },
        orderBy: {
            name: "asc"
        }
    });

    const result = bags.map(b => ({
        ...b,
        "#patches": b?.patches?.length, // how many patches this bag contains
    }));

    if (!includePatches) result.map((b: Partial<Bag & { patches: Patch[], box: Box }>) => delete b.patches);

    return {
        statusCode: StatusCodes.OK,
        body: result,
    };
};

export const createBox = async (
    name: string,
): Promise<ApiResponse> => {
    try {
        const box = await prisma.box.create({
            data: {
                name,
            },
        });

        return {
            statusCode: StatusCodes.CREATED,
            body: box,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const changeBoxName = async (boxId: number, name: string): Promise<ApiResponse> => {
    try {
        await prisma.box.update({
            where: { id: boxId },
            data: {
                name,
            },
        });
        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};


export const createBag = async (
    name: string,
    boxId: number,
): Promise<ApiResponse> => {
    try {
        const bag = await prisma.bag.create({
            data: {
                name,
                boxId,
            },
        });

        return {
            statusCode: StatusCodes.CREATED,
            body: bag,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const putPatchInBag = async (
    patchId: number,
    bagId: number,
): Promise<ApiResponse> => {
    try {
        await prisma.patch.update({
            where: { id: patchId },
            data: {
                bagId,
            }
        });

        return {
            statusCode: StatusCodes.OK,
        };

    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const changeBagLocation = async (
    bagId: number,
    boxId: number,
): Promise<ApiResponse> => {
    try {
        await prisma.bag.update({
            where: { id: bagId },
            data: {
                boxId,
            },
        });
        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const changeBagName = async (bagId: number, name: string): Promise<ApiResponse> => {
    try {
        await prisma.bag.update({
            where: { id: bagId },
            data: {
                name,
            },
        });
        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const deleteBag = async (bagId: number): Promise<ApiResponse> => {
    try {
        await prisma.bag.delete({
            where: { id: bagId },
        });
        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};

export const deleteBox = async (boxId: number): Promise<ApiResponse> => {
    try {
        const box = await prisma.box.findUnique({ where: { id: boxId }, include: { bags: true }});
        if (!box) return {
            statusCode: StatusCodes.NOT_FOUND,
            error: "Box not found",
        };

        if (box?.bags.length !== 0) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                error: "Box is not empty. Move the bags out of the box to delete it."
            };
        }

        await prisma.box.delete({
            where: { id: boxId },
        });
        
        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: err,
        };
    }
};



