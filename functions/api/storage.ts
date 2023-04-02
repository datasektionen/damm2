import prisma from "../../common/client";
import ApiResponse from "../../common/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { Bag, Box, Patch } from "@prisma/client";

export const getAllBoxes = async ({
  includePatches = false,
}: {
  includePatches: boolean;
}): Promise<ApiResponse> => {
  const boxes = await prisma.box.findMany({
    include: {
      bags: {
        include: {
          patches: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    statusCode: StatusCodes.OK,
    body: boxes.map((b) => ({
      ...b,
      "#uniquePatches": b.bags.reduce(
        (acc, bag) => bag?.patches?.length + acc,
        0
      ), // How many unique patches the box has
      "#patches": b.bags.reduce(
        (acc, bag) =>
          bag?.patches?.reduce((sum, patch) => patch.amount + sum, 0) + acc,
        0
      ), // How many patches the box has
      bags: b.bags.map((bag: Partial<Bag & { patches: Patch[] }>) => {
        const uniquePatches = bag.patches?.length;
        const patchAmount = bag.patches?.reduce((acc, p) => acc + p.amount, 0);
        if (!includePatches) delete bag.patches;
        return {
          ...bag,
          "#patches": patchAmount,
          "#uniquePatches": uniquePatches,
        };
      }),
    })),
  };
};

export const getAllBags = async ({
  includePatches = true,
}: {
  includePatches: boolean;
}): Promise<ApiResponse> => {
  const bags = await prisma.bag.findMany({
    include: {
      patches: true,
      box: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const result = bags.map((b) => ({
    ...b,
    "#uniquePatches": b?.patches?.length, // how many patches this bag contains
    "#patches": b.patches.reduce((sum, p) => sum + p.amount, 0),
  }));

  if (!includePatches)
    result.map(
      (b: Partial<Bag & { patches: Patch[]; box: Box }>) => delete b.patches
    );

  return {
    statusCode: StatusCodes.OK,
    body: result,
  };
};

export const createBox = async (name: string): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const exists = await prisma.box.findFirst({ where: { name } });
    if (exists)
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        error: "Box with the same name already exists.",
      };

    const box = await prisma.box.create({
      data: {
        name,
      },
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: box,
    };
  });
};

export const changeBoxName = async (
  boxId: number,
  name: string
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    await prisma.box.update({
      where: { id: boxId },
      data: {
        name,
      },
    });
    return {
      statusCode: StatusCodes.OK,
    };
  });
};

export const createBag = async (
  name: string,
  boxId: number
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const exists = await prisma.bag.findFirst({ where: { name } });
    if (exists)
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        error: "Bag with the same name already exists.",
      };

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
  });
};

export const putPatchInBag = async (
  patchId: number,
  bagId: number
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    await prisma.patch.update({
      where: { id: patchId },
      data: {
        bagId,
      },
    });

    return {
      statusCode: StatusCodes.OK,
    };
  });
};

export const changeBagLocation = async (
  bagId: number,
  boxId: number
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    await prisma.bag.update({
      where: { id: bagId },
      data: {
        boxId,
      },
    });
    return {
      statusCode: StatusCodes.OK,
    };
  });
};

export const changeBagName = async (
  bagId: number,
  name: string
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    await prisma.bag.update({
      where: { id: bagId },
      data: {
        name,
      },
    });
    return {
      statusCode: StatusCodes.OK,
    };
  });
};

export const deleteBag = async (bagId: number): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    await prisma.bag.delete({
      where: { id: bagId },
    });
    return {
      statusCode: StatusCodes.OK,
    };
  });
};

export const deleteBox = async (boxId: number): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const box = await prisma.box.findUnique({
      where: { id: boxId },
      include: { bags: true },
    });
    if (!box)
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: "Box not found",
      };

    if (box?.bags.length !== 0) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        error: "Box is not empty. Move the bags out of the box to delete it.",
      };
    }

    await prisma.box.delete({
      where: { id: boxId },
    });

    return {
      statusCode: StatusCodes.OK,
    };
  });
};

export const deleteBags = async (bagIds: number[]): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const result = await prisma.bag.deleteMany({
      where: {
        OR: bagIds.map((id) => ({ id })),
      },
    });

    if (result.count === 0)
      return {
        statusCode: StatusCodes.NOT_FOUND,
      };

    return {
      statusCode: StatusCodes.OK,
      body: result,
    };
  });
};

export const deleteBoxes = async (boxIds: number[]): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const result = await prisma.box.deleteMany({
      where: {
        OR: boxIds.map((id) => ({ id })),
      },
    });

    if (result.count === 0)
      return {
        statusCode: StatusCodes.NOT_FOUND,
      };

    return {
      statusCode: StatusCodes.OK,
      body: result,
    };
  });
};

export const changeMultipleBagsLocation = async (
  bagIds: number[],
  boxId: number
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const result = await prisma.bag.updateMany({
      data: {
        boxId,
      },
      where: {
        OR: bagIds.map((id) => ({ id })),
      },
    });

    if (result.count === 0)
      return {
        statusCode: StatusCodes.NOT_FOUND,
      };

    return {
      statusCode: StatusCodes.OK,
      body: result,
    };
  });
};

export const updateManyPatches = async ({
  patchIds,
  amount,
  bagId,
}: Partial<Pick<Patch, "amount" | "bagId">> & {
  patchIds: number[];
}): Promise<ApiResponse> => {
  const data: Partial<Pick<Patch, "amount" | "bagId">> = {};

  if (amount) data.amount = amount;
  if (bagId) data.bagId = bagId;

  return await catchErrors(async () => {
    const result = await prisma.patch.updateMany({
      data,
      where: {
        OR: patchIds.map((id) => ({ id })),
      },
    });

    if (result.count === 0)
      return {
        statusCode: StatusCodes.NOT_FOUND,
      };

    return {
      statusCode: StatusCodes.OK,
      body: result,
    };
  });
};

// TODO: Move to util-file
export async function catchErrors(
  func: () => Promise<ApiResponse>
): Promise<ApiResponse> {
  try {
    return await func();
  } catch (err) {
    console.log(err);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: err,
    };
  }
}
