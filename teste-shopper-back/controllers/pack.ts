import { Request, Response } from 'express';
import {
  addPack,
  findPack,
  listPacks,
  updatePack,
  deletePack,
} from "../db/packs";
import { Pack } from '../types/pack';
import { Product } from '../types/product';

const addController = async (req: Request, res: Response) => {
    const {
        id,
        packId,
        productId,
        qty
    }: Pack = req.body;

    const result: { pack_product: Product, component_product: Product } = await addPack({ id, packId, productId, qty });
    const jsonResult = JSON.stringify(
        result,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(201).json(JSON.parse(jsonResult));
}

const findController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const pack: Pack | null = await findPack(Number(id));
    const jsonResult = JSON.stringify(
        pack,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(200).json(JSON.parse(jsonResult));
}

const listController = async (req: Request, res: Response) => {
    const packs: Pack[] = await listPacks();
    const jsonResult = JSON.stringify(
        packs,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(200).json(JSON.parse(jsonResult));
}

const updateController = async (req: Request, res: Response) => {
    const {
        id,
        packId,
        productId,
        qty
    }: Pack = req.body;

    const pack: Pack | null = await updatePack(Number(id), { id, packId, productId, qty, });
    const jsonResult = JSON.stringify(
        pack,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    );
    res.status(201).json(JSON.parse(jsonResult));
}

const deleteController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const pack = await deletePack(Number(id));
    const jsonResult = JSON.stringify(
        pack,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value)
    );
    res.status(201).json(JSON.parse(jsonResult));
}

export {
    addController,
    findController,
    listController,
    updateController,
    deleteController,
};
