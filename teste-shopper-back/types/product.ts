import { Prisma } from '@prisma/client';

export interface Product {
  code: bigint,
  name: string,
  costPrice: Prisma.Decimal,
  salesPrice: Prisma.Decimal,
}
