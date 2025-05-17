import Image from "next/image";
import PrimeItemsBox from "./PrimeItemsBox";
import { Product } from "@prisma/client";

import Price from "./Price";
import BuyButton from "./BuyButton";
type Props = {
   item: Product;
   tonPrice: number;
};

const PubtItem = ({ item, tonPrice }: Props) => {
   const details: {
      title: string;
      details: { image: string; text: string }[];
   }[] = Array.isArray(item.details)
      ? (item.details as {
           title: string;
           details: { image: string; text: string }[];
        }[])
      : item.details
      ? (JSON.parse(item.details as string) as {
           title: string;
           details: { image: string; text: string }[];
        }[])
      : [];

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
         : "";
   return (
      <div className={"bg-gradient-to-br rounded-md px-2 text-white w-[95%] " + bg}>
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Image src={item.picture || ""} alt="" width={45} height={45} />
               <div className="font-bold text-lg">{item.title}</div>
            </div>
            <Price
               tonPrice={tonPrice}
               priceTMT={item.priceTMT}
               priceUSDT={item.priceUSDT}
            />
         </div>

         <div>
            {details.map(
               (
                  detail: {
                     title: string;
                     details: { image: string; text: string }[];
                  },
                  index
               ) => (
                  <PrimeItemsBox key={index} detail={detail} />
               )
            )}

            <BuyButton title="Abuna ýazyl" item={item} tonPrice={tonPrice} />
            
         </div>
      </div>
   );
};

export default PubtItem;
