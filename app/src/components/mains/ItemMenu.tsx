"use client";
import { cn } from "@/utils/tailwindMerge";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductType } from "../../../prisma/prismaSett";
import { useEffect, useState } from "react";
import { MdMore } from "react-icons/md";
import { paths, productTitle } from "bot/src/settings";

const ItemMenu = () => {
   const currentPath = usePathname();
   const [active, setActive] = useState(false);
   const [customPaths, setCustomPaths] = useState<ProductType[]>([]);

   useEffect(() => {
      const lasptPathsRaw = localStorage.getItem("lasptPaths");
      let updatedCustomPaths: ProductType[] = [];
      if (lasptPathsRaw) {
         const lasptPaths: ProductType[] = lasptPathsRaw
            ? JSON.parse(lasptPathsRaw)
            : [];
         lasptPaths.forEach((lasptPath) => {
            if (!paths.includes(lasptPath)) {
               lasptPaths.splice(lasptPaths.indexOf(lasptPath), 1);
            } else {
               updatedCustomPaths.push(lasptPath);
            }
         });
         paths.forEach((path) => {
            if (!lasptPaths.includes(path)) {
               updatedCustomPaths.push(path);
            }
         });
      } else {
         updatedCustomPaths = [...paths];
      }
      setCustomPaths(updatedCustomPaths);
   }, []);
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
               " fixed right-0 top-1/2 -translate-y-1/2 z-10 rounded-s-lg border-2 border-r-0 border-mainColor"
            )}
         >
            <div className="overflow-y-auto max-h-[75vh] overflow-clip flex flex-col divide-y divide-mainColor">
               {customPaths.map((path) => (
                  <Link key={path} href={"/" + path} prefetch>
                     <div
                        className={cn(
                           currentPath === "/" + path ? "bg-mainColor" : "",
                           "flex-1 p-1 px-2 flex items-center hover:bg-mainColor transition-colors duration-200 ease-in-out cursor-pointer"
                        )}
                        onClick={() => {
                           const lasptPathsRaw =
                              localStorage.getItem("lasptPaths");
                           const lasptPaths: ProductType[] = lasptPathsRaw
                              ? JSON.parse(lasptPathsRaw)
                              : [];
                           if (lasptPaths.includes(path)) {
                              lasptPaths.splice(lasptPaths.indexOf(path), 1);
                           }
                           lasptPaths.unshift(path as ProductType);
                           localStorage.setItem(
                              "lasptPaths",
                              JSON.stringify(lasptPaths)
                           );
                        }}
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
