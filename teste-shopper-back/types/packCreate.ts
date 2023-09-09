import { Product } from "@prisma/client";

export interface PackCreate {
  id: bigint,
  packId: bigint,
  productId: bigint,
  qty: bigint,
}
