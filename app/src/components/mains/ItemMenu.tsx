"use client";
import { paths } from "@/lib/settings";
import { cn } from "@/utils/tailwindMerge";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductType } from "../../../prisma/prismaSett";
import { useState } from "react";
import { MdMore } from "react-icons/md";
import { productTitle } from "bot/src/settings";

const ItemMenu = () => {
   const currentPath = usePathname();
   const [active, setActive] = useState(false);

   return (
      <>
         {active && (
            <div
               className="bg-black/35 backdrop-blur-sm fixed inset-0 z-10"
               onClick={() => setActive(!active)}
            ></div>
         )}

         <div
            className={cn(
               active
                  ? "backdrop-blur-[10px] bg-black/35"
                  : "backdrop-blur-[4px]",
               " fixed right-0 top-1/2 -translate-y-1/2 z-10 rounded-s-lg border-2 border-r-0 border-mainColor max-h-[80vh]"
            )}
         >
            <div className="overflow-y-auto flex flex-col divide-y divide-mainColor">
               {paths.map((path) => (
                  <Link key={path} href={"/" + path} prefetch>
                     <div
                        className={cn(
                           currentPath === "/" + path ? "bg-mainColor" : "",
                           "flex-1 p-1 px-2 flex items-center hover:bg-mainColor transition-colors duration-200 ease-in-out cursor-pointer"
                        )}
                     >
                        <Image
                           src={`/jtns/${
                              path === ("/" as ProductType) ? "star" : path
                           }.png`}
                           alt=""
                           width={35}
                           height={35}
                        />{" "}
                        <div
                           className={cn(
                              active ? "w-[75vw] pl-2" : "w-0 pl-0",
                              " text-white overflow-clip  text-sm font-semibold transition-all duration-200 ease-in-out whitespace-nowrap"
                           )}
                        >
                           {productTitle(path)}
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
            <div
               className="flex-1 p-1 px-2 flex items-center hover:bg-mainColor transition-colors duration-200 ease-in-out cursor-pointer border-t-2 border-mainColor"
               onClick={() => setActive(!active)}
            >
               <MdMore
                  className={cn(
                     active ? "rotate-180" : "rotate-0",
                     " text-white transition-all duration-500 ease-in-out"
                  )}
                  size={35}
               />
            </div>
         </div>
      </>
   );
};

export default ItemMenu;
