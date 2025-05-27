"use client";
import { cn } from "@/utils/tailwindMerge";
import { useCurrency } from "@/utils/UniStore";
import { tonFee } from "bot/src/settings";

interface ItemPriceProps {
   priceTMT: number;
   priceUSDT: number;
   tonPrice: number;
   textColor: string
}

const ItemPrice = ({ priceTMT, priceUSDT, tonPrice, textColor }: ItemPriceProps) => {
   const currency = useCurrency((state) => state.currency);

   const priceOnCurrency =
      currency === "TMT"
         ? priceTMT
         : currency === "USDT"
         ? priceUSDT
         : Number((priceUSDT / tonPrice +tonFee).toFixed(4));
   return (
      <div className="flex items-center gap-4">
         <div className={"text-lg font-semibold "+textColor}>
            {priceOnCurrency}
         </div>
         <div
            className={cn(
               currency === "TMT"
                  ? `text-tmtColor`
                  : currency === "TON"
                  ? `text-tonColor`
                  : `text-usdtColor`,
               ` font-bold text-lg`
            )}
         >
            {currency}
         </div>
      </div>
   );
};

export default ItemPrice;
