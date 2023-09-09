import { Prisma } from "@prisma/client";

export interface ProductReturn {
    code: bigint,
    name: string,
    costPrice: Prisma.Decimal,
    salesPrice: Prisma.Decimal,
    actualPrice: Prisma.Decimal,
  }
  