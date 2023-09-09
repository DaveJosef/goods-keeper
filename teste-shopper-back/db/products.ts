import { PrismaClient } from "@prisma/client";
import { Product } from "../types/product";
import { PrismaPromise } from "@prisma/client/runtime/library";
import { ProductReturn } from "../types/productReturn";
import { ProductUpdate } from "../types/productUpdate";

const prisma: PrismaClient = new PrismaClient();

const addProduct = async (product: Product) => {
    const productFound = await findProduct(Number(product.code));
    if (productFound !== null) {
        throw new Error('Product with Code ${code} Already Exists');
    }
    const {
        code,
        costPrice,
        name,
        salesPrice,
    } = product;
    const result = await prisma.product.create({
        data: {
            code,
            costPrice,
            name,
            salesPrice,
        }
    });
    return result;
}

const listProducts = async () => {
    const result = await prisma.product.findMany();
    return result;
}

const listProductsByCodes = async (codes: number[]) => {
    const result = await prisma.product.findMany({
        where: {
            code: {
                in: codes,
            }
        }
    });
    return result;
}

const findProduct = async (code: number) => {
    const result = await prisma.product.findUnique({
        where: { code }
    });
    return result;
}

const updateProduct = async (code: number, product: ProductUpdate) => {
    const actualProduct = await verifyProductExists(code);
    const {
        new_price
    } = product;
    const result = await prisma.product.update({
        where: { code },
        data: {
            salesPrice: new_price,
        }
    });
    return {...result, actualPrice: actualProduct.salesPrice};
}

const deleteProduct = async (code: number) => {
    await verifyProductExists(code);
    const result = await prisma.product.delete({
        where: { code }
    });
    return result;
}

const verifyProductExists = async (code: number) => {
    const productFound = await findProduct(code);
    if (productFound === null) {
        throw new Error('Product with Code ${code} Not Found');
    }
    return productFound;
}

export {
    addProduct,
    findProduct,
    listProducts,
    updateProduct,
    deleteProduct,
    listProductsByCodes,
    verifyProductExists,
};
