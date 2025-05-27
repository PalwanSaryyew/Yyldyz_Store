"use client";
import { useCurrency } from "@/utils/UniStore";
import { tonFee } from "bot/src/settings";

interface ItemPriceProps {
   priceTMT: number;
   priceUSDT: number;
   tonPrice: number;
}

const Price = ({ priceTMT, priceUSDT, tonPrice }: ItemPriceProps) => {
   const currency = useCurrency((state) => state.currency);

   const priceOnCurrency =
      currency === "TMT"
         ? priceTMT
         : currency === "USDT"
         ? priceUSDT
         : Number((priceUSDT / tonPrice + tonFee).toFixed(4));
   return (
      <div className="flex items-center gap-1 font-medium">
         <div className="text-white">{priceOnCurrency}</div>
         <div className="">{currency}</div>
      </div>
   );
};

export default Price;
