"use client";
import {
   useCartItem,
   useCurrency,
   useHandleModal,
   useQuantity,
   useReceiver,
   useUser,
   useWhicIsOpen,
} from "../../utils/UniStore";
import { useState } from "react";
import { cn } from "@/utils/tailwindMerge";
import { getUser } from "@/lib/fetchs";
import { webApp } from "@/lib/webApp";
import { Product } from "../../../prisma/prismaSett";
import { Requirements } from "@prisma/client";
import PrimeItemsBox from "./details/PrimeItemsBox";
import { starPriceCalculator, tonFee } from "bot/src/settings";
import { ProductDetails } from "@/lib/types";
const ItemModal = ({
   item,
   tonPrice,
   quantity,
   onQuantity,
}: {
   item: Product & { Requirements: Requirements | null } & {
      Details: ProductDetails[];
   };
   tonPrice: number;
   quantity?: string;
   onQuantity: boolean;
}) => {
   const amount = useQuantity((state) => state.quantity);
   const isOpen = useWhicIsOpen((state) => state.opened);
   const change = useCartItem((state) => state.add);
   const modalOpener = useHandleModal((state) => state.toogleOpen);
   const currency = useCurrency((state) => state.currency);
   const currentUser = useUser((state) => state.user);
   const priceOnCurrency =
      currency === "TMT"
         ? item.priceTMT.toFixed(2)
         : currency === "USDT"
         ? item.priceUSDT.toFixed(2)
         : Number(item.priceUSDT / (currency === "TON" ? (tonPrice + tonFee) : starPriceCalculator(item.priceUSDT)));
   const currentColor = cn(
      item.name === "pubg"
         ? "bg-white"
         : currency === "TMT"
         ? "bg-tmtColor"
         : currency === "TON"
         ? "bg-tonColor"
         : "bg-usdtColor"
   );
   const [receiver, setReceiver] = useState<string>(/* item.title?.includes('Telekom') ? '+993 ' : item.title?.includes('AŞTU') ? '+993 12 ' :  */'');
   const boxDisplay = cn(isOpen === item.id ? "block" : "hidden");
   const setReceiverState = useReceiver((state) => state.add);
   const [isLoading, setIsLoading] = useState(false);
   return (
      <div
         className={`${boxDisplay} w-[95%] rounded-b-lg p-2 items-center mx-auto`}
      >
         {item.Details.length > 0 &&
            item.Details.map((detail, index) => (
               <PrimeItemsBox key={index} detail={detail} textLight={item.name === 'pubg' ? true : false}/>
            ))}
         {/* input box */}
         <div
            className={`${currentColor} mx-auto p-1 px-2 rounded-lg flex items-center justify-between`}
         >
            <div className="text-gray-100 font-semibold text-lg">
               {item.name === "tgprem" || item.name === "star" ? "@" : ""}
            </div>
            <div className="overflow-hidden px-[.15rem] flex-1">
               <input
                  type="text"
                  name="receiver"
                  id=""
                  className={`border-none py-2 w-full outline-none bg-transparent font-medium text-lg placeholder:text-base ${
                     item.name === "pubg"
                        ? "placeholder:text-gray-500/50 text-gray-700"
                        : "placeholder:text-gray-200/80 text-gray-100"
                  }`}
                  placeholder={
                     item.name === "tgprem" || item.name === "star"
                        ? "Tg username"
                        : item.name === "uc"
                        ? "PUBG ID"
                        : item.name === "exit"
                        ? "Elektron poçtaňyz"
                        : item.Requirements?.asking
                  }
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  autoComplete="off"
               />
            </div>
            <button
               disabled={isLoading}
               onClick={async () => {
                  change({
                     id: item.id,
                     name: item.name,
                     title: item.title,
                     amount: onQuantity ? Number(amount) : item.amount,
                     duration: item.duration,
                     receiver: [
                        item.Requirements?.expecting
                           ? item.Requirements?.expecting
                           : "Kime",
                        item.name === "tgprem" || item.name === "star"
                           ? "@" + receiver
                           : receiver,
                     ],
                     currency: currency,
                     total: quantity
                        ? Number(quantity) * Number(priceOnCurrency)
                        : Number(priceOnCurrency),
                  });
                  if (item.name === "tgprem" || item.name === "star") {
                     setIsLoading(true);
                     await getUser(receiver)
                        .then(async (data) => {
                           if (!data.success) {
                              const app = await webApp();
                              if (app.initData) {
                                 app.showAlert(data.message);
                              } else {
                                 alert(data.message);
                              }
                              return;
                           } else {
                              setReceiverState({
                                 photo_url:
                                    data.photo_url || "/oth/no-user.png",
                                 name: data.name || "username",
                              });
                              modalOpener(1);
                              setReceiver("");
                           }
                        })
                        .finally(() => {
                           setIsLoading(false);
                        });
                  } else {
                     modalOpener(1);
                     setReceiver("");
                  }
               }}
               className={`${
                  receiver.length > 1 ? "block" : "hidden"
               } px-2 py-2 rounded-lg ring-1 ring-blue ${
                  item.name === "pubg"
                     ? "bg-mainColor text-white"
                     : "bg-white text-black"
               }`}
            >
               {isLoading ? (
                  <div className="animate-spin p-3 border border-transparent rounded-full border-l-black"></div>
               ) : (
                  <div className="px-2">{item.duration ? "Al" : "Al"}</div>
               )}
            </button>
            <button
               className={`${
                  currentUser === null ||
                  receiver.length > 0 ||
                  (item.name !== "tgprem" && item.name !== "star") ||
                  !currentUser?.username
                     ? "hidden"
                     : "block"
               } bg-white text-black px-2 py-2 rounded-lg ring-1 ring-blue text-sm`}
               onClick={() => {
                  if (currentUser?.username) {
                     setReceiver(currentUser.username);
                  }
               }}
            >
               Özüme
            </button>
         </div>
      </div>
   );
};

export default ItemModal;
