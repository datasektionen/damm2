import prisma from "../../common/client";
import ApiResponse from "../../common/ApiResponse";
import { catchErrors } from "./storage";
import { StatusCodes } from "http-status-codes";

export const getPersons = async (): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const result = await prisma.person.findMany({
      include: {
        createdPatches: true,
      },
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
      },
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
        OR: ids.map((id) => ({ personId: id })),
      },
    });

    const result = await prisma.person.deleteMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });

    return {
      statusCode: StatusCodes.OK,
      body: result,
    };
  });
};

export const createDonation = async (
  patchId: number,
  data: { personId: number; amount: number }[]
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const result = await prisma.donation.createMany({
      data: data.map((d) => ({
        amount: d.amount,
        personId: d.personId,
        patchId,
      })),
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: result,
    };
  });
};

export const getDonations = async (
  patchId: number | undefined,
  personId: number | undefined
): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const result = await prisma.donation.findMany({
      include: {
        Person: true,
        patch: true,
      },
      where: {
        AND: {
          patchId,
          personId,
        },
      },
    });

    return {
      statusCode: StatusCodes.OK,
      body: result,
    };
  });
};

export const deleteDonations = async (ids: number[]): Promise<ApiResponse> => {
  return await catchErrors(async () => {
    const result = await prisma.donation.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      statusCode: StatusCodes.OK,
      body: result,
    };
  });
};
