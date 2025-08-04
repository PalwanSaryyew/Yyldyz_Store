"use client";
import { cn } from "@/utils/tailwindMerge";
import { useCurrency, useQuantity } from "@/utils/UniStore";
import { Product } from "@prisma/client";
import { tonFee } from "bot/src/settings";
import { useEffect, useState } from "react";

interface ItemPriceProps {
   item: Product;
   tonPrice: number;
   textColor: string;
   onQuantity: boolean;
}

const ItemPrice = ({
   item,
   tonPrice,
   textColor,
   onQuantity,
}: ItemPriceProps) => {
   const currency = useCurrency((state) => state.currency);
   const quantity = useQuantity((state) => state.quantity);
   const orgPriceTMT = useQuantity((state) => state.orgPriceTMT);
   const orgPriceUSDT = useQuantity((state) => state.orgPriceUSDT);
   const [priceOnCurrency, setPriceOnCurrency] = useState<string>("");
   useEffect(() => {
      if (onQuantity) {
         // pricingTiers zaten bir obje/dizi olarak geliyor, doğrudan kullanın.
         // JSON.parse() adımına gerek yok.
         const pricingTiers = item.pricingTiers as Array<{
            threshold: number;
            discount: number;
         }>; // Type assertion Prisma.JsonValue'dan dönüştürme için
         /* const pricingTiers = [
            { discount: 0.25, threshold: 140 },
            { discount: 0.4, threshold: 350 },
            { discount: 0.4166666, threshold: 700 },
         ]; // Type assertion Prisma.JsonValue'dan dönüştürme için */

         let finalUnitPriceTMT = orgPriceTMT;
         let finalUnitPriceUSDT = orgPriceUSDT;

         for (let i = pricingTiers.length - 1; i >= 0; i--) {
            const tier = pricingTiers[i];
            if (Number(quantity) >= tier.threshold) {
               finalUnitPriceTMT = orgPriceTMT * (1 - tier.discount);
               finalUnitPriceUSDT = orgPriceUSDT * (1 - tier.discount);
               break; // İlk bulunan uygun kademeyi kullan ve döngüden çık
            }
         }

         item.priceTMT = finalUnitPriceTMT * Number(quantity);
         item.priceUSDT = finalUnitPriceUSDT * Number(quantity);
      }
      const basePrice =
         currency === "TMT"
            ? item.priceTMT
            : currency === "USDT"
            ? item.priceUSDT
            : Number(item.priceUSDT / tonPrice + tonFee);

      setPriceOnCurrency(
         currency === "TON" ? basePrice.toFixed(4) : basePrice.toFixed(2)
      );
   }, [
      currency,
      item,
      onQuantity,
      orgPriceTMT,
      orgPriceUSDT,
      quantity,
      tonPrice,
   ]);
   return (
      <div className="flex items-center gap-1">
         <div className={"text-base text-gray-700 font-medium " + textColor}>
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
