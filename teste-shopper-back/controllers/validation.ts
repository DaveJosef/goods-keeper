import { Request, Response, NextFunction } from "express";
import { fileReader } from "../utils/fileReader";
import { parseCsv } from "../utils/parser";
import { isValidArray, validatePackageSalesPriceIsSumOfItsComponentsProductUpdate } from "../utils/validation";
import { ProductUpdate } from "../types/productUpdate";
import * as productDb from "../db/products";
import { Decimal } from "@prisma/client/runtime/library";

const updateEach = (productsUpdate: ProductUpdate[]) => {
    for (const productUpdate of productsUpdate) {
        const { new_price, product_code } = productUpdate;
        productDb.updateProduct(productUpdate.product_code, {
            new_price,
            product_code,
        });
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
    console.log({readings});
    const list: ProductUpdate[] = parseCsv(readings);
    console.log({list});
    res.status(200).json(file);
}

const validateController = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    console.log(file?.filename);
    if (!file) {
        const error: any = new Error('No File!');
        error.httpStatusCode = 400;
        return next(error);
    }
    console.log({ path: req.file?.path + '' })
    const readings = await fileReader.readFile(req.file?.path + '');
    console.log({readings})
    try {
        const list = parseCsv(readings);
        console.log({list});
        console.log({isNotEmpty: isValidArray(list)});
        console.log({isValidAtSums: await validatePackageSalesPriceIsSumOfItsComponentsProductUpdate(list)});
    } catch(err: any) {
        console.log({err})
        return res.status(400).json({ err });
    }
    return res.status(200).json(readings);
}

export {
    uploadController,
    validateController,
}
