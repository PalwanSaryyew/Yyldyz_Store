"use client";
import { paths } from "@/lib/settings";
import { cn } from "@/utils/tailwindMerge";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductType } from "../../../prisma/prismaSett";

const ItemMenu = () => {
   const currentPath = usePathname();

   return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10 flex flex-col backdrop-blur-[4px] rounded-s-lg overflow-hidden divide-y divide-mainColor border-2 border-r-0 border-mainColor">
         {paths.map((path) => (
            <Link key={path} href={"/" + path} prefetch>
               <div
                  className={cn(
                     currentPath === "/" + path ? "bg-mainColor" : "",
                     "flex-1 p-1 px-2"
                  )}
               >
                  <Image
                     src={`/jtns/${
                        path === ("/" as ProductType) ? "star" : path
                     }.png`}
                     alt=""
                     width={35}
                     height={35}
                  />
               </div>
            </Link>
         ))}
      </div>
   );
};

export default ItemMenu;
