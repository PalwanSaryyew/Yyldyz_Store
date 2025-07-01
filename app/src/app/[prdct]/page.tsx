import ItemBox from "@/components/item/ItemBox";
import { cmcApi } from "@/lib/fetchs";
import { prisma, ProductType } from "../../../prisma/prismaSett";
import UseTrackLastVisitedPage from "@/lib/UseTrackLastVisitedPage";
import { toncoinId } from "bot/src/settings";

// import PubtItem from "@/components/pubg/PubtItem";

interface ProductPageParams {
   params: {
      prdct: ProductType;
   };
}

export default async function ProductPage({ params }: ProductPageParams) {
   const { prdct } = params;
   const data = await prisma.product.findMany({
      where: {
         name: prdct as ProductType,
         OR: [
            {
               priceTMT: { not: 0 },
            },
            {
               priceUSDT: { not: 0 },
            },
         ],
      },
      orderBy: [{ title: "asc" }, { duration: "asc" }, { amount: "asc" }],
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
