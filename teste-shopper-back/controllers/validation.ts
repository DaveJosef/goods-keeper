import { Request, Response, NextFunction } from "express";
import { fileReader } from "../utils/fileReader";
import { parseCsv } from "../utils/parser";
import { ProductUpdate } from "../types/productUpdate";
import * as productDb from "../db/products";
import { validatePackageSalesPriceIsSumOfItsComponentsProductUpdate } from "../utils/validation";
import { ValidationError } from "../exceptions/validationError";
import { Product } from "../types/product";

const updateEach = async (productsUpdate: ProductUpdate[]) => {
    const products: Product[] = [];
    for (const productUpdate of productsUpdate) {
        const { new_price, product_code } = productUpdate;
        const product = await productDb.updateProduct(productUpdate.product_code, {
            new_price,
            product_code,
        });
        products.push(product);
    }
    return products;
}

const verifyAllExists = async (productsUpdate: ProductUpdate[]) => {
        for (const productUpdate of productsUpdate) {
            const { product_code } = productUpdate;
            try {
                await productDb.verifyProductExists(product_code);
            } catch (err) {
                throw new ValidationError('Product Not Found', productsUpdate.findIndex(p => p.product_code === product_code) + 1, -1);
            }
        }
}

const uploadController = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    console.log(file?.filename);
    if (!file) {
        const error: any = new Error('No File!');
        error.httpStatusCode = 400;
        return next(error);
    }
    
    console.log({ path: req.file?.path + '' })
    const readings = await fileReader.readFile(req.file?.path + '');
    const list: ProductUpdate[] = parseCsv(readings);

    const products = await updateEach(list);

    res.status(200).json(JSON.stringify(products, (_, v) => typeof v === 'bigint' ? Number(v) : v));
}

const validateController = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    console.log(file?.filename);
    if (!file) {
        const error: any = new Error('No File!');
        error.httpStatusCode = 400;
        return next(error);
    }
    console.log({ path: req.file?.path + '' });
    const readings = await fileReader.readFile(req.file?.path + '');
    console.log({readings});
    try {
        const list = parseCsv(readings);
        await validatePackageSalesPriceIsSumOfItsComponentsProductUpdate(list);
        await verifyAllExists(list);
    } catch(err: any) {
        //return res.status(400).json({ err });
        //throw err;
        /* const error: any = err;
        error.httpStatusCode = 400;*/
        return next(err);
    }
    return res.status(200).json(readings);
}

export {
    uploadController,
    validateController,
}
