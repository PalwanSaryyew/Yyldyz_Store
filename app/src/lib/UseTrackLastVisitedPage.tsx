"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProductType } from "../../prisma/prismaSett";
import { paths, STORAGE_KEY } from "bot/src/settings";

export default function UseTrackLastVisitedPage() {
   const pathname = usePathname();

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
