import { PrismaClient } from "@prisma/client";
import { adminDatas } from "bot/src/settings";

const prisma = new PrismaClient();
async function main() {
   // seed stars
   
   console.log("Seeding stars successfully!");
   // Seed prem
   
   console.log("Seeding tgprem successfully!");
   // seed uc
   
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
