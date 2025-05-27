"use client";

import {
   useCartItem,
   useCurrency,
   useHandleModal,
   useReceiver,
} from "../../utils/UniStore";

import TmtUsdt from "../payments/TmtUsdt";
import Transactions from "../ton/Transactions";
import Image from "next/image";
import { ProductType } from "@prisma/client";
import { productTitle } from "bot/src/settings";

const ChktMdl = () => {
   const openState = useHandleModal((state) => state.isOpen);
   const currency = useCurrency((state) => state.currency);
   const item = useCartItem((state) => state.item);
   const receiever = useReceiver((state) => state.user);

   if (openState !== 1) {
      return null;
   }
   return (
      <>
         {/* modal */}
         <div className="w-[80%] fixed bg-slate-300 rounded-2xl flex flex-col py-2">
            <div className="border-b border-slate-100 flex justify-center mb-2 px-12 pb-1">
               <div>Dogrumy?</div>
            </div>

            <div className="rounded-md overflow-hidden mx-2">
               <div className="bg-slate-100 p-1 even:bg-gray-200 flex justify-center">
                  
                  <div>
                     {item?.name ? productTitle(item.name as ProductType) : ""}
                  </div>
               </div>
               <div className="bg-slate-100 p-1 even:bg-gray-200 flex justify-between">
                  <div>
                     {item?.title
                        ? "Haryt"
                        : item?.duration
                        ? "Wagty:"
                        : "Sany:"}
                  </div>
                  <div>
                     {item?.title
                        ? item?.title
                        : item?.amount
                        ? item.amount
                        : item?.duration}
                  </div>
               </div>

               <div className="bg-slate-100 p-1 even:bg-gray-200 flex justify-between">
                  <div>
                     {item?.name === "jtn"
                        ? "Tel. №"
                        : item?.name === "uc"
                        ? "PUBG ID"
                        : item?.receiver[0]}
                     :
                  </div>
                  <div>
                     {item?.name === "tgprem" || item?.name === "star" ? (
                        <div className="flex items-center">
                           <span className="text-sm mr-1">
                              {receiever?.name || "username"}
                           </span>
                           <Image
                              alt=""
                              src={receiever?.photo_url || "/oth/no-user.png"}
                              width={25}
                              height={25}
                              className="rounded-full"
                              rel="preload"
                              priority
                           />
                        </div>
                     ) : (
                        item?.receiver[1]
                     )}
                  </div>
               </div>

               <div className="bg-slate-100 p-1 even:bg-gray-200 flex justify-between">
                  <div>Jemi töleg:</div>
                  <div>{item?.total + " " + item?.currency}</div>
               </div>
            </div>

            <div className="w-full px-3 pt-2">
               {currency === "TON" ? (
                  <Transactions />
               ) : (
                  <TmtUsdt currency={currency} item={item} />
               )}
            </div>
         </div>
      </>
   );
};

export default ChktMdl;
