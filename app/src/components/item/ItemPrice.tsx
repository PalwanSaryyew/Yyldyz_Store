"use client";
import { cn } from "@/utils/tailwindMerge";
import { useCurrency } from "@/utils/UniStore";

interface ItemPriceProps {
   priceTMT: number;
   priceUSDT: number;
   tonPrice: number;
}

const ItemPrice = ({ priceTMT, priceUSDT, tonPrice }: ItemPriceProps) => {
   const currency = useCurrency((state) => state.currency);

   const priceOnCurrency =
      currency === "TMT"
         ? priceTMT
         : currency === "USDT"
         ? priceUSDT
         : Number((priceUSDT / tonPrice).toFixed(4));
   return (
      <div className="flex items-center gap-4">
         <div className="text-lg font-semibold text-gray-600">
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
