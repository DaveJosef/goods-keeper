import { Product } from "@prisma/client";

export interface Pack {
  id: bigint,
  packId: bigint,
  productId: bigint,
  qty: bigint,
  component_product: Product,
  pack_product: Product,
}
