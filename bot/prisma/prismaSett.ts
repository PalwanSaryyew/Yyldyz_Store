import {
   PrismaClient,
   Admin,
   Order,
   Product,
   SummUpdate,
   TonTransaction,
   User,
   PrismaPromise,
   OrderStatus,
   PaymentMethod,
   ProductType,
   UserRole,
   $Enums,
   Prisma,
} from "@prisma/client";

const prismaClientSingleton = () => {
   return new PrismaClient();
};

declare const globalThis: {
   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export {
   prisma,
   OrderStatus,
   PaymentMethod,
   ProductType,
   UserRole,
   $Enums,
   Prisma,
};
export type {
   Admin,
   Order,
   Product,
   SummUpdate,
   TonTransaction,
   User,
   PrismaPromise,
};

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
