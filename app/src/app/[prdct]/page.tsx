import ItemBox from "@/components/item/ItemBox";
import { cmcApi } from "@/lib/fetchs";
import { toncoinId } from "@/lib/settings";
import { prisma, ProductType } from "../../../prisma/prismaSett";
import UseTrackLastVisitedPage from "@/lib/UseTrackLastVisitedPage";
import InfoBox from "@/components/mains/InfoBox";

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
      orderBy: {
         amount: "asc",
      },
   });

   const tonPrice = await cmcApi(toncoinId);

   return (
      <>
         {prdct === "exit" && (
            <InfoBox title={"Exitlag barada"}>
               <div className="text-white">
                  Exitlag bul online oýunlary açmak üçin niýetlenen
                  programmadyr.
                  <br /><br /> Exitlag diňe bir online oýunlary oýnamaga mümkinçilik
                  bermän eýsem bulary ýokary tizlikde we pes pingde oynamagada
                  mümkünçilik döretýär.
                  <br /><br /> Elbetde PUBG Mobile üçin hem işleýär.
                  <br /> Häzirki abuna diňe smartfonlar üçin niyetlenendir!
               </div>
            </InfoBox>
         )}
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
