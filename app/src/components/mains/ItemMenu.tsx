"use client";
import { cn } from "@/utils/tailwindMerge";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdMore } from "react-icons/md";
import { paths, productTitle } from "bot/src/settings";
import { BsBookmarkStar, BsBookmarkStarFill } from "react-icons/bs";
import { ProductType } from "@prisma/client";

const ItemMenu = () => {
   const currentPath = usePathname();
   const [active, setActive] = useState(false);
   const [fawPaths, setFawPaths] = useState<string[]>([]); // favori yollar için state
   const [customPaths, setCustomPaths] = useState<string[]>([]); // favori yollar ve normal yolları birleştiren state

   useEffect(() => {
      // Component yüklendiğinde localStorage'dan favori yolları al
      const storedFawPathsRaw = localStorage.getItem("fawPaths");
      const storedFawPaths = storedFawPathsRaw
         ? JSON.parse(storedFawPathsRaw)
         : [];

      setFawPaths(storedFawPaths);
   }, []);

   useEffect(() => {
      // Favori yollar veya ana yollar değiştiğinde customPaths'i güncelle
      // Favori yolları en başa al, ardından diğer yolları ekle
      const nonFawPaths = paths.filter((path) => !fawPaths.includes(path));
      setCustomPaths([...fawPaths, ...nonFawPaths]);
   }, [fawPaths]);

   interface ToggleFavorite {
      (path: string): void;
   }

   const toggleFavorite: ToggleFavorite = (path) => {
      let updatedFawPaths: string[];
      if (fawPaths.includes(path)) {
         // Favorilerden kaldır
         updatedFawPaths = fawPaths.filter((p) => p !== path);
      } else {
         // Favorilere ekle (en başa)
         updatedFawPaths = [path, ...fawPaths];
      }

      setFawPaths(updatedFawPaths); // State'i güncelle
      localStorage.setItem("fawPaths", JSON.stringify(updatedFawPaths)); // localStorage'ı güncelle
   };

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
               "fixed right-0 top-1/2 -translate-y-1/2 z-10 rounded-s-lg border-2 border-r-0 border-mainColor"
            )}
         >
            <div className="overflow-y-auto max-h-[75vh] overflow-clip flex flex-col divide-y divide-mainColor">
               {customPaths.map((path) => (
                  <div
                     key={path}
                     className={cn(
                        currentPath === "/" + path ? "bg-mainColor" : "",
                        "flex items-center"
                     )}
                  >
                     <Link href={"/" + path} prefetch className="flex-1">
                        <div
                           className={cn(
                              "flex-1 p-1 px-2 flex items-center hover:bg-mainColor transition-colors duration-200 ease-in-out cursor-pointer"
                           )}
                        >
                           <Image
                              src={`/jtns/${path === "/" ? "star" : path}.png`}
                              alt=""
                              width={35}
                              height={35}
                           />{" "}
                           <div
                              className={cn(
                                 active ? "w-[75vw] pl-2" : "w-0 pl-0",
                                 " text-white overflow-clip text-sm font-semibold transition-all duration-200 ease-in-out whitespace-nowrap"
                              )}
                           >
                              {productTitle(path as ProductType)}
                           </div>
                        </div>
                     </Link>

                     {active && (
                        <div
                           onClick={() => toggleFavorite(path)}
                           className="p-1 cursor-pointer"
                        >
                           {fawPaths.includes(path) ? (
                              <BsBookmarkStarFill
                                 className="text-yellow-500 hover:text-white transition-colors duration-200 ease-in-out"
                                 size={30}
                              />
                           ) : (
                              <BsBookmarkStar
                                 className="text-white hover:text-yellow-500 transition-colors duration-200 ease-in-out"
                                 size={30}
                              />
                           )}
                        </div>
                     )}
                  </div>
               ))}
            </div>
            <div
               className="flex-1 p-1 px-2 flex items-center hover:bg-mainColor transition-colors duration-200 ease-in-out cursor-pointer border-t-2 border-mainColor"
               onClick={() => setActive(!active)}
            >
               <MdMore
                  className={cn(
                     active ? "rotate-180" : "rotate-0",
                     " text-white transition-all duration-500 ease-in-out animate-bounceX"
                  )}
                  size={35}
               />
            </div>
         </div>
      </>
   );
};

export default ItemMenu;
