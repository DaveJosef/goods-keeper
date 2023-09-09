import { PrismaClient } from "@prisma/client";
import { PackCreate } from "../types/packCreate";
import { PrismaPromise } from "@prisma/client/runtime/library";
import { verifyProductExists } from "./products";

const prisma: PrismaClient = new PrismaClient();

const addPack = async (pack: PackCreate) => {
    const {
        id,
        packId,
        productId,
        qty
    } = pack;
    const result = await prisma.pack.create({
        data: {
            id,
            packId,
            productId,
            qty
        },
        include: {
            component_product: true,
            pack_product: true,
        }
    });
    return result;
}

const listPacks = async () => {
    const result = await prisma.pack.findMany({
        include: { component_product: true, pack_product: true },
    });
    return result;
}

const findPack = async (id: number) => {
    const result = await prisma.pack.findUnique({
        where: { id },
        include: {
            component_product: true,
            pack_product: true,
        }
    });
    return result;
}

const updatePack = async (id: number, pack: PackCreate) => {
    verifyProductExists(Number(pack.packId));
    verifyProductExists(Number(pack.productId));
    const {
        packId,
        productId,
        qty
    } = pack;
    const result = await prisma.pack.update({
        where: { id },
        data: {
            id,
            packId,
            productId,
            qty
        },
        include: {
            component_product: true,
            pack_product: true,
        }
    });
    return result;
}

const deletePack = async (id: number) => {
    const result = await prisma.pack.delete({
        where: { id }
    });
    return result;
}

export {
    addPack,
    findPack,
    listPacks,
    updatePack,
    deletePack,
};
