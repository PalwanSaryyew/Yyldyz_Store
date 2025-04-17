"use client";
import {
   useCartItem,
   useCurrency,
   useHandleModal,
   useReceiver,
   useUser,
   useWhicIsOpen,
} from "../../utils/UniStore";
import { useState } from "react";
import { cn } from "@/utils/tailwindMerge";
import { getUser } from "@/lib/fetchs";
import { webApp } from "@/lib/webApp";
import { Product } from "../../../prisma/prismaSett";
const ItemModal = ({ item, tonPrice }: { item: Product; tonPrice: number }) => {
   const isOpen = useWhicIsOpen((state) => state.opened);
   const change = useCartItem((state) => state.add);
   const modalOpener = useHandleModal((state) => state.toogleOpen);
   const currency = useCurrency((state) => state.currency);
   const currentUser = useUser((state) => state.user);
   const priceOnCurrency =
      currency === "TMT"
         ? item.priceTMT
         : currency === "USDT"
         ? item.priceUSDT
         : Number((item.priceUSDT / tonPrice).toFixed(4));
   const currentColor = cn(
      currency === "TMT"
         ? "bg-tmtColor"
         : currency === "TON"
         ? "bg-tonColor"
         : "bg-usdtColor"
   );
   const [receiver, setReceiver] = useState<string>("");
   const boxDisplay = cn(isOpen === item.id ? "block" : "hidden");
   const setReceiverState = useReceiver((state) => state.add);
   const [isLoading, setIsLoading] = useState(false);
   return (
      <div
         className={`${boxDisplay} bg-white w-[90%] rounded-b-lg p-2 items-center mx-auto`}
      >
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
                  className="border-none py-2 w-full outline-none bg-transparent text-gray-100 font-medium text-lg placeholder:text-gray-200/80 placeholder:text-base"
                  placeholder={
                     item.name === "tgprem" || item.name === "star"
                        ? "Tg username"
                        : item.name === "uc"
                        ? "PUBG ID"
                        : "TikTok-a birikdirilen telefon belgi."
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
                     amount: item.amount,
                     receiver:
                        item.name === "tgprem" || item.name === "star"
                           ? "@" + receiver
                           : receiver,
                     currency: currency,
                     total:
                        currency === "TON"
                           ? parseFloat(priceOnCurrency.toFixed(4))
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
                  receiver.length < 1 ? "hidden" : "block"
               } bg-white text-black px-2 py-2 rounded-lg ring-1 ring-blue`}
            >
               {isLoading ? (
                  <div className="animate-spin p-3 border border-transparent rounded-full border-l-black"></div>
               ) : (
                  <div className="px-2">Al</div>
               )}
            </button>
            <button
               className={`${
                  currentUser === null ||
                  receiver.length > 0 ||
                  item.name !== "tgprem" &&
                  item.name !== "star"
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
