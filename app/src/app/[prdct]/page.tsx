import ItemBox from "@/components/item/ItemBox";
import { cmcApi } from "@/lib/fetchs";
import { prisma, ProductType } from "../../../prisma/prismaSett";
import UseTrackLastVisitedPage from "@/lib/UseTrackLastVisitedPage";
import { toncoinId } from "bot/src/settings";

export default async function ProductPage({
   params,
}: {
   params: { prdct: ProductType };
}) {
   const data = await prisma.product.findMany({
      where: {
         name: params.prdct,
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
         requirements: true,
         details: {
            include: {
               detail: true,
               title: true,
            },
         },
      },
   });

   const tonPrice = await cmcApi(toncoinId);

   return (
      <>
         <div className="flex flex-col gap-4 py-4 w-full items-center">
            {/* recording path */}
            <UseTrackLastVisitedPage />
            {data.map((item) => (
               <ItemBox item={item} key={item.id} tonPrice={tonPrice} />
            ))}
         </div>
      </>
   );
}
