import { Product } from "./product";

export interface PackCollection {
    packProduct: Product,
    componentProducts: Product[],
    qty: number,
}
