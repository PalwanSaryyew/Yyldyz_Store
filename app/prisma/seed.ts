import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
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
}

main()
   .catch((e) => {
      console.error("SEEDING ERROR::", e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });

