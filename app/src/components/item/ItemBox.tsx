import ItemModal from "./ItemModal";
import ItemModalOpener from "./ItemModalOpener";
import ItemPrice from "./ItemPrice";
import ItemIcon from "./ItemIcon";
import ItemAmount from "./amount/ItemAmount";
import { Product } from "../../../prisma/prismaSett";
import { Requirements } from "@prisma/client";
import ProductPriceCalculator from "./amount/ProductPriceCalculator";
import { ProductDetails } from "@/lib/types";

interface ItemBoxProps {
   item: Product & { Requirements: Requirements | null } & {
      Details: ProductDetails[];
   };
   tonPrice: number;
}

const ItemBox = ({ item, tonPrice }: ItemBoxProps) => {
   const bg =
      item.title === "Prime"
         ? "from-[#289692] to-[#058CD0]"
         : item.title === "Prime Plus"
         ? "from-[#E29539] to-[#E4512E]"
         : item.title === "Ak Sandyk"
         ? "from-[#386DDB] to-[#23334C]"
         : item.title === "Sary Sandyk"
         ? "from-[#e67541] to-[#344409]"
         : item.title === "Gyzyl Sandyk"
         ? "from-[#69020E] to-[#050B0D] "
         : item.title === "Mythic Emblem"
         ? "from-[#0D010D] to-[#590111] "
         : "bg-gray-200";
   const textColor = item.name === "pubg" ? "text-white" : "";
   return (
      <div
         className={`w-[90%] rounded-t-lg bg-gradient-to-br ${bg} ${textColor}`}
      >
         <ItemModalOpener
            id={item.id}
            style="w-full cursor-pointer flex p-2 items-center justify-between mx-auto gap-2"
         >
            {/* left */}
            <div className="flex items-center gap-3">
               <ItemIcon picture={item.picture} />

               <div
                  className={"text-base font-bold text-gray-600 " + textColor}
               >
                  {" "}
                  {item.min ? (
                     <ProductPriceCalculator item={item} />
                  ) : (
                     <ItemAmount
                        amount={item.amount || 0}
                        duration={item.duration}
                        title={item.title}
                     />
                  )}
               </div>
            </div>

            {/* right */}

            <ItemPrice
               textColor={textColor}
               tonPrice={tonPrice}
               item={item}
               onQuantity={item.min ? true : false}
            />
         </ItemModalOpener>

         {/* openable bottom section */}
         <ItemModal
            item={item}
            tonPrice={tonPrice}
            onQuantity={item.min ? true : false}
         />
      </div>
   );
};

export default ItemBox;
