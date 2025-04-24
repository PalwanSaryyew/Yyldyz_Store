import ItemBox from "@/components/item/ItemBox";
import { cmcApi } from "@/lib/fetchs";
import { toncoinId } from "@/lib/settings";
import { prisma, ProductType } from "../../../prisma/prismaSett";
import UseTrackLastVisitedPage from "@/lib/UseTrackLastVisitedPage";

interface ProductPageParams {
   params: {
      prdct: ProductType;
   };
}

export default async function ProductPage({ params }: ProductPageParams) {
   const { prdct } = params;
   const data = await prisma.product.findMany({
      where: {
         name: prdct,
         OR: [
            {
              // amount alanı null değilse
              amount: { not: null }
            },
            {
              // duration alanı null değilse
              duration: { not: null }
            }
          ]
      },
      orderBy: {
         amount: "asc",
      },

   });
   const tonPrice = await cmcApi(toncoinId);

   return (
      <div className="flex flex-col gap-4 py-8 w-full items-center">
         {/* recording path */}
         <UseTrackLastVisitedPage />
         {data.map((item) => (
            <ItemBox item={item} key={item.id} tonPrice={tonPrice} />
         ))}
      </div>
   );
}
