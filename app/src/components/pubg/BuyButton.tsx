"use client";

import { tonFee } from "@/lib/settings";
import { useCartItem, useCurrency, useHandleModal, useUser } from "@/utils/UniStore";
import { Product } from "@prisma/client";

const BuyButton = ({
   title,
   item,
   tonPrice,
}: {
   title: string;
   item: Product;
   tonPrice: number;
}) => {
   const change = useCartItem((state) => state.add);
   const user = useUser((state) => state.user);
   const currency = useCurrency((state) => state.currency);
   const priceOnCurrency =
      currency === "TMT"
         ? item.priceTMT
         : currency === "USDT"
         ? item.priceUSDT
         : Number((item.priceUSDT / tonPrice + tonFee).toFixed(4));
   const modalOpener = useHandleModal((state) => state.toogleOpen);

   return (
      <button
         className="w-full bg-white rounded-md py-2 text-black mb-3 border shadow-md"
         onClick={() => {
            change({
               id: item.id,
               name: item.title,
               amount: item.amount || 0,
               receiver: user?.name || "",
               currency: currency,
               total:
                  currency === "TON"
                     ? parseFloat(priceOnCurrency.toFixed(4))
                     : Number(priceOnCurrency),
            });
            modalOpener(1);
         }}
      >
         {title}
      </button>
   );
};

export default BuyButton;
