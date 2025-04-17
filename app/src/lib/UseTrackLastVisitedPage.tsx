"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { paths, STORAGE_KEY } from "./settings";
import { ProductType } from "../../prisma/prismaSett";

export default function UseTrackLastVisitedPage() {
   const pathname = usePathname();
   console.log(pathname.slice(1));

   useEffect(() => {
      // record only allowed paths
      if (paths.includes(pathname.slice(1) as ProductType)) {
         try {
            localStorage.setItem(STORAGE_KEY, pathname);
         } catch (error) {
            console.error(
               "Failed to save last visited page to localStorage:",
               error
            );
         }
      }
   }, [pathname]);
   return <></>;
}
