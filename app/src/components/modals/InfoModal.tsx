"use client";

import { ProductDescription } from "@/utils/Settings";
//import { webApp } from "@/lib/webApp";
import { cn } from "@/utils/tailwindMerge";
import { ProductType } from "@prisma/client";
import { usePathname } from "next/navigation";

const InfoModal = () => {
   // const close = useHandleModal((state) => state.toogleOpen);
   const pathname = usePathname();
   const prdct = pathname.slice(1);
   const description = ProductDescription({ name: prdct as ProductType });

   return (
      <div
         className={cn(
            "w-[80%] fixed bg-slate-300 rounded-2xl flex flex-col p-2 max-h-[90vh] overflow-y-auto",
         )}
      >
         {description}
      </div>
   );
};

export default InfoModal;
