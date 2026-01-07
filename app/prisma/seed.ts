import { prisma } from "./prismaSett";

/* import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); */
async function main() {
   /* try {
      await prisma.product.createMany({
         data: [
            {
               name: "pubg",
               title: "Prime",
               priceBuy: 1.02,
               priceTMT: 30,
               priceUSDT: 1.5,
               details: data,
            },
            {
               name: "pubg",
               title: "Prime Plus",
               priceBuy: 9.94,
               priceTMT: 250,
               priceUSDT: 12.5,
               details: data2,
            },
         ],
      });
      console.log("yes");
   } catch (error) {
      console.log(error);
   } */

   /* async function seedChests() {
      const count = await prisma.chest.count();
      if (count === 0) {
         const chests = [];
         for (let i = 1; i <= 100; i++) {
            chests.push({
               id: i,
               type: i <= 10 ? ("PREMIUM" as const) : ("NORMAL" as const),
            });
         }
         await prisma.chest.createMany({ data: chests });
         console.log("100 Sandık oluşturuldu.");
      }
   } */
}

main()
   .catch((e) => {
      console.error("SEEDING ERROR::", e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
