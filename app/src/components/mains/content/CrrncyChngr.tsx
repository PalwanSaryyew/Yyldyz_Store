"use client";

// import { tonProducts } from "@/lib/settings";
// import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwindMerge";
import { useCurrency } from "@/utils/UniStore";
import { ReactNode } from "react";

interface CrrncyChngrProps {
   crrncy: "USDT" | "TMT" | "TON";
   children: ReactNode;
}

const CrrncyChngr = ({ crrncy, children }: CrrncyChngrProps) => {
   const changeCurrency = useCurrency((state) => state.change);
   const bg = cn(
      crrncy === "USDT"
         ? " bg-[#4FAC92]"
         : crrncy === "TMT"
         ? " bg-[#BC686A]"
         : " bg-[#009BED]"
   );
   /* const currentPath = usePathname();
   if (!tonProducts.includes(currentPath) && crrncy === "TON") {
      changeCurrency("TMT");
      return null;
   } */
   return (
      <div
         className={`flex-1 flex items-center justify-center py-1 ${bg}`}
         onClick={() => {
            changeCurrency(crrncy);
         }}
      >
         {children}
      </div>
   );
};

export default CrrncyChngr;
