import { PrismaClient } from "@prisma/client";
import { adminDatas } from "../src/settings";

const prisma = new PrismaClient();
async function main() {
   // seed stars
   await prisma.product.createMany({
      data: [
         {
            name: "star",
            amount: 50,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 0.81,
         },
         {
            name: "star",
            amount: 100,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 1.6,
         },
         {
            name: "star",
            amount: 150,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 2.38,
         },
         {
            name: "star",
            amount: 200,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 3.16,
         },
         {
            name: "star",
            amount: 250,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 3.95,
         },
         {
            name: "star",
            amount: 300,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 4.73,
         },
         {
            name: "star",
            amount: 350,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 5.52,
         },
         {
            name: "star",
            amount: 400,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 6.31,
         },
         {
            name: "star",
            amount: 450,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 7.09,
         },
         {
            name: "star",
            amount: 500,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 7.87,
         },
         // 100
         {
            name: "star",
            amount: 600,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 9.44,
         },
         {
            name: "star",
            amount: 700,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 11.01,
         },
         {
            name: "star",
            amount: 800,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 12.57,
         },
         {
            name: "star",
            amount: 900,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 14.14,
         },
         {
            name: "star",
            amount: 1000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 15.71,
         },
         // 250
         {
            name: "star",
            amount: 1250,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 19.61,
         },
         {
            name: "star",
            amount: 1500,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 23.56,
         },
         {
            name: "star",
            amount: 1750,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 27.48,
         },
         {
            name: "star",
            amount: 2000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 31.4,
         },
         {
            name: "star",
            amount: 2250,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 35.34,
         },
         {
            name: "star",
            amount: 2500,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 39.27,
         },
         // 500
         {
            name: "star",
            amount: 3000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 47.12,
         },
         {
            name: "star",
            amount: 3500,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 55,
         },
         {
            name: "star",
            amount: 4000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 62.85,
         },
         {
            name: "star",
            amount: 4500,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 70.72,
         },
         {
            name: "star",
            amount: 5000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 78.58,
         },
         // 1000
         {
            name: "star",
            amount: 6000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 94.16,
         },
         {
            name: "star",
            amount: 7000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 109.94,
         },
         {
            name: "star",
            amount: 8000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 125.64,
         },
         {
            name: "star",
            amount: 9000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 141.39,
         },
         {
            name: "star",
            amount: 10000,
            priceTMT: 0,
            priceUSDT: 0,
            priceBuy: 157.06,
         },
      ],
   });
   console.log("Seeding stars successfully!");
   // Seed prem
   await prisma.product.createMany({
      data: [
         {
            name: "tgprem",
            amount: 3,
            priceTMT: 250,
            priceUSDT: 13,
            priceBuy: 11.99,
         },
         {
            name: "tgprem",
            amount: 6,
            priceTMT: 340,
            priceUSDT: 17.5,
            priceBuy: 15.99,
         },
         {
            name: "tgprem",
            amount: 12,
            priceTMT: 625,
            priceUSDT: 32,
            priceBuy: 28.99,
         },
      ],
   });
   console.log("Seeding tgprem successfully!");
   // seed uc
   await prisma.product.createMany({
      data: [
         {
            name: "uc",
            amount: 30,
            priceTMT: 13,
            priceUSDT: 0.7,
            priceBuy: 0.44,
         },
         {
            name: "uc",
            amount: 60,
            priceTMT: 20,
            priceUSDT: 1.05,
            priceBuy: 0.86,
         },
         {
            name: "uc",
            amount: 325,
            priceTMT: 95,
            priceUSDT: 4.9,
            priceBuy: 4.3,
         },
         {
            name: "uc",
            amount: 660,
            priceTMT: 190,
            priceUSDT: 9.75,
            priceBuy: 8.6,
         },
         {
            name: "uc",
            amount: 1800,
            priceTMT: 480,
            priceUSDT: 24.65,
            priceBuy: 21.5,
         },
         {
            name: "uc",
            amount: 3850,
            priceTMT: 970,
            priceUSDT: 49.75,
            priceBuy: 43,
         },
         {
            name: "uc",
            amount: 8100,
            priceTMT: 1850,
            priceUSDT: 94.9,
            priceBuy: 86,
         },
      ],
   });
   console.log("Seeding uc successfully!");
   // seed admins

   await prisma.admin.createMany({
      data: adminDatas(),
   });
   console.log("Seeding completed successfully!");
}

main()
   .catch((e) => {
      console.error("SEEDING ERROR::", e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
