import { ProductType } from "@prisma/client";

import { prisma } from "../../../prisma/prismaSett";

import ItemBox from "../item/ItemBox";

const ItemOnAmount = async ({ product }: { product: ProductType }) => {
   const data = await prisma.productAmount.findFirst({
      where: {
         name: product,
      },
      orderBy: {
         amount: "asc",
      },
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
   return (
      <ItemBox item={data} tonPrice={1} onAmount={true}></ItemBox>
   );
};

export default ItemOnAmount;
