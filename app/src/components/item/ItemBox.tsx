"use client";
import ItemModal from "./ItemModal";
import ItemModalOpener from "./ItemModalOpener";
import ItemPrice from "./ItemPrice";
import ItemIcon from "./ItemIcon";
import ItemAmount from "./ItemAmount";
import { Product } from "../../../prisma/prismaSett";
import { Detail, Details, DetailTitle, Requirements } from "@prisma/client";
import ProductPriceCalculator from "../amount/ProductPriceCalculator";
import { useState } from "react";
interface ItemBoxProps {
   item: Product & { requirements: Requirements | null } & {
      details: (Details & { detail: Detail[]; title: DetailTitle | null })[];
   };
   tonPrice: number;
   onAmount: boolean;
}

const ItemBox = ({ item, tonPrice, onAmount }: ItemBoxProps) => {
   const [amountPriceTMT, setTotalPriceTMT] = useState<number>(0);
   const [amountPriceUSDT, setTotalPriceUSDT] = useState<number >(0);
   const [quantity, setQuantity] = useState<string>(item.min?.toString());

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
                  {onAmount ? (
                     <ProductPriceCalculator
                        setQuantity={setQuantity}
                        quantity={quantity}
                        setTotalPriceTMT={setTotalPriceTMT}
                        setTotalPriceUSDT={setTotalPriceUSDT}
                        amountPriceTMT={item.priceTMT}
                        amountPriceUSDT={item.priceUSDT}
                        item={item}
                     />
                  ) : (
                     <ItemAmount
                        amount={item.amount || 0}
                        duration={item.duration}
                        title={onAmount ? "Sany Ýaz" : item.title}
                     />
                  )}
               </div>
            </div>

            {/* right */}

            <ItemPrice
               textColor={textColor}
               tonPrice={tonPrice}
               priceTMT={onAmount ? amountPriceTMT : item.priceTMT}
               priceUSDT={onAmount ? amountPriceUSDT : item.priceUSDT}
            />
         </ItemModalOpener>

         {/* openable bottom section */}
         {}
         <ItemModal item={item} tonPrice={tonPrice} onAmount={onAmount} />
      </div>
   );
};

export default ItemBox;
