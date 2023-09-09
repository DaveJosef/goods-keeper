import { Request, Response } from 'express';
import {
  addProduct,
  findProduct,
  listProducts,
  updateProduct,
  deleteProduct,
  listProductsByCodes,
} from "../db/products";
import { Product } from '../types/product';
import { ProductUpdate } from '../types/productUpdate';

const addController = async (req: Request, res: Response) => {
    const {
        code,
        costPrice,
        name,
        salesPrice
    }: Product = req.body;

    const product: Product = await addProduct({ code, costPrice, name, salesPrice, });
    const jsonResult = JSON.stringify(
        product,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(201).json(JSON.parse(jsonResult));
}

const findController = async (req: Request, res: Response) => {
    const { code } = req.params;

    const product: Product | null = await findProduct(Number(code));
    const jsonResult = JSON.stringify(
        product,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(200).json(JSON.parse(jsonResult));
}

const listController = async (req: Request, res: Response) => {
    const products: Product[] = await listProducts();
    const jsonResult = JSON.stringify(
        products,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(200).json(JSON.parse(jsonResult));
}

const listByCodesController = async (req: Request, res: Response) => {
    const { codes } = req.params;
    const products: Product[] = await listProductsByCodes(codes.split(',').map(l => Number(l)));
    const jsonResult = JSON.stringify(
        products,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(200).json(JSON.parse(jsonResult));
}

const updateController = async (req: Request, res: Response) => {
    const {
        new_price,
        product_code,
    }: ProductUpdate = req.body;

    const product: Product | null = await updateProduct(product_code, {
        new_price, product_code
    });
    const jsonResult = JSON.stringify(
        product,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(201).json(JSON.parse(jsonResult));
}

const deleteController = async (req: Request, res: Response) => {
    const { code } = req.params;

    const product = await deleteProduct(Number(code));
    const jsonResult = JSON.stringify(
        product,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value)
    );
    res.status(201).json(JSON.parse(jsonResult));
}

export {
    addController,
    findController,
    listController,
    listByCodesController,
    updateController,
    deleteController,
};
