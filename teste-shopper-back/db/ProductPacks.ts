import { PrismaClient } from "@prisma/client";
import { Pack } from "../types/pack";

const prisma: PrismaClient = new PrismaClient();

const findProductsThatArePacks = async () => {
    const productsThatArePacks = await prisma.pack.findMany({
        distinct: ["packId"]
    });
    return productsThatArePacks;
}

const findPacksByPackCode = async (code: number) => {
    const packs = await prisma.pack.findMany({
        where: {
            packId: code,
        },
        include: {
            pack_product: true,
            component_product: true,
        }
    });
    return packs;
}

const findPackOfWhichComponentisPart = async (code: number) => {
    const pack = await prisma.pack.findFirst({
        where: {
            productId: code,
        },
    });
    return pack?.packId;
}

const findPacksByComponentCode = async (code: number) => {
    const packs = await prisma.pack.findMany({
        where: {
            productId: code,
        },
        include: {
            pack_product: true,
            component_product: true,
        }
    });
    return packs;
}

const findComponentsOfPack = async (code: number) => {
    const packs = await prisma.pack.findMany({
        where: {
            packId: code,
        },
        include: {
            pack_product: true,
            component_product: true,
        }
    });
    return packs.map((pack: Pack) => pack.component_product);
}

const findPackByComponentAndPackCode = async (packCode: number, componentCode: number) => {
    const pack = await prisma.pack.findFirst({
        where: {
            packId: packCode,
            AND: {
                productId: componentCode,
            }
        },
        include: {
            pack_product: true,
            component_product: true,
        }
    });
    return pack;
}

export {
    findProductsThatArePacks,
    findPacksByComponentCode,
    findPacksByPackCode,
    findPackOfWhichComponentisPart,
    findComponentsOfPack,
    findPackByComponentAndPackCode,
};
