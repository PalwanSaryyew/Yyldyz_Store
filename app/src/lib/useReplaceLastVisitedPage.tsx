"use client";

import { ProductType } from "@prisma/client";
import { paths, STORAGE_KEY } from "bot/src/settings";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UseReplaceLastVisitedPage() {
   const router = useRouter();

   useEffect(() => {
      const prepair = async () => {
         // prepare WAPAPP
         const WebApp = (await import("@twa-dev/sdk")).default;
         await WebApp.ready();
         let lastVisited = null;
         try {
            // get the last visited page from local storage
            lastVisited = localStorage.getItem(STORAGE_KEY);
         } catch (error) {
            console.error(
               "Failed to read last visited page from localStorage:",
               error
            );
            localStorage.setItem(STORAGE_KEY, "/star");
            router.refresh();
         }

         if (
            lastVisited &&
            paths.includes(lastVisited.slice(1) as ProductType)
         ) {
            router.replace(lastVisited);
         } else {
            localStorage.setItem(STORAGE_KEY, "/star");
            router.refresh();
         }
      };
      prepair();
   }, [router]); // This useeffect usually only works once because the router object will not change.
   return <></>;
}
