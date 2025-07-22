import ItemModal from "./ItemModal";
import ItemModalOpener from "./ItemModalOpener";
import ItemPrice from "./ItemPrice";
import ItemIcon from "./ItemIcon";
import ItemAmount from "./ItemAmount";
import { Product } from "../../../prisma/prismaSett";
import { Detail, Details, DetailTitle, Requirements } from "@prisma/client";
import ProductPriceCalculator from "../amount/ProductPriceCalculator";

interface ItemBoxProps {
   item: Product & { requirements: Requirements | null } & {
      details: (Details & { detail: Detail[]; title: DetailTitle | null })[];
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
         : "bg-gray-200";
   const textColor = item.name === "pubg" ? "text-white" : "";
   return (
      <div
         className={`w-[90%] rounded-t-lg bg-gradient-to-br ${bg} ${textColor}`}
      >
         <ItemModalOpener
            id={item.id}
            style="w-full cursor-pointer flex p-2 items-center justify-between mx-auto"
         >
            {/* left */}
            <div className="flex items-center gap-4">
               <ItemIcon picture={item.picture} />

               <div
                  className={
                     "text-[1.3rem] font-semibold text-gray-600 " + textColor
                  }
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
         {}
         <ItemModal item={item} tonPrice={tonPrice} onQuantity={item.min ? true : false}/>
      </div>
   );
};

export default ItemBox;
