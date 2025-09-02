"use client";
import { ProductDescription } from "@/utils/Settings";
import React from "react";
import { usePathname } from "next/navigation";
import { ProductType } from "@prisma/client";
import { productTitle } from "bot/src/settings";
import { useHandleModal } from "@/utils/UniStore";
import { BsInfoSquareFill } from "react-icons/bs";

function InfoBox() {
   const pathname = usePathname();
   const prdct = pathname.slice(1);
   const description = ProductDescription({ name: prdct as ProductType });
   const title = productTitle(prdct as ProductType);
   const modalOpener = useHandleModal((state) => state.toogleOpen);
   function Open() {
      if (description) {
         modalOpener(3);
      }
   }

   return (
      <div className="w-full top-12" onClick={Open}>
         <div
            className={`w-[90%] px-auto bg-transparent backdrop-blur-[2.5px] mt-3 mx-auto text-center font-bold text-base py-2 ring transition-all rounded-md shadow-md hover:shadow-lg hover:ring-2 hover:ring-blue-500 active:scale-95 active:bg-blue-500 active:text-white`}
         >
            <div className="flex justify-center items-center gap-2 cursor-pointer text-white">
               {title}
               {description && (
                  <BsInfoSquareFill
                     color="#60A5FA"
                     size={20}
                     className={` transition duration-500`}
                  />
               )}
            </div>
         </div>
      </div>
   );
}

export default InfoBox;
