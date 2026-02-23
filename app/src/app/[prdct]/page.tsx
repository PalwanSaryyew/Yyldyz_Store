import ItemBox from "@/components/item/ItemBox";
import { cmcApi } from "@/lib/fetchs";
import { prisma, ProductType } from "../../../prisma/prismaSett";
import UseTrackLastVisitedPage from "@/lib/UseTrackLastVisitedPage";
import {  toncoinId } from "bot/src/settings";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/lib/types";

export default async function ProductPage({
   params,
}: {
   params: { prdct: string };
}) {
   const isProductType = Object.values(ProductType).includes(
      params.prdct as ProductType,
   );
   if (!isProductType) {
      notFound();
   }
   const data = await prisma.product.findMany({
      where: {
         name: params.prdct as ProductType,
         OR: [
            {
               priceTMT: { not: 0 },
            },
            {
               priceUSDT: { not: 0 },
            },
         ],
      },
      orderBy: [
         {
            title: { sort: "asc", nulls: "last" }, // To get the non-empty title to the top
         },
         { priceTMT: "asc" }, // Sort by priceTMT ascending
      ],
      include: {
         Requirements: true,
      },
   });

   const tonPrice = await cmcApi(toncoinId);

   return (
      <>
         <div className="flex flex-col gap-4 py-4 w-full items-center">
            {/* recording path */}
            <UseTrackLastVisitedPage />
            {data.map((item) => (
               <ItemBox item={{...item, Details: item.Details as ProductDetails[]}} key={item.id} tonPrice={tonPrice} />
            ))}
         </div>
      </>
   );
}
