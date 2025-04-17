import { cmcApi } from "@/lib/fetchs";
import { prisma, ProductType } from "../../../prisma/prismaSett";
import { toncoinId } from "@/lib/settings";
import ItemBox from "../item/ItemBox";


const Article = async ({ prdctNm }: { prdctNm: ProductType }) => {
   const data = await prisma.product.findMany({
      where: {
         name: prdctNm,
      },
   });
   const tonPrice = await cmcApi(toncoinId);
   console.log(data, tonPrice);
   

   return (
      <div className="flex flex-col gap-4 py-8 w-full items-center">
         {data.map((item) => (
            <ItemBox item={item} key={item.id} tonPrice={tonPrice} />
         ))}
      </div>
   );
};
export default Article;
