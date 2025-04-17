"use client";

import React from "react";
import { cn } from "@/utils/tailwindMerge";
import { useCurrency } from "@/utils/UniStore";

const MainboxColor = ({ children }: { children: React.ReactNode }) => {
   const currency = useCurrency((state) => state.currency);
   const border = cn(
      currency === "TMT"
         ? "border-tmtColor"
         : currency === "TON"
         ? "border-tonColor"
         : "border-usdtColor"
   );
   return (
      <main className={`relative w-[90%] mx-auto mb-48`}>
         <div
            className={`${border} backdrop-blur-[1.25px] w-[98%] rounded-b-3xl border-[2px]`}
         >
            {children}
         </div>
      </main>
   );
};

export default MainboxColor;
