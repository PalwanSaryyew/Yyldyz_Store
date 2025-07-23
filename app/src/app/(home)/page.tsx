"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductType } from "../../../prisma/prismaSett";
import Image from "next/image";
import { paths, STORAGE_KEY } from "bot/src/settings";

export default function HomePage() {
   const router = useRouter();

   useEffect(() => {
      const prepair = async () => {
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
      prepair()
   }, [router]); // This useeffect usually only works once because the router object will not change.
   return (
      <div className="text-white flex items-center justify-center h-[75vh] text-lg">
         <Image
            src={"/svg/star.svg"}
            width={75}
            height={75}
            alt="Loading"
            className="animate-ping"
            rel="preload"
            priority
         />
      </div>
   );
}
